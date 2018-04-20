var constants = require('../shared/constants.js');
var Game = require('../models/Game.js');

MAX_NUMBER_OF_PLAYERS = 2;
MIN_NUMBER_OF_PLAYERS = 2;
MAX_NUMBER_OF_SPECTATORS = 10;
MIN_NUMBER_OF_SPECTATORS = 0;

class GameController {

	constructor(creatorId){
		this.players = [creatorId];
		this.spectators = [];
		this.status = constants.GAME_STATUS.WAITING;
		this.gameState = new Game(players.length);
	}

	addAsPlayer(playerId) {
		if(this.players.length >= MAX_NUMBER_OF_PLAYERS){
			throw 1003;
		}
		this.players.push(playerId);
	}

	addAsSpectator(spectatorId) {
		if(this.spectators.length >= MAX_NUMBER_OF_SPECTATORS){
			throw 1004;
		}
		this.spectators.push(spectatorId);
	}

	removeAsPlayer(playerId) {
		for(var i=0; i < this.players.length; i++){
			if(this.players[i] === playerId){
				this.players.splice(i, 1);
				return;
			}
		}
		throw 1005;
	}

	removeAsSpectator(spectatorId) {
		for(var i=0; i < this.spectators.length; i++){
			if(this.spectators[i] === spectatorId){
				this.spectators.splice(i, 1);
				return;
			}
		}
		throw 1006;
	}

	isPlayer(id){
		return id in players;
	}

	isSpectator(id){
		return id in spectators;
	}

	startGame(id) {
		if(this.players < MIN_NUMBER_OF_PLAYERS){
			throw 1008;
		}

		if(this.players > MAX_NUMBER_OF_PLAYERS){
			throw 1009;
		}

		if(this.spectators < MIN_NUMBER_OF_SPECTATORS){
			throw 1010;
		}

		if(this.spectators > MAX_NUMBER_OF_SPECTATORS){
			throw 1011;
		}

		if(this.status === constants.GAME_STATUS.ACTIVE){
			throw 1102;
		}

		if(this.status === constants.GAME_STATUS.ENDED){
			throw 1103;
		}

		this.status = constants.GAME_STATUS.ACTIVE;
	}

	endGame(id) {

		if(this.status === constants.GAME_STATUS.ENDED){
			throw 1103;
		}

		this.status = constants.GAME_STATUS.ENDED;
	}

	isActive() {
		return this.status === constants.GAME_STATUS.ACTIVE;
	}

	hasEnded() {
		return this.status === constants.GAME_STATUS.ENDED;
	}

	getGameState(id) {
		if(!this.isPlayer(id) && !this.isSpectator(id)){
			throw 1007;
		}

		if(this.status === constants.GAME_STATUS.WAITING){
			throw 1101;
		}

		if(this.status === constants.GAME_STATUS.ENDED){
			throw 1103;
		}

		return this.gameState.getState();

	}

	conductAction(playerId, params) {

		if(!this.isPlayer(playerId)){
			throw 1005;
		}

		if(this.status === constants.GAME_STATUS.WAITING){
			throw 1101;
		}

		if(this.status === constants.GAME_STATUS.ENDED){
			throw 1103;
		}

		var action = params["action"];
		console.log("Conducting action " + action);

		switch(action) {
			case "draw":
				return this.gameState.draw(playerId);	
			case "play":
				return this.gameState.play(playerId, params["handCardSlot"]);
			case "attack":
				return this.gameState.attack(playerId, params["attackerSlot"], params["defenderSlot"]);
			case "directAttack":
				return this.gameState.directAttack(playerId, params["attackerSlot"]);
			case "nextPhase":
				return this.gameState.endTurn(playerId);
			case "endTurn":
				return this.gameState.endTurn(playerId);
			default:
				console.log("Unknown action " + action + " by player " + playerId);
				throw 1201;
		}
	}
}

module.exports = GameController;