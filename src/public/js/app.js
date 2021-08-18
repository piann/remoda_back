const msgList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const msgForm = document.querySelector("#message");

function makeMessage(type, payload){
    const msg = {type, payload}
    return JSON.stringify(msg);
}


const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener("open", ()=>{
    console.log("Connected!")
})

socket.addEventListener("message", (message)=>{
    const li = document.createElement("li");
    li.innerText = message.data;
    msgList.append(li);
})

function handleSubmit(e) {
    e.preventDefault();
    const input = msgForm.querySelector("input");
    socket.send(makeMessage("new_message",input.value));
    input.value = ""
} 

function handleNickSubmit(e) {
    e.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));
    input.disabled = true;

}

msgForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);