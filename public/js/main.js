const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get username and room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();


//Join room
socket.emit("joinRoom", { username, room });

//Get room users
socket.on("roomUsers", ({ room, users }) => {
    printRoomName(room);
    printUsers(users);
});

//Message from server
socket.on("message", (message) => {
    printMsg(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message sent
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //Message from the server to the server
    const msg = e.target.elements.msg.value;
    socket.emit("chatMessage", msg);

    //Clear field
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

//Print message
function printMsg(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta"> ${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.msg}
    </p>`;

    document.querySelector(".chat-messages").appendChild(div);
}

//Room name in DOM
function printRoomName(room) {
    roomName.innerText = room;
}

//Users in DOM
function printUsers(users) {
    userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
