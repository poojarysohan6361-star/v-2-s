function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message || err);

  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
