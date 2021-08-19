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
    socket.on("enter_room", (msg:any, done:any) => {
        console.log(msg);
        setTimeout(()=>{
            done();
        },3000);
    })
});


httpServer.listen(3000, handleListen);