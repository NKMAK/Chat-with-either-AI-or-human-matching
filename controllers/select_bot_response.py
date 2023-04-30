import random

def select_bot_response(room_dict,room):
    if random.random() < 0.5:
        room_dict[room]+=1
        room_data={
            "room":str(room),
            "number":room_dict[room],
            "isbot":True
        }
        print("ボット部屋")
        return room_dict,room_data
    else:
        room_data={
            "room":str(room),
            "number":room_dict[room],
            "isbot":False
        }
        return room_dict,room_data