const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));

main()
.then(() => {
    console.log("connectoin successful");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//index Route
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs", { chats });
})

//new Route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
})

//create Route
app.post("/chats", (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });
    newChat
       .save()
       .then(res => {console.log("chat wae saved")})
       .catch(err => {console.log(err)})
    res.redirect("/chats");
})

//edit Route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat  = await Chat.findById(id);
    res.render("edit.ejs", { chat });
})

//update Route
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg}, { runValidator: true});
    console.log(updatedChat);
    res.redirect("/chats");
})

app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
})

app.get("/", (req, res) => {
    res.send("listening")
})

app.listen(8080, () => {
    console.log("server is listening on port 8080");
})