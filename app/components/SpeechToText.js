"use client";

import React from 'react';
import { useState } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


export default function SpeechToText() {
  /* States */

  
  /* Get the necessary properties from the useSpeechRecognition hook */
  const {
    transcript,
    listening, /* Bool -- is mic listening */
    resetTranscript,
  } = useSpeechRecognition();

  /* Check if the browser supports speech recognition */
  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }


  /* Function to start recording: */
  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
    resetTranscript();
  };

  /* Function to stop recording: */ 
  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };


  
  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p> {/* Display the microphone status */}
      <button onClick={startRecording}>Start</button> {/* Button to start listening */}
      <button onClick={stopRecording}>Stop</button> {/* Button to stop listening */}
      <p>{transcript}</p> {/* Display the transcript */}
    </div>
  );
}