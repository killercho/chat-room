const url =
    "mongodb+srv://admin:1234gei@cluster0.7xlwh.mongodb.net/Cluster0?retryWrites=true&w=majority";
const mongoose = require("mongoose");
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const path = require("path");
const http = require("http");
const express = require("express");
const socket_io = require("socket.io");
const formatMessage = require("./utilities/messages");
const {
    userJoin,
    getCurrentUser,
    userDC,
    getRoomUsers,
} = require("./utilities/user");

const app = express();
const server = http.createServer(app);
const io = socket_io(server);
const User = require("./public/js/enterMongo");

const bodyParser = require("body-parser");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());

app.post("/signup", (req, res) => {
    const user = new User(req.body);
    user.save();
});

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//On client connection
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //On user connection
        socket.emit(
            "message",
            formatMessage("Bot", `Welcome ${user.username}! HF!`)
        );
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage("Bot", `${user.username} has joined! Be kind!`)
            );

        //Room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    //Catch message
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    //On disconnect
    socket.on("disconnect", () => {
        const user = userDC(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(
                    "Bot",
                    `${user.username} has left! Cheer up everybody!`
                )
            );
            //Room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
