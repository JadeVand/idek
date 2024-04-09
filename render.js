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
        let state = renderpackets[0];
        renderpackets.shift();
        return state;
    }
    function ProcessPackets() {
        let state = Deque();
        for (let i = 0; i < state.State.length; ++i) {
            let player = state.State[i];
            RenderPlayer(player.PlayerX, player.PlayerY, 16, 16);
        }
        renderframe = state;
    }
    //tick function with delta argument
    let delay = ((1 / 60.0) * 5)
    const Draw = (t) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //iterate all players
        if (renderpackets.length > 1) {
            let tnow = Date.now();
            let tfuture = renderpackets[0].Timestamp + delay;
            if (tnow > tfuture) {
                ProcessPackets();
            } 
        }
        else {
            if(renderframe != null)
            {
                let state = renderframe;
                for (let i = 0; i < state.State.length; ++i) {
                    let player = state.State[i];
                    RenderPlayer(player.PlayerX, player.PlayerY, 16, 16);
                }
            }
        }
        if (renderpackets.length > 10) {
            
            while (renderpackets.length > 1) {
                ProcessPackets();
            }
        }
        requestAnimationFrame(Draw);
    }
    requestAnimationFrame(Draw);
    //request Animation Frame

})