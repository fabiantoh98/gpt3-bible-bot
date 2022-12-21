import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
Tell me a bible verse with the topic below:

topic:
`
const generateAction = async(req, res) =>{
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.7,
        max_tokens: 250,
    });

    const basePromptOutput = baseCompletion.data.choices.pop();
    const verse = basePromptOutput.text
    console.log(verse)
    const secondPrompt = `
    Take the topic and verse below and generate an explanation for the verse used:
    
    topic: ${req.body.userInput}

    verse: ${verse}

    explanation:
    `

    const secondPromptCompletion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${secondPrompt}`,
        temperature: 0.5,
        max_tokens: 300,
    })
    const secondPromptOuput = secondPromptCompletion.data.choices.pop();
    res.status(200).json({output: secondPromptOuput, verse: verse});
};

export default generateAction