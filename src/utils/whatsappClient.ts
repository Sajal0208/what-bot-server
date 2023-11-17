const { Client } = require('whatsapp-web.js')

class WhatsappWebClient {
    private static instance: WhatsappWebClient;

    private constructor() {
        WhatsappWebClient.instance = new Client({})
    }

    public static getInstance(): WhatsappWebClient {
        if(!WhatsappWebClient.instance) {
            WhatsappWebClient.instance = new WhatsappWebClient();
        } 
        return WhatsappWebClient.instance;
    }
}