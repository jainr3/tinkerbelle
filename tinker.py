from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import socket

port=5001

app = Flask(__name__)
socketio = SocketIO(app)

def broadcast(name, value):
	emit(name, value, broadcast=True, include_self=False)

@socketio.on('connect')
def test_connect():
	print('connected')
	emit('after connect',  {'data':'Lets dance'})

@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)

@socketio.on('hex')
def handle_hex(val):
	broadcast('hex', val)

@socketio.on('audio')
def handle_audio(val):
	broadcast('audio', val)

@socketio.on('pauseAudio')
def handle_pause(val):
	broadcast('pauseAudio', val)

@socketio.on('words')
def handle_words(val):
	broadcast('words', val)

@socketio.on('pauseWords')
def handle_words(val):
	broadcast('pauseWords', val)

@socketio.on('scenario1_1')
def scenario1_1():
	broadcast('scenario1_1', None)

@socketio.on('scenario1_2')
def scenario1_2():
	broadcast('scenario1_2', None)

@socketio.on('scenario1_3')
def scenario1_3():
	broadcast('scenario1_3', None)

@socketio.on('scenario2_1')
def scenario1_1():
	broadcast('scenario2_1', None)

@socketio.on('scenario2_2')
def scenario1_2():
	broadcast('scenario2_2', None)

@socketio.on('scenario2_3')
def scenario1_3():
	broadcast('scenario2_3', None)

@socketio.on('scenario3_1')
def scenario1_1():
	broadcast('scenario3_1', None)

@socketio.on('scenario3_2')
def scenario1_2():
	broadcast('scenario3_2', None)

@socketio.on('scenario3_3')
def scenario1_3():
	broadcast('scenario3_3', None)


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
# 	The way of getting the ip address is dumb but works https://stackoverflow.com/questions/166506/finding-local-ip-addresses-using-pythons-stdlib
	print(f"access at http://{[ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith('127.')][0]}:{port}")
	socketio.run(app, host='0.0.0.0', debug=True, port=port)
