const db = require("../config/db");

const registerNotificationUUID = async (profId, endpointUUID) => {
    try {
        const query = `UPDATE professors SET fcm_token = ? WHERE id = ?`;
        await db.execute(query, [ endpointUUID, profId ]);
    } catch (error) {
        throw new Error("Unable to register FCM Token for notifications!");
    }
}

const getFCMTokenUUID = async (profId) => {
    try {
        const query = `SELECT p.fcm_token FROM professors p WHERE id = ?`;
        const { rows: tokens } =  await db.execute(query, [ profId ]);

        return {
            uuid: tokens.length > 0 ? tokens[0] : null
        }
        
    } catch (error) {
        throw new Error("Unable to fetch FCM Token!");
    }
}

module.exports = { registerNotificationUUID, getFCMTokenUUID };