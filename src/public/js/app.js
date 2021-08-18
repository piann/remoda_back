const msgList = document.querySelector("ul");
const msgForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener("open", ()=>{
    console.log("Connected!")
})

socket.addEventListener("message", (message)=>{
    console.log("Just got this :", message.data, "from the server")
})

function handleSubmit(e) {
    e.preventDefault();
    const input = msgForm.querySelector("input");
    socket.send(input.value);
    input.value = ""
} 

msgForm.addEventListener("submit", handleSubmit);