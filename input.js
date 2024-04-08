
let cInputDown = 1<<2;
let cInputUp = 1<<3;
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