var socket = io();
let btn = document.getElementById('btn');
let inputMsg = document.getElementById('newmsg');
let msgList = document.getElementById('msglist');

btn.onclick = function(){
  socket.emit('send_message', {
    msg: inputMsg.value
  });
}

socket.on('msg_received', (data)=>{
  let limsg = document.createElement('li');
  limsg.innerText = data.msg;
  msgList.appendChild(limsg)
})