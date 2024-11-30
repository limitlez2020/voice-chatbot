"use client";

import React from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


export default function SpeechToText() {
  
  /* Get the necessary properties from the useSpeechRecognition hook */
  const {
    transcript,
    listening, /* Bool -- is mic listening */
    resetTranscript,
    browserSupportsSpeechRecognition /* Bool -- does browser supports speech recognition */
  } = useSpeechRecognition();


  // Check if the browser supports speech recognition
  // if (!browserSupportsSpeechRecognition) {
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }

  
  const startRecording = () => {
    SpeechRecognition.startListening({ continuous: true });
  };
  
  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p> {/* Display the microphone status */}
      <button onClick={startRecording}>Start</button> {/* Button to start listening */}
      <button onClick={SpeechRecognition.stopListening}>Stop</button> {/* Button to stop listening */}
      <button onClick={resetTranscript}>Reset</button> {/* Button to reset the transcript */}
      <p>{transcript}</p> {/* Display the transcript */}
    </div>
  );
}