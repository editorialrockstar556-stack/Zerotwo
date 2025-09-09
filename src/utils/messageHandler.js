import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const PREFIX = process.env.COMMAND_PREFIX || ".";

export default async function messageHandler(msg) {
  const from = msg.from;
  const text = msg.text?.body || "";
  
  if (!text.startsWith(PREFIX)) return;

  const [cmd, ...args] = text.slice(PREFIX.length).split(" ");
  const commandFile = path.resolve(`src/commands/${cmd}.js`);
  
  if (fs.existsSync(commandFile)) {
    const command = await import(`../commands/${cmd}.js`);
    await command.default(from, args);
  } else {
    await sendMessage(from, `Unknown command: ${cmd}`);
  }
}

export async function sendMessage(to, body) {
  await axios.post(
    `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}