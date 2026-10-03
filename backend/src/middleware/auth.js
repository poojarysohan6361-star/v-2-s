function apiKeyAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    return res.status(500).json({ error: "Admin API key not configured" });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  next();
}

module.exports = { apiKeyAuth };
