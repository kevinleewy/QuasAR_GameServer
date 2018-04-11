
function randomXToY(minVal,maxVal) {
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return Math.round(randVal);
}

const EMPTY = -1;

function findAvailableSlot(field){
	var priority = [2, 1, 3, 0, 4];
	return priority.find(function(slot){
		return field[slot] == EMPTY;
	});
}

class Player {

	constructor(id){
		this.id = id;
		this.life = 3;
		this.hand = [];
		this.field = [EMPTY, EMPTY, 1, EMPTY, EMPTY];
	}

	getId(){
		return this.id;
	}

	getState() {
		return {
			"life"  : this.life,
			"hand"  : this.hand,
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

	draw(){
		var newCardId = randomXToY(0,3);
		this.hand.push(newCardId);
		return newCardId;
	}

	play(handSlot){
		var cardId = this.hand[handSlot];
		var fieldSlot = findAvailableSlot(this.field);
		if(typeof fieldSlot === "undefined"){
			fieldSlot = EMPTY;
		}
		if(fieldSlot != EMPTY){
			this.field[fieldSlot] = cardId;
			this.hand.splice(handSlot, 1);
		}
		return [
			cardId,
			handSlot,
			fieldSlot
		];
	}

	loseLife(amount){
		var newLife = Math.max(0, this.life - amount);
		var damageDealt = this.life - newLife;
		this.life = newLife
		return damageDealt
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