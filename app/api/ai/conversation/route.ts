import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY ?? "",
})

const openai = new OpenAIApi(configuration)

export async function POST(req: NextRequest) {

    const body = await req.json()
    const { messages } = body;

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
    });

    return NextResponse.json(response.data.choices[0].message)
} 