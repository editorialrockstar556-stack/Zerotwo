import { sendMessage } from "../utils/messageHandler.js";

export default async function (to) {
  await sendMessage(to, "👋 Hello! I'm your WhatsApp Bot!");
}