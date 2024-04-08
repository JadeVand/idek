class Player {
    constructor(id) {
        this.x = 0;
        this.y = 0;
        this.inputs = [];
        this.id = id;
        this.currentinput = 0;
    }
    GetId() {
        return this.id;
    }
    GetX() {
        return this.x;
    }
    GetY() {
        return this.y;
    }
    GetNextInput() {
        return this.inputs[0];
    }
    SetX(x) {
        this.x = x;
    }
    SetY(y) {
        this.y = y;
    }
    PushInputQueue(input) {
        this.inputs.push(input);
    }
    PopInputQueue() {
        this.currentinput = this.inputs[0];
        this.inputs.shift();
    }
    Update(delta) {
        let input = this.GetNextInput();
        if (input) {

            let timestamp = Date.now();
            if (timestamp >= input.GetTimestamp())
                this.PopInputQueue();
        }
        
        if(this.currentinput)
        {
            input = this.currentinput.GetInput();
            if (input & cInputDown) {
                this.SetY(this.GetY() + 100 * delta);
            }
            if (input & cInputUp) {
                this.SetY(this.GetY() - 100 * delta);
            }
        }

    }

}
let players = [];