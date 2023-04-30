from controllers.select_bot_response import select_bot_response
from controllers.openai_api import bot_response_text
from flask import Flask, render_template,request,jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

room_dict = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def on_join(data):
    room = data['room']
    username = data['username']
    join_room(room)
    emit('join', {'username': username, 'room': room},room=room)
    
@socketio.on('disconnect')
def on_disconnect():
    print('Client disconnected')

@socketio.on('send_player_name')
def handle_player_name(data):
    player_name = data['player_name']
    print(f"Player's name is {player_name}")

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit('leave', {'username': username, 'room': room},room=room)
    
@socketio.on('message')
def on_message(data):
    room = data['room']
    emit('message', {'message': data['message'], 'username': data['username']}, room=room)
    

@app.route('/join_room') 
def add_room_dict():
    global room_dict
    
    if len(room_dict)==0:
        room_dict[1]=1
        
        room_dict,room_data=select_bot_response(room_dict,1)
        print(room_dict)
        return jsonify(room_data)
    
    missing_room=[]
    max_room_number=0
    room_data={}
    for i, (room, number) in enumerate(room_dict.items(),start=1):
        if max_room_number<room:
            max_room_number=room
            
        if i not in room_dict:
            missing_room.append(i)
            
        if room_dict[room]==1:
            room_dict[room]+=1
            
            room_data={
                "room":str(room),
                "number":room_dict[room],
                "isbot":False
            }
            print(room_dict)
            return jsonify(room_data)
        
        elif i==len(room_dict) and room_dict[room]==2 and len(missing_room)!=0:
            room_dict[missing_room[0]]=1


            room_dict,room_data=select_bot_response(room_dict,missing_room[0])
            print(room_dict)
            return jsonify(room_data)
        
        elif i==len(room_dict) and room_dict[room]==2:
            room_dict[max_room_number+1]=1
            
            room_dict,room_data=select_bot_response(room_dict,max_room_number+1)
            print(room_dict)
            return jsonify(room_data)
    
        
@app.route('/leave_room') 
def delete_room_dict():
    room = request.args.get("room_param")
    del room_dict[int(room)]
    print(room_dict)
    return "0"

@app.route('/bot_response', methods=['POST']) 
def bot_response():
    prompt = request.json['prompt']
    response_text=bot_response_text(prompt)
    return jsonify({'text': response_text})

if __name__ == '__main__':
    app.debug = True
    app.run()
