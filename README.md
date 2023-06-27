# alt:V Login Queue
Script for a alt:V Login Queue.

## Installation
1. Copy to main folder in your alt:V resources directory.
2. Add the Resource to your server.cfg

## Usage
 - Set Server slots to Your Queue Size + your desired max Player count (200 Players + 100 Queue = 300 Slots)
 
 - Edit server/server.js
 * Change **max_queue_keepalive** to whatever Value you want a Player has time to reconnect to the Queue
 * Change **max_game_keepalive** to whatever Value you want a Player has time to reconnect to the Game
 * Change **max_active_players** to Your desired max **active** Player Count
 
 - Edit client/client.js and add Your Code for the Player to Spawn to the **queue:spawn** Event