import Image from "next/image";
import 'regenerator-runtime/runtime';
import SpeechToText from "./components/SpeechToText";

export default function Home() {
  return (
    <div>
      <SpeechToText />
    </div>
  );
}
