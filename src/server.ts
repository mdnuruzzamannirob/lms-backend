import app from "./app";
import { connectDB } from "./db";
import { config } from "./config";

const startServer = async () => {
  await connectDB();

  const server = app.listen(config.PORT, () => {
    console.log(
      `[server] Running in ${config.NODE_ENV} mode on http://localhost:${config.PORT}`,
    );
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\n[server] ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("[server] Closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("unhandledRejection", (err: Error) => {
    console.error("[server] Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
