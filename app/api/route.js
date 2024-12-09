import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* Initialize conversation history: */
let conversationHistory = "";

export async function POST(request) {
  /* Create a new instance of the Generative AI and choose model: */
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are a compassionate and empathetic virtual therapist.
                        Your role is to listen carefully to the user, ask thoughtful
                        questions, and provide supportive guidance focused on the user's
                        emotional well-being. You offer support in a calming, reassuring way.
                        You are also capable of responding to a variety of general inquiries
                        and requests. When users ask for information, music recommendations,
                        or even the weather, provide helpful and accurate answers in a warm
                        manner. Don't be too rigid. Be relatable and adaptable, feel free
                        to adapt according to users needs. Avoid assuming the user's emotions or state
                        of mind; let the user express themselves first. When the user begins
                        with a casual greeting, simply respond with a warm, friendly greeting
                        in return, without formalities or framing it as a "new conversation."
                        Allow the user to lead the direction and tone of each chat. Don't include
                        the "user" or "AI" tags in the final response. Thank you!`
  });
  
  try {
    /* Get prompt from user: */
    const { prompt } = await request.json();
    
    /* Add user's message to conversation history: */
    conversationHistory += `User: ${prompt}\n`;

    /* Get response from Gemini API: */
    const result = await model.generateContent(conversationHistory);
    const response = await result.response;
    const text = response.text();

    /* Add AI's response to conversation history: */
    conversationHistory += `AI: ${text}\n`;
    return NextResponse.json({ text });
  } 
  catch (error) {
    console.error("Error in API Call:", error.message);
    console.error("Full Error Details:", error);
    return NextResponse.json({ error: "Error generating response" }, { status: 500 });
  }
}