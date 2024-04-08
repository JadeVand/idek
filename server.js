const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });

class PlayerData
{
  constructor(id)
  {
    this.input = 0;
    this.id = id;
    this.inputchanged = false;
    this.inputtimestamp = 0;
  }
  GetInput()
  {
    return this.input;
  }
  GetId()
  {
    return this.id;
  }
  AddInput(key)
  {
    this.input |= key;
    this.inputchanged = true;
  }
  RemoveInput(key)
  {
    this.input &= ~key;
    this.inputchanged = true;
  }
  ResetInputChanged()
  {
    this.inputchanged = false;
  }
  SetId(id)
  {
    this.id = id;
  }
  DidInputChange()
  {
    return this.inputchanged;
  }
  SetInputTimestamp(timestamp)
  {
    this.inputtimestamp = timestamp;
  }
  GetInputTimestamp()
  {
    return this.inputtimestamp;
  }
}
let playermap = new Map();

//tick function
function tick() {
  wss.clients.forEach((client) => {
    wss.clients.forEach((innerClient) => {
      let p = playermap.get(innerClient.id);
      if(p.DidInputChange()) {//no need to spam send

        let input = p.GetInput();
        let now = Date.now();
        let inputtimestamp = p.GetInputTimestamp();
        let diff = now - inputtimestamp;
        if(diff > 100)
        {
          diff = 100;
        }
        let delay = 100-diff;
        client.send(JSON.stringify({Input: input,Timestamp: Date.now() + delay,Id: p.GetId()}));
        p.ResetInputChanged();//only send input if there's a change/necessary
      }
    })
  })
}
setInterval(() => {
  tick();
},1/60.0)
let id = 1000;
wss.on('connection', (ws) => {

  
  ws.id = id;
  console.log(ws.id);
  playermap.set(id, new PlayerData(id));
  ++id;
  //send new client id back to all connected clients
  playermap.forEach((client) => {
    client.send(JSON.stringify({Connected: true,Id: ws.id}));
  })
  ws.on('error', (error) => {
    console.log(error);
  })


  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);
    if (message.key) {
      let p = playermap.get(ws.id);
      if (p) {
        p.SetInputTimestamp(message.Timestamp);
        if (message.down == false) {

          p.RemoveInput(message.key);
        }
        else if(message.down == true){

          p.AddInput(message.key);
        }
      }
    }

  });
  ws.on("close", () => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({Connected: false,Id: ws.id}));
    })
  });
});
