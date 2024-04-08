let bConnected = false;
document.addEventListener("DOMContentLoaded", () => {
    const ws = new WebSocket("ws://localhost:8000");
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
        console.log(data);
        if (data.Connected == true) {
            players.push(new Player(data.Id,data.X,data.Y));
        }
        if(data.Connected == false){
            players = players.filter(p => p.id != data.id);
        }
        if(data.Timestamp)
        {
            console.log(data.Input);
            let p = players.find(p => p.GetId() == data.Id);
            if(p)
            {
                p.PushInputQueue(new input(data.Input,data.Timestamp));
            }
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
