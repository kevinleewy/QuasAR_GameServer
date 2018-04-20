var Game = require('./game.js')
var gameState = null;

module.exports = {

	gameExists : function(playerId) {
		return gameState != null &&
			(gameState.isPlayer1(playerId) || gameState.isPlayer2(playerId) || playerId === "Spectator");
	},

	createGame : function(p1_id, p2_id){
		var status;
		var value;
		if(gameState != null){
			status = "error";
			value = "Game already exists";
		} else if(p1_id === "Spectator"){
			status = "error";
			value = "Spectator cannot create games";
		} else {
			gameState = new Game(p1_id, p2_id);
			status = "success";
			value = gameState.getState(p1_id);
		}
		return {
			"status" : status,
			"value"  : value
		}
	},

	getGameState : function(playerId) {
		var status = "error";
		var value = "Game not created";
		if(gameState != null){
			status = "success";
			value = gameState.getState(playerId);
		}
		if(typeof value == "string"){
			status = "error";
		}
		return {
			"status" : status,
			"value"  : value
		}
	},

	conductAction : function(playerId, params) {
		var status;
		var value;

		if(gameState == null){
			status = "error";
			value = "Game not created";
		} else {
			var action = params["action"];
			console.log("Conducting action " + action);
			value = {};

			switch(action) {
				case "draw":
					status = "success";
					value = gameState.draw(playerId);	
					break;
				case "play":
					status = "success";
					value = gameState.play(playerId, params["handCardSlot"]);
					break;
				case "attack":
					status = "success";
					value = gameState.attack(playerId, params["attackerSlot"], params["defenderSlot"]);
					break;
				case "directAttack":
					status = "success";
					value = gameState.directAttack(playerId, params["attackerSlot"]);
					break;
				case "nextPhase":
					status = "success";
					value = gameState.endTurn(playerId);
					break;
				case "endTurn":
					status = "success";
					value = gameState.endTurn(playerId);
					break;
				default:
					console.log("Unknown action " + action + " by player " + playerId);
					status = "error";
					value = "Invalid action";
			}
			//value["state"] = gameState.hasEnded();
			console.log(value);

		}
		if(typeof value["result"] == "string"){
			status = "error";
			value = value["result"];
		}
		console.log("Response:\n" + JSON.stringify(value, null, "  "));
		console.log("Game State:\n" + JSON.stringify(gameState.getState(playerId), null, "  "));
		return {
			"status" : status,
			"value"  : value
		}
	},

	destroyGame : function() {
		var status;
		var value;
		if(gameState == null){
			status = "error";
			value = "Game not created";
		} else {
			gameState = null;
			status = "success";
			value = "Game successfully destroyed";
		}
		return {
			"status" : status,
			"value"  : value
		}

	}
}