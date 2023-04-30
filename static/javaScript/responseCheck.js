import { leaveRoom } from './main.js';

let responseCheckTimeoutId;

export function startResponseCheckTimeout(){
    console.log("start");
    responseCheckTimeoutId=setTimeout(function() {
        leaveRoom();
        console.log("相手の応答なし");
      }, 200000); 
}


export function clearResponseCheckTimeout(is_continue){
    clearTimeout(responseCheckTimeoutId);
    
    if(is_continue==true){
        startResponseCheckTimeout();
    }
}
