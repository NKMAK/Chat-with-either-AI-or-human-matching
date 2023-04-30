let uttr = new SpeechSynthesisUtterance()
let is_speech=false;
export function speechMessage(message){
    if ('speechSynthesis' in window) {
      is_speech=true;
      uttr.text = message
      uttr.rate = 1.0;
      window.speechSynthesis.speak(uttr)
    }
}
