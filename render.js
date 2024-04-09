document.addEventListener("DOMContentLoaded", () => {
    //canvas
    const canvas = document.getElementById("canvas");
    //2d
    const ctx = canvas.getContext("2d");
    //1280x720
    canvas.width = 1280;
    canvas.height = 720;

    function RenderPlayer(x, y, width, height) {

        ctx.fillStyle = "red";
        ctx.fillRect(x, y, width, height);
    }
    function Deque() {
        renderpackets.shift();
    }
    function ProcessPackets(state) {
        if(state != null)
        {
            for (let i = 0; i < state.State.length; ++i) {
                let player = state.State[i];
                RenderPlayer(player.PlayerX, player.PlayerY, 16, 16);
            }
        }

    }

    function GetGamestate()
    {
        let nextframe = GetNextFrameIndex();
        if(nextframe == -1)
        {
            console.log("Too early");
            //use the most recent frame we have
            return renderpackets[renderpackets.length -1];
            
        }
        else if(nextframe == renderpackets.length-1)
        {

            return renderpackets[renderpackets.length-1];
        }
        else 
        {
            const time = GetServerTime();
            const frame = renderpackets[nextframe];
            const next = renderpackets[nextframe+1];
            const alpha = (time - frame.Timestamp) / (next.Timestamp - frame.Timestamp);
            //interpolate the state
            let state = {};
            state.State = [];
            for(let i = 0; i < frame.State.length; ++i)
            {
                state.State[i] = {
                    PlayerX: frame.State[i].PlayerX + (next.State[i].PlayerX - frame.State[i].PlayerX) * alpha,
                    PlayerY: frame.State[i].PlayerY + (next.State[i].PlayerY - frame.State[i].PlayerY) * alpha,
                    PlayerId: frame.State[i].PlayerId
                }
            }
            state.Timestamp = time;
            console.log(alpha);
            return state;
        }

    }
    let tprev = Date.now();
    const Draw = (t) => {
        let tnow = Date.now();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        

        let state = GetGamestate();
        ProcessPackets(state);

        requestAnimationFrame(Draw);
    }
    requestAnimationFrame(Draw);
    //request Animation Frame

})