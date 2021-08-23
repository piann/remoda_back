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


function getPublicRooms(){
    const {sockets:{adapter:{sids,rooms}}} = wsServer;
    const publicRooms:any[] = [];
    rooms.forEach((_:any,key:string)=>{
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    }
    )
    return publicRooms;
}

function countJoiner(roomName:string):number{
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket:any)=>{
    socket["nickname"] = "Anonymous";
    socket.onAny((ev:any) => {
        console.log(`Event : ${ev}`);
    })

    socket.on("enter_room", (roomName:string, joinRoom:()=>any) => {
        socket.join(roomName);
        joinRoom();
        socket.to(roomName).emit("welcome", socket.nickname, countJoiner(roomName));
        wsServer.sockets.emit("room_change", getPublicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach( (room:any) => {
            socket.to(room).emit("bye", socket.nickname, countJoiner(room)-1);
        });
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", getPublicRooms());
    });


    socket.on("new_message", (msg:string, roomName:string, done:()=>any) => {
        socket.to(roomName).emit("new_message", `${socket["nickname"]} : ${msg}`);
        done();
    });
    socket.on("nickname", (nickName:string) => {
        socket["nickname"] = nickName;
    });
});

httpServer.listen(3000, handleListen);