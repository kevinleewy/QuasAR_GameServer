var Player = require('./models/player.js');

class Game {

	constructor(p1_id, p2_id){
		this.player1 = new Player(p1_id);
		this.player2 = new Player(p2_id);
		this.turnPlayer = this.player1;
		this.otherPlayer = this.player2;
		this.stack = [];
	}

	getState(playerId){
		if(this.isPlayer1(playerId) || playerId === "Spectator"){
			return {
				"player1" : this.player1.getState(),
				"player2" : this.player2.getState(),
				"turnPlayer" : this.turnPlayer.getId(),
				"availableActions": [
					"draw",
					"attack",
					"endTurn",
					"surrender"
				],
				"stack" : this.stack
			}
		} else if(this.isPlayer2(playerId)){
			return {
				"player1" : this.player2.getState(),
				"player2" : this.player1.getState(),
				"turnPlayer" : this.turnPlayer.getId(),
				"availableActions": [
					"draw",
					"attack",
					"endTurn",
					"surrender"
				],
				"stack" : this.stack
			}
		} else {
			return "Unrecognized player ID";
		}
	}

	draw(playerId){
		if(playerId != this.turnPlayer.getId()){
			return {
				"player" 	: playerId,
				"event"		: "draw",
				"result"	: "not turn player"
			}
		}
		var newCard = this.turnPlayer.draw();
		if(newCard < 0){
			return {
				"player" 	: playerId,
				"event"		: "draw",
				"result"	: "no cards left in deck"
			}
		}
		return {
			"player" 	: playerId,
			"event"		: "draw",
			"result"	: [newCard]
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

	endTurn(playerId){
		if(playerId != this.turnPlayer.getId()){
			return {
				"player" 	: playerId,
				"event"		: "endTurn",
				"result"	: "Not " + playerId + "'s turn"
			}
		}
		var temp = this.turnPlayer;
		this.turnPlayer = this.otherPlayer;
		this.otherPlayer = temp;
		return {
			"player" 	: playerId,
			"event"		: "endTurn",
			"result"	: []
		}
	}

	surrender() {
		this.turnPlayer.surrender();
		return {
			"player" 	: this.turnPlayer.getId(),
			"event"		: "surrender"
		}
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

	isPlayer1(id){
		return this.player1.getId() == id;
	}

	isPlayer2(id){
		return this.player2.getId() == id;
	}
}

module.exports = Game;