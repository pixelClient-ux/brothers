// src/utils/ApiFeature.ts
import { Document, Query } from "mongoose";

interface QueryStringProps {
  page?: string;
  sort?: string;
  search?: string;
  status?: string;
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
    const queryObj: Record<string, any> = { ...this.queryString };
    const excludeQuery = ["page", "sort", "search", "range"];
    excludeQuery.forEach((key) => delete queryObj[key]);

    if (queryObj.status && queryObj.status !== "all") {
      this.query = this.query.find({ "membership.status": queryObj.status });
    }
    if (!this.queryString.sort) {
      this.query = this.query.sort({ createdAt: -1 });
    }

    return this;
  }

  search() {
    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, "i");
      this.query = this.query.find({
        $or: [{ fullName: regex }, { phone: regex }],
      });
    }
    return this;
  }

  range() {
    const timeRange = this.queryString.range;
    if (!timeRange || timeRange === "all") return this;

    const now = new Date();
    let filterDate: Date | null = null;

    const days = Number(timeRange);
    if (!isNaN(days)) {
      filterDate = new Date(now);
      filterDate.setDate(now.getDate() - days);
    }

    if (filterDate) {
      console.log("🔎 Filtering createdAt from:", filterDate.toISOString());
      this.query = this.query.find({
        createdAt: { $gte: filterDate },
      });
    }

    return this;
  }

  // ✅ 4. Pagination
  pagination() {
    const limit = 10;
    const page = Number(this.queryString.page) || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
