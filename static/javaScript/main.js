import { speechMessage } from "./speechMessage.js";
import {initialSpeechRecognitionStart} from"./speachRecognition.js";
import {startResponseCheckTimeout,clearResponseCheckTimeout} from "./responseCheck.js";
import {botResponse} from "./botResponse.js"
import {mmdMouthSetting} from"./mmdSetting.js"

var socket = io.connect('http://' + document.domain + ':' + location.port);

let room;
let is_joinRoom=false;
let is_gameStart=false;
let is_bot;

const massagesDiv=document.getElementById("id_massagesDiv");

const joinRoomButton=document.getElementById("id_joinRoomButton");
const leaveRoomButton=document.getElementById("id_leaveRoomButton");
const usernameText=document.getElementById("id_usernameText");

socket.on('message', function(data) {
    if(usernameText.value!=data.username){
        const commentElement = document.createElement("p");
        commentElement.innerText = data.message;
        massagesDiv.appendChild(commentElement);

        const responseMessage= data.message.replace(/[、。！？「」]/g, '');
        console.log(responseMessage)
        speechMessage(responseMessage);
        mmdMouthSetting(responseMessage)
        clearResponseCheckTimeout(true);
    }
});

socket.on('join', function(data) {
    if(usernameText.value!=data.username){
        console.log(data.username + 'が入出しました' + data.room);
        if(is_bot==false){
            startResponseCheckTimeout();
        }
        is_gameStart=true;
    }
});

socket.on('leave', function(data) {
    otherUserLeaveRoom();
    clearResponseCheckTimeout(false);
});


joinRoomButton.addEventListener("click",()=>{
    if(is_joinRoom==false){

        is_joinRoom=true;

        initialSpeechRecognitionStart();
        fetch("/join_room")
        .then(response => response.json())
        .then(roomData =>{
            is_bot=roomData.isbot;
            console.log(is_bot);
            room=roomData.room;
            socket.emit('join', {'username': usernameText.value, 'room': room});
        })
        .catch(error => console.log(error));
    }
})


leaveRoomButton.addEventListener("click",()=>{
    leaveRoom();
})

export function sendVoiceMessage(message){
    if(is_joinRoom==true){
        socket.emit('message', {'message': message, 'username': usernameText.value, 'room': room});
    }
}

document.getElementById("id_sendMessageButton").addEventListener("click",()=>{
    sendVoiceMessage(document.getElementById("id_messageText").value);
    if(is_bot==true){
        botResponse(document.getElementById("id_messageText").value).then(response => {
            
            const responseMessage= response.text.replace(/[、。！？「」]/g, '');
            console.log(responseMessage)
            speechMessage(responseMessage);
            mmdMouthSetting(responseMessage)
        });

    }
})

export function leaveRoom(){
    if(is_joinRoom==true){
        fetch("/leave_room?room_param="+room)
        .then(response => response.json())
        .then(data => {
            socket.emit('leave', {'username': usernameText.value, 'room': room});
            room=0;
            is_joinRoom=false;
        })
        .catch(error => console.log(error));
    }
}


window.onbeforeunload = function() {
    var confirmation_message = 'Are you sure you want to leave?';
    leaveRoom();
    return confirmation_message;
  };

function otherUserLeaveRoom(){
    room=0;
    is_joinRoom=false;
}
