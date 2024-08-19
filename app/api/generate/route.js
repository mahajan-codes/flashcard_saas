import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;
export async function POST(req) {
  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY, // Use process.env to access environment variables securely
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000/", // for including your app on openrouter.ai rankings.
        "X-Title": "Flash_card Bot", // Shows in rankings on openrouter.ai.
      },
    }); // Create a new instance of the OpenAI client

    const data = await req.text();

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt }, // system prompt instructs the AI on how to create flashcards.
        { role: "user", content: data }, // A ‘user’ message contains the input text from the request body.
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free", // Specify the model to use
      response_format: { type: "json_object" }, // set the `response_format` to ‘json_object’ to ensure we receive a JSON response
    });

    // Parse the JSON response from the OpenAI API
    // The response is expected to be in the format specified in our system prompt, with a `flashcards` array containing objects with `front` and `back` properties.
    const flashcards = JSON.parse(completion.choices[0].message.content);
    // `NextResponse.json()`. This sends the flashcards back to the client as a JSON response.
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error in POST /api/chat:", error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 400 }); // Return a 400 Bad Request response with the error message
  }
}
