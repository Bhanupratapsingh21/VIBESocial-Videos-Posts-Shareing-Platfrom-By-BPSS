import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import logger from "./middlewares/logger.js"
import client, { register } from "prom-client"
import responseTime from "response-time"

// ─── Env Loading via dotenv ─────────────────────────────────────────────────────────────
dotenv.config({
    path: "./env"
})


// ─── Init Express App  ─────────────────────────────────────────────────────────────
const app = express();

// ─── Prometheus collection for metrics ─────────────────────────────────────────────────────────────
const collectionDefaultMetrics = client.collectDefaultMetrics;

collectionDefaultMetrics({ register: client.register });
const reqResTime = new client.Histogram({
    name: "http_express_server",
    help: "this tells how much time each route has taken",
    labelNames: ["method", "route", "status_code"],
    buckets: [1, 50, 100, 150, 200, 500, 400, 2000]
})
const totalReqCounter = new client.Counter({
    name: "total_req",
    help: "total req on server"
})

// ─── ENABLE CORS ─────────────────────────────────────────────────────────────

const corsarry = [
    process.env.CORS_ORIGIN1,
    process.env.CORS_ORIGIN2,
    process.env.CORS_ORIGIN3,
]

/// use is used for middle wares or configration parts
app.use(cors({
    origin: corsarry,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}))



// ─── BODY PARSERS ─────────────────────────────────────────────────────────────
app.use(express.json({
    limit: "16kb",
}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("Public"))


// ─── LOGGING ─────────────────────────────────────────────────────────────────
app.use(logger);

app.use(responseTime((req, res, time) => {
    totalReqCounter.inc();
    reqResTime
        .labels(req.method, req.url, res.statusCode.toString())
        .observe(time);
}));
app.use(cookieParser())
app.get("/checkhealthstatus", healthcheck);


// ─── Prometheus Route ─────────────────────────────────────────────────────────────
app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType)
    const metrics = await client.register.metrics();
    res.send(metrics);
})



// ─── ROUTES ──────────────────────────────────────────────────────────────────
import userRouter from "./routes/user.routes.js"
import TweetsRouter from "./routes/tweets.routes.js"
import Videorouter from "./routes/video.routes.js"
import LikeRouter from "./routes/like.routes.js"
import CommentRouter from "./routes/comments.routes.js"
import PlaylistRouter from "./routes/playlist.routes.js"
import SubscriptionRouter from "./routes/subscription.routes.js"
import { healthcheck } from "./controllers/healthcheck.controller.js"
import globalsearchRouter from "./routes/globalsearch.routes.js";


// ─── ROUTES Declaration ──────────────────────────────────────────────────────────────────
app.use('/api/v1/users', userRouter);
app.use("/api/v1/tweets", TweetsRouter);
app.use("/api/v1/videos", Videorouter);
app.use("/api/v1/like", LikeRouter)
app.use("/api/v1/comment", CommentRouter);
app.use("/api/v1/playlist", PlaylistRouter);
app.use("/api/v1/subscriptions", SubscriptionRouter);
app.use("/api/v1/search", globalsearchRouter);

export { app }