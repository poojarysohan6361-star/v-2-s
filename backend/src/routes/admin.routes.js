const express = require("express");
const { handleAdminDashboard, handleForceEnd } = require("../controllers/admin.controller");
const { apiKeyAuth } = require("../middleware/auth");

const router = express.Router();

router.use(apiKeyAuth);

router.get("/dashboard", handleAdminDashboard);
router.post("/force-end", handleForceEnd);

module.exports = router;
