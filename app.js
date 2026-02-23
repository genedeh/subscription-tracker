import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);


app.get('/', (req, res) => {
    res.send('Welcome')
})

app.listen(PORT, async() => {
    console.log(`Subscription tracker api running on http://localhost:${PORT}`);
    console.log('Connecting to database........')

    await connectToDatabase();
})

export default app;