document.addEventListener("DOMContentLoaded", () => {
    //canvas
    const canvas = document.getElementById("canvas");
    //2d
    const ctx = canvas.getContext("2d");
    //1280x720
    canvas.width = 1280;
    canvas.height = 720;

    //tick function with delta argument
    let tprevious = Date.now();
    let accumulator = 0.0;
    function Tick() {
        let tcurrent = Date.now();
        let delta = (tcurrent - tprevious) / 1000.0;
        tprevious = tcurrent;
        accumulator += delta;

        while (accumulator > (1 / 60.0)) {
            accumulator -= (1 / 60.0);
            players.forEach(p => {
                p.Update(1/60.0);
            })
        }   
    }
    setInterval(Tick, 1 / 500.0);
    const Draw = (t) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //iterate all players
        players.forEach(p => {
            
            //draw rectangle at player position of size 16x16
            //make the rectangle black
            ctx.fillStyle = "black";
            ctx.fillRect(p.GetX()+16, p.GetY(), 16, 16);

            console.log("X:"+p.GetX()+":Y:"+p.GetY());
        })
        //clear
        //
        requestAnimationFrame(Draw);
    }
    requestAnimationFrame(Draw);
    //request Animation Frame
    
})