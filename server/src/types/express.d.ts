import type { IMemberDocument } from "../models/member.model";

declare global {
  namespace Express {
    interface Request {
      member?: IMemberDocument;
      admin?: IMemberDocument;
    }
  }
}
