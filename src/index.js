import express from "express";
import dotenv from "dotenv";
import messageHandler from "./utils/messageHandler.js";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook receiver
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (entry) {
      await messageHandler(entry);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));