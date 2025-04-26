const { CreatePlatformEndpointCommand, DeleteEndpointCommand, PublishCommand } = require("@aws-sdk/client-sns")
const { getSNSClient } = require("../config/awsConfig");
const { getUUIDFromEndpoint } = require("../utils/utils")

const appARN = process.env.AWS_SNS_APP_ARN || "arn:aws:sns:us-east-1:693887414094:endpoint/GCM/VTCheckIn";

const subscribe = async (profId, fcmToken) => {
    try {
        const client = getSNSClient();
        const command = new CreatePlatformEndpointCommand({
            PlatformApplicationArn: appARN,
            Token: fcmToken,
            CustomUserData: profId
        })

        const { EndpointArn } = await client.send(command);
        const uuid = getUUIDFromEndpoint(EndpointArn);
        return { uuid };
    } catch (error) {
        throw new Error("Unable to subscribe to notifications");
    }
}

const unsubscribe = async (uuid = null) => {
    if (!uuid) return;

    try {
        const client = getSNSClient();
        const endpointArn = `${appARN}/${uuid}`;
        const command = new DeleteEndpointCommand({
            EndpointArn: endpointArn
        })
        
        await client.send(command);
    } catch (error) {
        throw new Error("Unable to unsubscribe to notifications");
    }
}

const sendPushNotification = async (messageBody, endpointUUID) => {
    try {
        const client = getSNSClient();
        const message = {
            default: "Failed to send notification",
            GCM: JSON.stringify({
                notification: {
                    title: "Missed Check Ins",
                    body: messageBody,
                    sound: "default"
                }
            })
        }

        const publishCommand = new PublishCommand({
            MessageStructure: 'json',
            TargetArn: `${appARN}/${endpointUUID}`,
            Message: JSON.stringify(message),
        });

        await client.send(publishCommand);
    } catch (error) {
        console.log(error);
        // throw new Error("Unable to send push notification!");
    }
}

sendPushNotification("Hello from NodeJS", "df4dcccb-cd86-32e3-b3c5-67c0a54b714e");

module.exports = { subscribe, unsubscribe, sendPushNotification };

// "dH57lI-tSNynojpLqvSg9c:APA91bHDQc88jwtuOqMXWC3j8m_sF0VwSca-8GuNCvCZRNIGXaOBidNUn-5_Y6OV7HPG5llJrfuxIJYR-bcr5syvm2f2wUenU2cD_cWoIF1y6cEVpvDtY9s"
/** NEXT STEPS
 * Lab GTA Check In                         - App Name
 * Chemistry Lab GTA Check In Application   - Project Name
 * 
 * May 27th -> May 1st - 20 days left
 * 
 * Implement VT login middleware on mobile app
 * Plug the database with dummy data
 * Verify date specific cron job
 * 
 * How to deploy
 * Google Store and App Store
 * Penn testing
 * 
 * AWS Account with root user and Abhishek needs admin access.
 * I will need an accessKey and secretAccess
 */

/**
 * TA logs in. DB verifies whether they are existing in TA database
 */

/**
 * Check sharepoint list
 */

