const cron = require("node-cron");
const db = require("../config/db");
const { sendPushNotification } = require("../services/snsService")

const checkMissedCheckIns = async () => {
    try {
        const { rows: missedCheckIns } = await db.query(
            `SELECT 
                ta.id AS ta_id,
                ta.first_name,
                ta.last_name,
                ta.phone,
                ta.class_time,
                ta.course_id,
                p.id AS prof_id,
                p.name AS prof_name,
                p.fcm_token AS fcm_token
            FROM teaching_assistants ta
            JOIN professors p ON ta.course_id = p.course_id 
            WHERE ta.class_time <= NOW() + INTERVAL '1 hour'
            AND ta.class_time >= NOW()
            AND NOT EXISTS (
                SELECT 1 FROM check_ins ci
                WHERE ci.ta_id = ta.id
                AND ci.time <= ta.class_time - INTERVAL '1 hour'
                AND ci.time::date = NOW()::date
            )`
        );         

        if (!missedCheckIns.length) return;

        const professorMap = {};

        missedCheckIns.forEach((missedCheckIn) => {
            const { prof_id, prof_name, fcm_token, first_name, last_name, phone } = missedCheckIn;

            if (!professorMap[prof_id]) {
                professorMap[prof_id] = {
                    profName: prof_name,
                    fcmToken: fcm_token,
                    missedTAs: []
                }
            }

            professorMap[prof_id].missedTAs.push({
                firstName: first_name,
                lastName: last_name,
                phone
            })
        });

        for (const prof in professorMap) {
            if (!prof.fcmToken) continue;
            
            const taList = prof.missedTAs.map(({ firstName, lastName, phone }) => `${firstName} ${lastName} - ${phone}`).join("\n");
            const message =  `The following TAs missed their check-ins:\n ${taList}`;

            await sendPushNotification(message, prof.fcmToken);
        }

    } catch (error) {
        console.log("Error fetching missing check ins", error);
        throw new Error('Error fetching missed check-ins from the database');
    }
}

cron.schedule('* * * * * *', async () => {
    await checkMissedCheckIns();
}, {
    scheduled: true,
    timezone: "America/New_York"
})

/**
 * Need to modify message for section number or room number
 */