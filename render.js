document.addEventListener("DOMContentLoaded", () => {
    //canvas
    const canvas = document.getElementById("canvas");
    //2d
    const ctx = canvas.getContext("2d");
    //1280x720
    canvas.width = 1280;
    canvas.height = 720;

    //tick function with delta argument
    const Draw = (t) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //iterate all players
        if(renderpackets.length>2)
        {
            let state = renderpackets[0];
            if(Date.now() > state.Timestamp)
            {
                //iterate state.state array
                for(let i = 0; i < state.State.length; ++i)
                {
                    let player = state.State[i];
                    ctx.fillStyle = "red";
                    ctx.fillRect(player.PlayerX, player.PlayerY, 16, 16);
                }
                renderpackets.shift();
            }
        }
        if(renderpackets.length>15)
        {
            console.log("too much packets");
        }
        requestAnimationFrame(Draw);
    }
    requestAnimationFrame(Draw);
    //request Animation Frame
    
})