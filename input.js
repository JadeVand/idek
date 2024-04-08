
let cInputLeft = 1;
let cInputRight = 2;
let cInputDown = 4;
let cInputUp = 8;
class input
{
    constructor(input,timestamp)
    {
        this.timestamp = timestamp;
        this.input = input;
    }
    GetTimestamp()
    {
        return this.timestamp;
    }
    GetInput()
    {
        return this.input;
    }
}