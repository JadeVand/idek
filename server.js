const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });

let cInputDown = 1<<2;
let cInputUp = 1<<3;
class PlayerData {
  constructor(id) {
    this.input = 0;
    this.id = id;
    this.inputchanged = false;
    this.inputtimestamp = 0;
    this.x = 0;
    this.y = 0;
  }
  GetInput() {
    return this.input;
  }
  GetId() {
    return this.id;
  }
  AddInput(key) {
    this.input |= key;
    this.inputchanged = true;
  }
  RemoveInput(key) {
    this.input &= ~key;
    this.inputchanged = true;
  }
  ResetInputChanged() {
    this.inputchanged = false;
  }
  SetId(id) {
    this.id = id;
  }
  DidInputChange() {
    return this.inputchanged;
  }
  SetInputTimestamp(timestamp) {
    this.inputtimestamp = timestamp;
  }
  GetInputTimestamp() {
    return this.inputtimestamp;
  }
  SetX(x) {
    this.x = x;
  }
  SetY(y) {
    this.y = y;
  }
  GetX() {
    return this.x;
  }
  GetY() {
    return this.y;
  }
  Update(delta) {
    
    if (this.input & cInputDown) {
      this.y += 100 * delta;
    }
    if (this.input & cInputUp) {
      this.y -= 100 * delta;
    }
    console.log("X:"+this.x+":Y:"+this.y);
  }
}
let playermap = new Map();

//tick function
let accumulator = 0.0;
let tprev = Date.now();
function tick() {
  let tnow = Date.now();
  let delta = (tnow - tprev) / 1000.0;
  tprev = tnow;
  accumulator += delta;
  while (accumulator > (1 / 60.0)) {
    accumulator -= (1 / 60.0);
    wss.clients.forEach((client) => {
      wss.clients.forEach((innerClient) => {
        let p = playermap.get(innerClient.id);
        if (p.DidInputChange()) {//no need to spam send
  
          let input = p.GetInput();
          let now = Date.now();
          let inputtimestamp = p.GetInputTimestamp();
          let diff = now - inputtimestamp;
          if (diff > 100) {
            diff = 100;
          }
          let delay = 100 - diff;
          client.send(JSON.stringify({ Input: input, Timestamp: Date.now() + delay, Id: p.GetId() }));
  
        }
      })
    })
    //reset input for all clients in wss
  
    wss.clients.forEach((client) => {
      let p = playermap.get(client.id);
      p.Update(1/60);
      p.ResetInputChanged();
    })
  }
}
setInterval(() => {
  tick();
}, 1 / 300.0)
let id = 1000;
wss.on('connection', (ws) => {


  ws.id = id;
  playermap.set(id, new PlayerData(id));
  ++id;
  //send new client id back to all connected clients

  wss.clients.forEach((client) => {
    // console.log(client.id);
    let p = playermap.get(client.id);
    if(p)
    {
      ws.send(JSON.stringify({ Connected: true, Id: client.id ,X: p.GetX(),Y: p.GetY()}));
    }
    
  })
  wss.clients.forEach((client) => {
    if (client.id != ws.id) {
      client.send(JSON.stringify({ Connected: true, Id: ws.id, X: 0, Y: 0 }));
    }
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
        else if (message.down == true) {

          p.AddInput(message.key);
        }
      }
    }

  });
  ws.on("close", () => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ Connected: false, Id: ws.id }));
    })
  });
});
