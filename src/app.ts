import express from "express";
import authRouter from "./routes/auth.route.ts";
import userRouter from "./routes/user.route.ts";
import subscriptionRouter from "./routes/subscription.route.ts";
import { PORT } from "./config/env.ts";
import connectToDatabase from "./database/mongodb.ts";
import errorMiddleware from "./middlewares/error.middleware.ts";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(PORT, async () => {
  console.log(`Subscription tracker api running on http://localhost:${PORT}`);
  console.log("Connecting to database........");

  await connectToDatabase();
});

export default app;
