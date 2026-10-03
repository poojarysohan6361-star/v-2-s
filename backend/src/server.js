require("dotenv").config();
const app = require("./app");
const { getPrisma } = require("./config/db");

const PORT = process.env.PORT || 3001;

async function start() {
  const prisma = getPrisma();

  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

start();
