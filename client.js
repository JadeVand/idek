let bConnected = false;
document.addEventListener("DOMContentLoaded", () => {
    const ws = new WebSocket("ws://localhost:8000");
    //35.176.122.113:8000
    //on connected
    ws.onopen = () => {
        bConnected = true;
    }
    //on close
    ws.onclose = () => {
        bConnected = false;
    }
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.Timestamp)
        {
            renderpackets.push(data);
        }
    }


    //on key press A up event handler
    document.addEventListener("keyup", (event) => {

        if (event.code === "KeyA") {
            ws.send(JSON.stringify({key: 1<<0,down: false,Timestamp: Date.now()}));
        }
        if (event.code === "KeyD") {
            ws.send(JSON.stringify({key: 1<<1,down: false ,Timestamp: Date.now()}));
        }
        //send an input for Key S
        if (event.code === "KeyS") {
            ws.send(JSON.stringify({key:cInputDown,down: false ,Timestamp: Date.now()}));
        }
        //send input for Key W
        if (event.code === "KeyW") {
            ws.send(JSON.stringify({key:cInputUp,down: false ,Timestamp: Date.now()}));
        }
    })
    //on key pressed A event handler, not down but pressed
    document.addEventListener("keypress", (event) => {
        if(event.repeat) return;

        if (event.code === "KeyA") {
            ws.send(JSON.stringify({key: 1<<0,down: true ,Timestamp: Date.now()}));
        }
        if (event.code === "KeyD") {
            ws.send(JSON.stringify({key: 1<<1,down: true ,Timestamp: Date.now()}));
        }
        //send an input for Key S
        if (event.code === "KeyS") {
            
            ws.send(JSON.stringify({key: cInputDown,down: true ,Timestamp: Date.now()}));
        }
        //send input for Key W
        if (event.code === "KeyW") {
            ws.send(JSON.stringify({key: cInputUp,down: true ,Timestamp: Date.now()}));
        }
    })
})


//Found the issue 
//BOth the server and the client have to delay their inputs for each player respectively
//Since I'm already using a fixed time step I might as well get rid of the 100ms delay
//And just use frame / tick numbers
//Let the server send the current tick number to the client
//The server needsd to push back the client's input until the right tick then apply it.