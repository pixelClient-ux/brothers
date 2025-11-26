export interface AdminType {
  _id: string;
  fullName: string;
  email: string;
  avatar?: {
    url: string;
    publicId: string;
  };
}
