// src/utils/ApiFeature.ts
import mongoose, { Document, Query } from "mongoose";

interface QueryStringProps {
  q?: string; // ← New: from frontend
  search?: string; // ← Old: backward compatibility
  status?: string;
  range?: string;
  page?: string;
  sort?: string;
  [key: string]: any;
}

export default class ApiFeature<T extends Document> {
  public query: Query<T[], T>;
  public queryString: QueryStringProps;

  constructor(query: Query<T[], T>, queryString: QueryStringProps) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["q", "search", "page", "sort", "range"];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (queryObj.status && queryObj.status !== "all") {
      this.query = this.query.find({ "membership.status": queryObj.status });
    }

    if (!this.queryString.sort) {
      this.query = this.query.sort({ createdAt: -1 });
    }

    return this;
  }

  search() {
    const term = this.queryString.q || this.queryString.search;

    if (term?.trim()) {
      const regex = new RegExp(term.trim(), "i");

      const orConditions: any[] = [
        { fullName: regex },
        { phone: regex },
        { email: regex },
      ];

      // allow ID search ONLY if valid ObjectId
      if (mongoose.Types.ObjectId.isValid(term.trim())) {
        orConditions.push({ _id: term.trim() });
      }

      this.query = this.query.find({ $or: orConditions });
    }

    return this;
  }

  range() {
    const range = this.queryString.range;
    if (!range || range === "all") return this;

    const now = new Date();
    const days = Number(range);
    if (isNaN(days) || days <= 0) return this;

    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - days);

    this.query = this.query.find({
      createdAt: { $gte: pastDate },
    });

    return this;
  }

  pagination() {
    const limit = 10;
    const page = Number(this.queryString.page) || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
