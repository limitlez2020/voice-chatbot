import Image from "next/image";
import 'regenerator-runtime/runtime';
import dynamic from "next/dynamic";
import SpeechToText from "./components/SpeechToText";

export default function Home() {
  return (
    <div>
      <SpeechToText />
    </div>
  );
}
