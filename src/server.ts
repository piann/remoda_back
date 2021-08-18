import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set('view engine', "pug");
app.set('views', __dirname + "/views");
app.use('/public', express.static(__dirname + "/public"));
app.get("/" , (req, res)=> res.render("home"));
app.get("/*" , (req, res)=> res.redirect("/"));

const sockets:WebSocket[] = [];

const handleListen = () => console.log(`Listening on http://localhost:3000`)

const handleConnect = (socket:WebSocket) => {
    sockets.push(socket)

    socket.on("close", ()=>{
        console.log("Disconnected from Browser")
    });

    socket.on("message", (msg)=>{
        console.log(msg);
        sockets.forEach((aSocket)=>{
            aSocket.send(msg)
        })
    })


}

const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server : httpServer });

wsServer.on("connection", handleConnect)

httpServer.listen(3000, handleListen);