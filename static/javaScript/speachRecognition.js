import { sendVoiceMessage } from './main.js';
const messageText=document.getElementById("id_messageText");

export function initialSpeechRecognitionStart(){
  
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;  const recognition = new SpeechRecognition();
  recognition.lang = 'ja-JP';
  recognition.continuous = true;

  recognition.onresult = (event) => {
    const message=event.results[event.results.length-1][0].transcript
    messageText.value=message;
    sendVoiceMessage(message);
  };

  recognition.onerror = (event) => {
    console.log("音声認識エラー"+event.error);
    recognition.start();
  };

  recognition.onsoundend = (event)=>{
    console.log("停止");
    recognition.start();
  }

  recognition.start();
}
