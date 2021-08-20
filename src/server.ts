import { Socket } from "dgram";
import express from "express";
import http from "http";
//import WebSocket from "ws";
import SocketIO from "socket.io";

const app = express();

app.set('view engine', "pug");
app.set('views', __dirname + "/views");
app.use('/public', express.static(__dirname + "/public"));
app.get("/" , (req, res)=> res.render("home"));
app.get("/*" , (req, res)=> res.redirect("/"));



interface LooseObject {
    [key: string]: any
}

const socketList:LooseObject[] = [];

const handleListen = () => console.log(`Listening on http://localhost:3000`)

const httpServer = http.createServer(app);
const wsServer = (SocketIO as any)(httpServer);


wsServer.on("connection", (socket:any)=>{
    socket.onAny((ev:any) => {
        console.log(`Event : ${ev}`);
    })

    socket.on("enter_room", (roomName:string, joinRoom:()=>any) => {
        socket.join(roomName);
        joinRoom();
        socket.to(roomName).emit("welcome");
    });
});


httpServer.listen(3000, handleListen);