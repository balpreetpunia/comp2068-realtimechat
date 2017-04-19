var socket = io();
var adjectives = ["Adorable", "Drab", "Elegant", "Glamorous", "Magnificent", "Plain", "Unsightly", "Careful", "Clever", "Shy", "Brave", "Witty", "Grumpy"];
var nouns = ["Cat", "Dog", "Banana", "Flower", "Book", "Photograph", "Sock", "Monkey", "Car", "Student", "Bagel", "Beetle", "Llama"];

//Step 7: "Submit" button function
function submitfunction(){
    var from = $('#user').val();
    var message = $('#m').val();
    if(message != '') {
        socket.emit('chatMessage', from, message);
    }
    $('#m').val('').focus();
    return false;
}

function notifyTyping() {
    var user = $('#user').val();
    socket.emit('notifyUser', user);
}

//Step 6: Message send function
socket.on('chatMessage', function(from, msg){
    var me = $('#user').val();
    var color = (from == me) ? 'green' : '#009afd';
    var from = (from == me) ? 'Me' : from;
    $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
});

//Typing notification
socket.on('notifyUser', function(user){
    var me = $('#user').val();
    if(user != me) {
        $('#notifyUser').text(user + ' is typing ...');
    }
    setTimeout(function(){ $('#notifyUser').text(''); }, 10000);;
});

//when the user leaves
socket.on('userleft', function() {
    var uname = $('#user').val();
    socket.emit('chatMessage', 'System', '<b>' + uname + '</b> has left the discussion');
});

//Step 4: Once the page loads, get the username and send out joining message
$(document).ready(function(){
    //Joining message
    var name = makeid();
    $('#user').val(name);
    socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');
});

//Prompts user for username otherwise it creates a random one
function makeid() {
    var text = prompt("Please enter your username.\nIf you do not enter anything, you will be assigned a randomly generated one.", "").trim();

    //checking if they didn't select a username
    if (!text) {
        //generate one from the adjectives and nouns arrays
        text += adjectives[Math.floor(Math.random() * adjectives.length)];
        text += nouns[Math.floor(Math.random() * nouns.length)];
    }

    return text;
}