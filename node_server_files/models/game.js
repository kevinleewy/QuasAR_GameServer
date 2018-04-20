var Player = require('./player.js');
var util = require('../shared/util.js');

class Game {

	constructor(playerIds){
		this.players = [];
		playerIds.forEach(function(id){
			this.players.push(new Player(id));
		});
		this.turnPlayerIndex = util.randomXToY(0, this.players.length-1);
		this.stack = [];
	}

	getState(){
		playersArray = [];

		this.players.forEach(function(player){
			playersArray.push(player.getState());
		});

		return {
			"players" : playersArray,
			"turnPlayerIndex" : this.turnPlayerIndex,
			"stack" : this.stack
		}
	}

	draw(playerId){
		if(!isTurnPlayer(playerId)){
			throw 1202;
		}

		try {
			var newCard = this.turnPlayer.draw();

			return [{
				"event"		: "draw",
				"player" 	: playerId,
				"result"	: [newCard]
			}]
		} catch (err) {
			if(err === 1203){
				this.players[this.turnPlayerIndex].eliminated = true;
				do {
					this.turnPlayerIndex = (this.turnPlayerIndex + 1) % this.players.length;
				} while (this.players[this.turnPlayerIndex].eliminated)
				return [
					{
						"event" : "eliminated",
						"playerId" : playerId,
						"condition" : "deck out" 
					},
					{
						"event" : "startTurn",
						"playerId" : playerId,
					}
				];
			} else {
				throw err;
			}
		}
	}

	play(playerId, handCardSlot){
		if(playerId != this.turnPlayer.getId()){
			return {
				"player" 	: this.turnPlayer.getId(),
				"event"		: "play",
				"result"	: "not turn player"
			}
		}
		if(handCardSlot >= this.turnPlayer.numberOfCardsInHand()){
			return {
				"player" 	: this.turnPlayer.getId(),
				"event"		: "play",
				"result"	: "card not in hand"
			}
		}
		var result = this.turnPlayer.play(handCardSlot);
		return {
			"player" 	: playerId,
			"event"		: "play",
			"result"	: result
		}
	}

	attack(playerId, attackerSlot, defenderSlot){
		if(playerId != this.turnPlayer.getId()){
			return {
				"player" 	: this.turnPlayer.getId(),
				"event"		: "attack",
				"result"	: "not turn player"
			}
		}
		if(!this.turnPlayer.hasCreatureOnField(attackerSlot)){
			return {
				"player" 	: this.turnPlayer.getId(),
				"event"		: "attack",
				"result"	: "no creature in attacker slot"
			}
		}
		if(!this.otherPlayer.hasCreatureOnField(defenderSlot)){
			return {
				"player" 	: this.turnPlayer.getId(),
				"event"		: "attack",
				"result"	: "no creature in defender slot"
			}
		}
		var result = [
			attackerSlot,
			defenderSlot,
			this.otherPlayer.destroyCreature(defenderSlot)
		];
		return {
			"player" 	: playerId,
			"event"		: "attack",
			"result"	: result
		}
	}

	directAttack(playerId, attackerSlot){
		if(playerId != this.turnPlayer.getId()){
			return {
				"player" 	: this.turnPlayer.getId(),
				"event"		: "directAttack",
				"result"	: "not turn player"
			}
		}
		if(!this.turnPlayer.hasCreatureOnField(attackerSlot)){
			return {
				"player" 	: this.turnPlayer.getId(),
				"event"		: "directAttack",
				"result"	: "no creature in attacker slot"
			}
		}
		if(this.otherPlayer.hasAnyCreatureOnField()){
			return {
				"player" 	: this.turnPlayer.getId(),
				"event"		: "directAttack",
				"result"	: "defender still has creatures"
			}
		}
		
		return {
			"player" 	: playerId,
			"event"		: "directAttack",
			"result"	: [
				attackerSlot,
				this.otherPlayer.loseLife(1),
			]	
		}
	}

	isTurnPlayer(playerId){
		return playerId === this.players[this.turnPlayerIndex].id;
	}

	endTurn(playerId){
		if(!isTurnPlayer(playerId)){
			throw 1202;
		}
		
		do {
			this.turnPlayerIndex = (this.turnPlayerIndex + 1) % this.players.length;
		} while (this.players[this.turnPlayerIndex].eliminated)

		return [
			{
				"event" : "endTurn",
				"playerId" : playerId,
				"nextPlayerId" : this.players[this.turnPlayerIndex].id
			}
		];
	}

	surrender(playerId) {
		if(!isTurnPlayer(playerId)){
			throw 1202;
		}
		this.players[this.turnPlayerIndex].eliminated = true;
		return [
			{
				"event" : "eliminated",
				"playerId" : playerId,
				"condition" : "surrender"
			}
		];
	}

	hasEnded(){
		var result = null;
		if(this.player1.isDead()){
			if(this.player2.isDead()){
				result = "Draw";
			} else {
				result = "Player2 won";
			}
		} else if(this.player2.isDead){
			result = "Player1 won";
		}
		return {
			"ended": !!(this.player1.isDead() || this.player2.isDead()),
			"result": result
		}
	}

}

module.exports = Game;