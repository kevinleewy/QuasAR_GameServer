var Deck = require('./deck.js');

function randomXToY(minVal,maxVal) {
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return Math.round(randVal);
}

const EMPTY = -1;
const MAXLIFE = 3;

function findAvailableSlot(field){
	var priority = [2, 1, 3, 0, 4];
	return priority.find(function(slot){
		return field[slot] == EMPTY;
	});
}

class Player {

	constructor(id){
		this.id = id;
		this.life = MAXLIFE;
		this.hand = [];
		this.deck = new Deck()

		this.field = [EMPTY, EMPTY, 0, EMPTY, EMPTY];
		this.eliminated = false;
	}

	getId(){
		return this.id;
	}

	getState() {
		return {
			"life"  : this.life,
			"hand"  : this.hand,
			"deck"  : this.deck.deckCount(),
			"field" : this.field
		}
	}

	numberOfCardsInHand() {
		return this.hand.length;
	}

	hasCreatureOnField(slot) {
		return this.field[slot] != EMPTY;
	}

	hasAnyCreatureOnField() {
		for(var i=0; i<this.field.length; i++){
			if(this.field[i] != EMPTY) {
				return true;
			}
		}
		return false;
	}


	shuffleDeck(){
		this.deck.shuffle();
	}

	draw(){
		if(this.deck.isEmpty()){
			return -1;
		}
		var newCardId = this.deck.removeFromTop();
		this.hand.push(newCardId);
		return newCardId;
	}

	play(handSlot){
		var cardId = this.hand[handSlot];
		var opcode;
		var result;
		var param1;
		var param2;
		if(cardId == 1){
			opcode = 1 //gain life
			result = this.playSpell(cardId);
		} else {
			opcode = 0 //summon
			result = this.summon(cardId);
		}
		if(typeof result == 'string'){
			return result;
		}
		[param1, param2] = result;
		this.hand.splice(handSlot, 1);
		return [
			handSlot,
			opcode,
			param1,
			param2
		];
	}

	summon(cardId){
		var fieldSlot = findAvailableSlot(this.field);
		if(typeof fieldSlot === "undefined"){
			fieldSlot = EMPTY;
		}
		if(fieldSlot == EMPTY){
			return "no field slot";
		}
		this.field[fieldSlot] = cardId;
		return [
			fieldSlot,  //slot to summon card
			cardId 		//what to summon
		];
	}

	playSpell(cardId){
		if(cardId == 1){
			var lifeGained = this.gainLife(1);
			return [
				0, //this player
				lifeGained
			]; 
		}
		return "Invalid card ID";
	}

	gainLife(amount){
		var newLife = Math.min(MAXLIFE, this.life + amount);
		var lifeHealed = newLife - this.life;
		this.life = newLife
		return lifeHealed
	}

	loseLife(amount){
		var newLife = Math.max(0, this.life - amount);
		var lifeLost = this.life - newLife;
		this.life = newLife
		return lifeLost
	}

	destroyCreature(slot){
		this.field[slot] = EMPTY
		return 1;	//1 for destroyed=true
	}

	surrender(){
		this.life = 0;
	}

	isDead() {
		return this.life <= 0;
	}
}

module.exports = Player