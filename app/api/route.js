import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function POST(request) {
  /* Create a new instance of the Generative AI and choose model: */
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    /* Get prompt from user: */
    const { prompt } = await request.json();

    /* Get response from Gemini API: */
    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    const text = response.text();
    // Debug:
    // console.error("Response from AI:", text);
    return NextResponse.json({ text });
    // return new Response(text);
  } 
  catch (error) {
    console.error("Error in API Call:", error.message);
    console.error("Full Error Details:", error);
    return NextResponse.json({ error: "Error generating response" }, { status: 500 });
  }
}