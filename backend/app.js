const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
require("dotenv").config();

const { connectDatabase } = require("./config/db");
const analyzeRoute = require("./routes/analyze");
const projectsRoute = require("./routes/projects");
const usersRoute = require("./routes/users");
const webhooksRoute = require("./routes/webhooks");

const app = express();
const PORT = process.env.PORT || 9090;

const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...configuredOrigins,
  "http://localhost:3001",
  "http://localhost:3002",
]);

function isLocalDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(origin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server and local tools without an Origin header.
      if (!origin || allowedOrigins.has(origin) || isLocalDevOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));
app.use(clerkMiddleware());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

app.use("/analyze", analyzeRoute);
app.use("/projects", projectsRoute);
app.use("/users", usersRoute);
app.use("/webhook", webhooksRoute);

app.use((err, _req, res, _next) => {
  console.error("[UNHANDLED_ERROR]", err);
  res.status(err.statusCode || 500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV === "production" ? undefined : err.message,
  });
});

if (require.main === module) {
  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`\n🔐 Security Analyzer Backend`);
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 API endpoint: http://localhost:${PORT}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
        console.log(`\n✅ Ready for analysis\n`);
      });
    })
    .catch((error) => {
      console.error("[DB] Failed to connect", error.message);
      process.exit(1);
    });
}

module.exports = app;
