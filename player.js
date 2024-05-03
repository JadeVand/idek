
let renderpackets = [];
let renderframe = null;
let nextrenderindex = 0;
let serverinitialtick = null;
let gamestarttick = null;
let clienttick = 0;
function GetServerTime() {
    return serverinitialtick + (clienttick - gamestarttick) - 6;
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
        else 
        {

        }
    }
    return -1;
}