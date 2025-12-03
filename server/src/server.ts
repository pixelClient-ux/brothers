import dotenv from "dotenv";
import app from "./index.js";
import { connectDb } from "./config/db.js";
dotenv.config();

const port = process.env.PORT || 5000;

process.on("uncaughtException", (reason: any) => {
  console.log("uncaughtException", reason);
  process.exit();
});
let server: ReturnType<typeof app.listen>;
const startServer = async () => {
  await connectDb();
  server = app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
};
startServer();
process.on("unhandledRejection", (reason: any) => {
  console.error("❌ Unhandled Rejection:", reason);
  if (server) {
    server.close(() => {
      console.log("💥 Server closed due to unhandled promise rejection");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
