const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", service: "test-project-backend" });
});

app.use("/api/v1/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ error: "NOT_FOUND", path: req.path });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`POST /api/v1/auth/register`);
  console.log(`POST /api/v1/auth/login`);
  console.log(`POST /api/v1/auth/logout`);
});
