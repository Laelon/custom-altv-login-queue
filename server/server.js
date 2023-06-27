import * as alt from "alt-server";

let queue = [];
let players = [];
const max_active_players = 300;
let last_interval_free_slots = 0;
const max_queue_keepalive = 600000;
const max_game_keepalive = 60000;

/** Register a Player to the Login Queue */
alt.on("playerConnect", (player) => {
	for(let i = 0; i < players.length; i++) {
		if(players[i].srvId === player.id) {
			/* Reconnect */
			player.emit("queue:spawn");
			break;
		}
	}
	
	let queuePlayer = {
		srvId: player.id,
		jd: Date.now(),
		last_kA: Date.now()
	}
	
	queue.push(queuePlayer);	
});

/** Keep-Alive ping for Player in Queue 
 *  (to prevent empty Queue Slots after Client Crash or Disconnect) */
alt.onClient("queue:keepAlive", (player) => {
    for(let i = 0; i < queue.length; i++) {
        if(queue[i].srvId === player.id) {
            queue[i].last_kA = Date.now();
        }
    }
});

/** KeepAlive ping for Players in Game
 *  to keep Slots after Crash */
alt.onClient("queue:gameAlive", (player) => {
	for(let i = 0; i < players.length; i++) {
		if(players[i].srvId === player.id) {
			players[i].last_kA = Date.now();
		}
	}
});

/** Remove Player from Queue */
alt.onClient("queue:remove", (player) => {
	for(let i = 0; i < queue.length; i++) {
		if(queue[i].srvId === player.id) {
			queue.splice(i, 1);
		}
	}
});

/** Handle Queue */
function HandleQueue() {
	/* Get free Slots and send the first X players a Spawn Event */
    if(players.length < max_active_players) {
		last_interval_free_slots = max_active_players - players.length;
		for(let i = 0; i < max_active_players - players.length; i++) {
			let lucky_one = alt.player.getByID(queue[0].srvId);
			lucky_one.emit("queue:spawn");
			
			players.push({
				srvId: queue[0].srvId,
				last_kA: Date.now()
			});
			
			queue.splice(queue[0], 1);
		}	
	}
	
	/* Refresh the Position of all Players in Queue */
	for(let i = 0; i < queue.length; i++) {
		let sad_one = alt.player.getByID(queue[i].srvId);
		sad_one.emit("queue:update", [i + 1, queue.length, CalculateQueueTime(i + 1)]);
	}
}
setInterval(HandleQueue, 15000);

/** Calculate estimated Queue Time */
function CalculateQueueTime(position) {
	let slots_per_second = last_interval_free_slots / 15;
	return slots_per_second * position;
}

/** Queue Cleanup */
function QueueCleanup() {
	for(let i = 0; i < queue.length; i++) {
		if(Date.now() - queue[i].last_kA >= max_queue_keepalive) {
			queue.splice(queue[i], 1);
		}
	}
}
setInterval(QueueCleanup, 30000);

/** Players Cleanup */
function PlayersCleanup() {
	for(let i = 0; i < players.length; i++) {
		if(Date.now() - players[i].last_kA >= max_game_keepalive) {
			players.splice(players[i], 1);
		}
	}
}
setInterval(PlayersCleanup, 300000);