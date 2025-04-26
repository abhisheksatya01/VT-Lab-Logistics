const express = require("express");
const router = express.Router();
const { subscribeToNotifications, unsubscribeFromNotifications } = require("../controllers/notificationController");

router.post("/subscribe", subscribeToNotifications);
router.delete("/unsubscribe", unsubscribeFromNotifications);

module.exports = router;