const express = require("express");
const { Client } = require("pg");
const { createClient } = require("redis");
const os = require("os");

const app = express();
const port = 3000;
const db = new Client({ connectionString: process.env.DATABASE_URL });
const redis = createClient({ url: `redis://${process.env.REDIS_HOST || "redis"}:6379` });

redis.on("error", (err) => console.error("Redis error:", err.message));

async function initDb() {
  let attempts = 10;
  while (attempts > 0) {
    try {
      await db.connect();
      await db.query("CREATE TABLE IF NOT EXISTS visits (id SERIAL PRIMARY KEY, count INTEGER NOT NULL);");
      console.log("PostgreSQL connected.");
      return;
    } catch (error) {
      attempts--;
      if (attempts === 0) throw error;
      console.log(`PostgreSQL not ready. Retrying... (${attempts} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

async function initRedis() {
  await redis.connect();
  console.log("Redis connected.");
}

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT count FROM visits WHERE id = 1");
    const count = result.rows.length ? result.rows[0].count + 1 : 1;
    if (result.rows.length) {
      await db.query("UPDATE visits SET count = $1 WHERE id = 1", [count]);
    } else {
      await db.query("INSERT INTO visits (id, count) VALUES (1, $1)", [count]);
    }
    await redis.set("last_visit", count);
    const cachedValue = await redis.get("last_visit");
    res.send(`<!DOCTYPE html><html><head><title>Day 34 - Docker Compose</title></head><body><h1>Docker Compose Multi-Container Application</h1><h2>Visit count: ${count}</h2><p>Cached value: ${cachedValue}</p><p>Container: ${os.hostname()}</p><p>Node.js + PostgreSQL + Redis</p></body></html>`);
  } catch (error) {
    console.error("Request error:", error.message);
    res.status(500).send(`<h1>Application Error</h1><p>${error.message}</p>`);
  }
});

app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    await redis.ping();
    res.status(200).json({ status: "healthy", database: "connected", redis: "connected" });
  } catch (error) {
    res.status(503).json({ status: "unhealthy", error: error.message });
  }
});

async function startApp() {
  await initDb();
  await initRedis();
  app.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}`));
}

async function shutdown() {
  await db.end();
  if (redis.isOpen) await redis.quit();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
startApp().catch((error) => { console.error("Failed to start application:", error); process.exit(1); });
