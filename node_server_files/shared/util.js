module.exports = {

	randomXToY : function(minVal,maxVal) {
	  var randVal = minVal+(Math.random()*(maxVal-minVal));
	  return Math.round(randVal);
	}
}