
let renderpackets = [];
let renderframe = null;
let nextrenderindex = 0;
let timeserver = 0;
let timegamestart = 0; 
function GetServerTime() {
    return timeserver + (Date.now() - timegamestart) - 100;
  }
function GetNextFrameIndex()
{
    let delay = GetServerTime();
    for(let i = renderpackets.length-1; i >= 0; --i)
    {
        if(renderpackets[i].Timestamp <= delay)
        {
            return i;
        }
    }
    return -1;
}