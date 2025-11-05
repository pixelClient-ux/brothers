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

  // ✅ 1. Filtering
  filter() {
    const queryObj: Record<string, any> = { ...this.queryString };
    const excludeQuery = ["page", "sort", "search"];
    excludeQuery.forEach((key) => delete queryObj[key]);

    if (queryObj.status && queryObj.status !== "all") {
      queryObj.status = queryObj.status;
    }
    this.query = this.query.find(queryObj);
    return this;
  }

  // ✅ 2. Searching (by name or phone)
  search() {
    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, "i");
      this.query = this.query.find({
        $or: [{ fullName: regex }, { phone: regex }],
      });
    }
    return this;
  }

  sort() {
    const timeRange = this.queryString.sort || "all";
    const now = new Date();
    let filterDate: Date | null = null;

    switch (timeRange) {
      case "7d":
        filterDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "1m":
        filterDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "3m":
        filterDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "1y":
        filterDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "all":
      default:
        filterDate = null;
    }

    if (filterDate) {
      this.query = this.query.find({ createdAt: { $gte: filterDate } });
    }

    // Default sorting: newest first
    this.query = this.query.sort({ createdAt: -1 });

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
