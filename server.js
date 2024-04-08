const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });

let cInputLeft = 1;
let cInputRight = 2;
let cInputDown = 4;
let cInputUp = 8;
class PlayerData {
  constructor(id) {
    this.input = 0;
    this.id = id;
    this.inputchanged = false;
    this.inputtimestamp = 0;
    this.x = 0;
    this.y = 0;
    this.statechanged = false;
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

    if (this.input & cInputLeft) {
      this.x -= 100 * delta;
    }
    if (this.input & cInputRight) {
      this.x += 100 * delta;
    }
    if (this.input & cInputDown) {
      this.y += 100 * delta;
    }
    if (this.input & cInputUp) {
      this.y -= 100 * delta;
    }

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

    let state = [];

    wss.clients.forEach((client) => {
      let p = playermap.get(client.id);
      p.Update(1 / 60.0);
      state.push({ PlayerX: p.GetX(), PlayerY: p.GetY(), PlayerId: p.GetId() });
    })
    wss.clients.forEach((client) => {
      //send to client
      client.send(JSON.stringify({ State: state, Timestamp: Date.now() }));
    })
    //reset input for all clients in wss

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
