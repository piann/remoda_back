import express from "express";
import http from "http";
import WebSocket from "ws";

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

const handleConnect = (socket:LooseObject) => {
    socketList.push(socket)
    socket["nickname"] = "anonymous"
    socket.on("close", ()=>{
        console.log("Disconnected from Browser")
    });

    socket.on("message", (msg:any)=>{
        const msgText = msg.toString("ascii")
        const parsedText = JSON.parse(msgText)

        switch(parsedText.type){
            case "new_message":
                socketList.forEach((aSocket)=>{
                    aSocket.send(`${socket["nickname"]} : ${parsedText.payload}`);
                })
                break;
            case "nickname":
                socket["nickname"] = parsedText.payload;
                break;
        }
    })


}

const httpServer = http.createServer(app);
const wsServer = new WebSocket.Server({ server : httpServer });

wsServer.on("connection", handleConnect)

httpServer.listen(3000, handleListen);