error_codes = {
	
	/**
	 *		GAME ROOM - PARTICIPANTS
	 */

	1001 : {
		"EN" : "This player ID is currently part of an existing game room",
	},

	1002 : {
		"EN" : "No game room exists for this player ID",
	},

	1003 : {
		"EN" : "Game room already at maximum number of players",
	}

	1004 : {
		"EN" : "Game room already at maximum number of spectators",
	},

	1005 : {
		"EN" : "Not a player of this game room",
	},

	1006 : {
		"EN" : "Not a spectator of this game room",
	},

	1007 : {
		"EN" : "Neither a player nor spectator of this game room",
	},

	1008 : {
		"EN" : "Game room does not have enough players",
	}

	1009 : {
		"EN" : "Game room has too many players",
	},

	1010 : {
		"EN" : "Game room does not have enough spectators",
	}

	1011 : {
		"EN" : "Game room has too many spectators",
	},

	/**
	 *		GAME ROOM - GAME STATUS
	 */

	1101 : {
		"EN" : "Game has not started",
	},

	1102 : {
		"EN" : "Game in progress",
	},

	1103 : {
		"EN" : "Game already ended",
	},


	/**
	 *		GAME - ACTIONS
	 */

	1201 : {
		"EN" : "Invalid action",
	},

	1202 : {
		"EN" : "Not this players turn",
	},

	1203 : {
		"EN" : "No cards left in deck",
	},

}

module.exports = function(code, language) {
	if(code in error_codes){
		if(language in error_codes[code]){
			return error_codes[code][language];
		}
		return error_codes[code]["ENG"];
	} else {
		return null;
	}
}