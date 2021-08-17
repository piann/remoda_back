const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener("open", ()=>{
    console.log("Connected!")
})

socket.addEventListener("message", (message)=>{
    console.log("Just got this :", message.data, "from the server")
})