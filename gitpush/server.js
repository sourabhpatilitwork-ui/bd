
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");


require('dotenv').config();  // Load .env variables

const app = express();
const PORT = 3000;








app.use(cors());
app.use(bodyParser.json());

// Twilio credentials from .env
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

app.post("/send-sms", async (req, res) => {
    const { phone, message } = req.body;

    try {
        const sms = await client.messages.create({
            body: message,
            from: TWILIO_NUMBER,
            to: phone
        });

        res.json({ success: true, sid: sms.sid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);


});
