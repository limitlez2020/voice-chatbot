"use client";

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { MicrophoneIcon } from '@heroicons/react/24/outline';


export default function SpeechToText() {
  /* State to know whether the browser supports speech recognition */
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(true);
  /* Ref for transcript */
  const transcriptRef = useRef(null);
  /* State for the AI's response */
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);

  
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
  };

  /* Function to stop recording: */ 
  const stopRecording = () => {
    SpeechRecognition.stopListening();
    /* Send the user's message to the AI and get response: */
    getAIResponse(transcript);
  };


  /* Automatic scrolling to the bottom of the transcript: */
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);


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

      /* Get the response from the API: */
      const data = await response.json();
      setAIResponse(data.text);
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
        <div className='w-full min-h-screen max-h-screen bg-[#fcf5eb] flex flex-col items-center'>
          {/* Background Noise Texture: */}
          <div className='absolute w-full h-full opacity-5 bg-noise-pattern'></div>

          {/* Header: */}
          <div className='font-semibold text-xl pt-7 mb-28'>
            Voice Chatbot
          </div>

          {/* AI Voice Character: */}
          <div className='border-black border-2 size-56 rounded-full mb-28'>
            {/* Insert an animation here: */}
          </div>

          {/* Transcript: */}
          <div className='w-1/2 h-14 text-lg text-center text-gray-700 z-10 overflow-y-auto scrollbar-none'
                ref={transcriptRef}
          >
            {transcript}
          </div>

          {/* AI Response: */}
          <div className='w-1/2 h-14 text-lg text-center text-gray-700 z-10 overflow-y-auto scrollbar-none'>
            {loading ? (
              <p>Generating response...</p>
            ) : (
              <p>{aiResponse}</p>
            )}
          </div>

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