import * as alt from "alt-client";

/** Load Queue WebView */
const UI = new alt.WebView("http://resource/client/ui/index.html", false);
UI.on("load", () => UI.focus());

let inQueue = true;

/** Set Player Dimension to Random */
alt.local.Player.dimension = 1863012;

/** Handle Player Spawn */
alt.onServer("queue:spawn", () => {
    alt.local.Player.dimension = 0;
    inQueue = false;
    UI.isVisible = false;

    /* YOUR CUSTOM SPAWN STUFF */
});

/** Handle Queue Position Update */
alt.onServer("queue:update", (args) => {
    UI.emit("queue:update", (args[0], args[1], args[2]));
});

/** Queue Keep Alive Ping */
function SendKeepAliveQueue() {
    if(inQueue) {
        alt.emitServer("queue:keepAlive");
    }
}
setInterval(SendKeepAliveQueue, 30000);

/** Game Keep Alive Ping */
function SendKeepAliveGame() {
    if(!inQueue) {
        alt.emitServer("queue:gameAlive");
    }
}
setInterval(SendKeepAliveGame, 30000);

