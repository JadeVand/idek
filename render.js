document.addEventListener("DOMContentLoaded", () => {
    //canvas
    const canvas = document.getElementById("canvas");
    //2d
    const ctx = canvas.getContext("2d");
    //1280x720
    canvas.width = 1280;
    canvas.height = 720;

    //tick function with delta argument
    let tprevious = 0;
    const tick = (t) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let tnow = Date.now();
        let delta = (tnow - tprevious)/1000;
        tprevious = tnow;
        //iterate all players
        players.forEach(p => {
            p.Update(delta);
            //draw rectangle at player position of size 16x16
            //make the rectangle black
            ctx.fillStyle = "black";
            ctx.fillRect(p.GetX()+16, p.GetY(), 16, 16);
        })
        //clear
        //
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    //request Animation Frame
    
})