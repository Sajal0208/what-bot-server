const OpenAIApi = require('openai')
const Configuration = require('openai')

class OpenAiClient {
  private static instance: OpenAiClient;

  private constructor() {
    OpenAiClient.instance = new OpenAIApi(
        new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        })
    )
  }

  public static getInstance(): OpenAiClient {
    if (!OpenAiClient.instance) {
      OpenAiClient.instance = new OpenAiClient();
    }
    return OpenAiClient.instance;
  }
}
