const { Configuration, OpenAIApi  } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY,
});

export async function chat(text: string){
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    max_tokens: 2048,
  });
  return completion;
}

