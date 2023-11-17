const express = require("express");
const router = express.Router();
import WAWebJS from "whatsapp-web.js";
import { verifyAccessToken } from "../middleware/authenticateUser";
const OpenAiClient = require('../utils/openAIClient')
const WhatsappWebClient = require('../utils/whatsappClient')
const qrcode = require('qrcode-terminal')

const getResponseFromChatGPT = async (messageBody: string) => {
    const OpenAiClientSingleton = OpenAiClient.getInstance()
    const res = await OpenAiClientSingleton.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: messageBody }],
    })
    const message = await res.choices[0].message.content
    return message;
}

router.get('/', verifyAccessToken, (req: Request, res: Response) => {
    const OpenAiClientSingleton = OpenAiClient.getInstance()
    const WhatsappWebClientSingleton = WhatsappWebClient.getInstance()

    WhatsappWebClientSingleton.on('qr', (qr: string) => {
        qrcode.generate(qr, {small: true})
        console.log(qr)
    })

    WhatsappWebClientSingleton.on('ready', async () => {
        WhatsappWebClientSingleton.on('message', async (msg: WAWebJS.Message) => {
            console.log(msg);
        })  
    })
})

module.exports = router;