const { subscribe, unsubscribe } = require("../services/snsService");
const { registerNotificationUUID } = require("../services/notificationService");

const subscribeToNotifications = async (req, res) => {
    const { fcmToken, id: profId } = req.body;
    try {
        const { uuid } = await subscribe(profId, fcmToken);
        await registerNotificationUUID(profId, uuid);        
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const unsubscribeFromNotifications = async (req, res) => {
    const { id: profId } = req.body;
    try {
        const { uuid } = await getFCMTokenUUID(profId);
        await unsubscribe(uuid);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = { subscribeToNotifications, unsubscribeFromNotifications }