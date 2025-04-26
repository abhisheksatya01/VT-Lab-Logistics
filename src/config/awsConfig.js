const { SNSClient } = require("@aws-sdk/client-sns");

const REGION = process.env.AWS_REGION || "us-east-1";
const accessKey = process.env.AWS_ACCESS_KEY || "AKIA2DDXJV5HODOKJZC5";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "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";
const appARN = process.env.AWS_APP_ARN || "arn:aws:sns:us-east-1:693887414094:endpoint/GCM/VTCheckIn/df4dcccb-cd86-32e3-b3c5-67c0a54b714e";
let snsClient = null;


const getSNSClient = () => {
    if (!snsClient) {
        snsClient = new SNSClient({
            region: REGION,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey
            }
        })
    }

    return snsClient;
}

module.exports = { getSNSClient };

// snsClient = new SNSClient({ region: REGION,
// credentials: {
//     accessKeyId: "AKIA2DDXJV5HODOKJZC5",
//     secretAccessKey: "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"
// }});

