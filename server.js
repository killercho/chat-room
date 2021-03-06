require("dotenv").config();
const url = process.env.URL;
const mongoose = require("mongoose");
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    wtimeout: 3000,
    w: 0,
});
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
const { assert } = require("console");
const { Double, Db } = require("mongodb");

let room, username;

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
//Use the connection with Mongo
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));

//Handle the login button
app.post("/login", (req, res) => {
    const emailUser = req.body.email;
    const passwordUser = req.body.password;
    let authQuery = db
        .collection("users")
        .findOne({ email: emailUser, password: passwordUser })
        .then((doc) => {
            if (doc == null) res.redirect("./signup.html");
            else res.redirect("./chat.html");
        });
    let query = db
        .collection("users")
        .findOne({ email: emailUser })
        .then((doc) => {
            username = doc.username;
        });

    room = req.body.room;
});

//Handle the signup button
app.post("/signup", (req, res) => {
    let users = mongoose.model("users", User);
    const user = new users(req.body);
    //Save the user if the email is unique
    user.save((err) => {
        if (err) {
            console.log(
                "This user already exists. Please make another account or use your old one!"
            );
        }
        res.redirect("./index.html");
    });
});
//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//On client connection
io.on("connection", (socket) => {
    // socket.on("joinRoom", ({ username, room }) => {
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
    // });

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
