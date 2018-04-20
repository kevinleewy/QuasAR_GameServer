var GameController = require('./GameController.js');

var gameRooms = {};	//mapping(player ID => GameController) many-to-one

module.exports = {

	/**
	 * Checks whether playerId already has an active game room
	 * @param string playerId
	 * @return bool
	 */
	gameRoomExists : function(playerId) {
		return (playerId in gameRooms && gameRooms[playerId] != null);
	},

	/**
	 * Creates a game room
	 * @param string creator playerId
	 * @throw int - errorCode
	 */
	createGameRoom : function(playerId, io, socketIds) {
		//if already part of a game room
		if( gameExists(playerId) ){
			throw 1001;
		}
		gameRooms[playerId] = new GameController(playerId);
		console.log(playerId + " created a game room");
		return;
	},

	/**
	 * Destroys a game room
	 * @param playerId - player Id initiating game room destruction
	 * @param io - SocketIO object
	 * @param socketIds - mapping from playerId to socketId
	 * @throw int - errorCode
	 */
	destroyGameRoom : function(playerId) {
		//if game room doesn't exist
		if( !gameExists(playerId) ){
			throw 1002;
		}
		var gameRoom = gameRooms[playerId];
		var participants = gameRoom.getAllParticipants();
		participants.forEach(function(playerId){
			gameRooms[id] = null;
		});
		return;
	},

	/**
	 * Joins a game room as a player or spectator
	 * @param string playerId - player who is requesting to join
	 * @param string gameRoomParticipantId - Another participant already in desired game room
	 * @param bool asPlayer
	 * @return GameState
	 * @throw int - errorCode
	 */
	joinGameRoom : function(playerId, gameRoomParticipantId, asPlayer) {
		
		//if already part of a game room
		if( gameExists(playerId) ){
			throw 1001;
		}

		//if game room doesn't exist
		if( !gameExists(gameRoomParticipantId) ){
			throw 1002;
		}

		var gameRoom = gameRooms[gameRoomParticipantId];

		//if game already ended
		if( gameRoom.hasEnded() ){
			throw 1103;
		}

		if( asPlayer ){
			gameRoom.addAsPlayer(playerId);	//throws if fail
		} else {
			gameRoom.addAsSpectator(playerId);	//throw if fail
		}
		gameRooms[playerId] = gameRooms[gameRoomParticipantId];
		console.log(playerId + " successfully joins the same game room as " + gameRoomParticipantId);
		return gameRooms[playerId].getGameState();
	},

	/**
	 * Leaves a game room
	 * @param string playerId - player who is requesting to join
	 * @param bool asPlayer
	 * @throw int - errorCode
	 */
	leaveGameRoom : function(playerId, asPlayer) {

		//if game room doesn't exist
		if( !gameExists(gameRoomParticipantId) ){
			throw 1002;
		}
		var gameRoom = gameRooms[playerId];
		if( asPlayer ){
			gameRoom.removeAsPlayer(playerId); //throws if fail
		} else {
			gameRoom.removeAsSpectator(playerId); //throws if fail
		}
		gameRooms[playerId] = null;
	},

	/**
	 * Retrieves game state from game room
	 * @param playerId - player Id requesting gameState
	 * @return GameState
	 * @throw int - errorCode
	 */
	getGameState : function(playerId) {
		//if game room doesn't exist
		if( !gameExists(playerId) ){
			throw 1002;
		}
		var gameRoom = gameRooms[playerId];
		if( gameRoom.hasEnded() ){
			throw 1103;
		}
		return gameRoom.getGameState();
	},

	/**
	 * Conduct a game-related action
	 * @param playerId - player Id conducting the action
	 * @return GameState
	 * @throw int - errorCode
	 */
	conductAction : function(playerId, params) {
		if( !gameExists(playerId) ){
			throw 1002;
		}
		var gameRoom = gameRooms[playerId];
		if( gameRoom.hasEnded() ){
			throw 1103;
		}
		return gameRoom.conductAction(playerId, params);
	}
}