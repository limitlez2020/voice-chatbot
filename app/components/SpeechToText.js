"use client";

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MicrophoneIcon } from '@heroicons/react/24/outline';


export default function SpeechToText() {
  /* State to know whether the browser supports speech recognition */
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(true);
  /* Ref for transcript and AI Response: */
  const transcriptRef = useRef(null);
  const aiResponseRef = useRef(null);
  /* State for the AI's response */
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiSpeaking, setAISpeaking] = useState(false);

  
  /* Get the necessary properties from the useSpeechRecognition hook */
  const {
    transcript,
    listening, /* Bool -- is mic listening */
    resetTranscript,
  } = useSpeechRecognition();

  /* Check if the browser supports speech recognition */
  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    setSupportsSpeechRecognition(false);
  }


  /* Function to start recording: */
  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
    resetTranscript();

    /* Set the speaking state of AI to false: */
    setAISpeaking(false);
  };

  /* Function to stop recording: */ 
  const stopRecording = () => {
    SpeechRecognition.stopListening();
    /* Send the user's message to the AI and get response: */
    getAIResponse(transcript);

    /* Set the speaking state of AI to true: */
    setAISpeaking(true);
  };


  /* Automatic scrolling to the bottom of the transcript: */
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  /* Automatic scrolling to the bottom of the aiResponse: */
  useEffect(() => {
    if (aiResponseRef.current) {
      aiResponseRef.current.scrollTop = aiResponseRef.current.scrollHeight;
    }
  }, [aiResponse]);



  /* Function for the AI to speak to the user: */
  const speak = (text) => {
    setAISpeaking(true);
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.2;
    utterance.pitch = 2;
    window.speechSynthesis.speak(utterance);
  };


  /* Function to simulate typing effect for the AI response: */
  const simulateTyping = (text) => {
    /* Make sure text is valid: */
    if (!text || typeof text !== "string") {
      return;
    }

    /* Initiaize the response with the first char: */
    setAIResponse('');

    /* Index for accessing chars:
     * NOTE: Start at -1 so that the first char is at index 0
     * We do this because we increment the index before accessing the char 
     * because the setAIResponse function is asynchronous so by time it is
     * called the first time, the index would have already been increased */
    let index = -1;
    
    /* Use the setInterval method -- it performs the code, with a delay
    * Here, we'll add a char from the text to the AI Response state every 50ms */
    let delay = 50;
    const interval = setInterval(() => {
      if (index < text.length - 1) {
        setAIResponse((prev) => prev + text[index]);
        index++;
      }
      else {
        clearInterval(interval); /* Stop the interval */
      }
    }, delay); /* Typing speed */
  };


  /* Function to send the user's message to the AI and get Response: */
  const getAIResponse = async (userInput) => {
    setLoading(true);
    try {
      /* Send the user's message to the API: */
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      /* Check if the response is okay: */
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      /* Get the response from the AI API: */
      const data = await response.json();

      /* Type and speak the response from the AI */
      simulateTyping(data.text);
      speak(data.text);
    } 
    catch (error) {
      console.error("Error fetching AI response:", error);
      setAIResponse("Sorry, I am having trouble responding right now.")
    }
    finally {
      setLoading(false);
    }
  };


  
  return (
    
    <div>
      {supportsSpeechRecognition ? (
        <div className='w-full h-screen min-h-full relative bg-[#fcf5eb] flex flex-col items-center'>
          {/* Background Noise Texture: */}
          <div className='absolute w-full h-full opacity-5 bg-noise-pattern'></div>

          {/* Header: */}
          <div className='font-semibold text-xl pt-7 mb-28'>
            Voice Chatbot
          </div>

          {/* AI Voice Character: */}
          <div className='size-56 mb-28'>
            {aiSpeaking ? (
              /* Animation for AI speaking -- wave: */
              <div className='flex flex-row items-center justify-center gap-2 h-4/5 w-full'>
                <div className='w-1/6 bg-gradient-to-r from-[#24D368] to-[#79E8B3] rounded-full
                                border-black border-2 animate-speaking-wave' style={{ animationDelay: '0.2s'}}/>
                <div className='w-1/6 bg-gradient-to-r from-[#24D368] to-[#79E8B3] rounded-full
                                border-black border-2 animate-speaking-wave' style={{ animationDelay: '0.4s'}}/>
                <div className='w-1/6 bg-gradient-to-r from-[#24D368] to-[#79E8B3] rounded-full
                                border-black border-2 animate-speaking-wave' style={{ animationDelay: '0.6s'}}/>
                <div className='w-1/6 bg-gradient-to-r from-[#24D368] to-[#79E8B3] rounded-full
                                border-black border-2 animate-speaking-wave' style={{ animationDelay: '0.8s'}}/>
              </div>
            ) : (
              /* No animation: */
              <div className='h-full w-full border-black border-[2px] bg-gradient-to-r from-[#24D368] to-[#79E8B3] rounded-full animate-listening'/>
            )}
          </div>

          {/* Display transcript or AI response: */}
          {listening ? (
            /* Transcript: */
            <div className='w-1/2 h-14 text-lg text-center text-gray-700 z-10 overflow-y-auto scrollbar-none'
                  ref={transcriptRef}>
              {transcript}
            </div>
          ) : (
            /* AI Response: */
            <div className='w-1/2 h-14 text-lg text-center text-green-600 z-10 overflow-y-auto scrollbar-none'
                 ref={aiResponseRef}>
              {loading ? (
                <div className='flex flex-row justify-center items-center gap-2'>
                  <div className='w-2 h-2 bg-green-800 rounded-full animate-pulse'/>
                  <div className='w-2 h-2 bg-green-800 rounded-full animate-pulse' style={{animationDelay: "0.5s"}}/>
                  <div className='w-2 h-2 bg-green-800 rounded-full animate-pulse' style={{animationDelay: "1s"}}/>
                </div>
              ) : (
                <p>{aiResponse}</p>
              )}
            </div>
          )}


          {/* Recording Buttons: */}
          <button className={`${listening? 'bg-red-500' : 'bg-white'} p-4 border-black border-2 rounded-full z-10 mt-5`}
                  onClick={listening ? stopRecording : startRecording}>
            {listening ? (
              /* Stop recording: */
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-white border-black border-2 rounded-md animate-pulse"></div>
              </div>
            ) : (
              /* Start recording: */
              <MicrophoneIcon className='w-5 h-5'/>
            )}
          </button>
        </div>

      ) : (
        /* Display error message if the browser does not support speech recognition */
        <div className='w-full min-h-screen bg-[#fcf5eb] flex flex-col items-center justify-center'>
          <p className='font-semibold text-4xl pb-2'>🥺</p>
          <p className='font-semibold text-4xl pb-2'>SORRY</p>
          <p>This browser does not support speech recognition</p>
        </div>
      )}
    </div>
  );
}