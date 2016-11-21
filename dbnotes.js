/*


// -----------------    QUEUES     ------------------ //
currentSong: {
	partyID: songid
}

topTen: {

	partyID: [ songid, songid, ... ]
	partyID: []
}

shadowQueue: {
	partyID: [songid, songid, ...],
	partyID: []
}

personalQueue: {
	uid: [songid, songid, ....],
	uid: [],
	uid: []...
}

songs: {
	id: { djid: uid,
				time_priority: int,
				vote_priority: int,
				sc_id: str,
				sc_title: str,
				sc_artist: str
		  }
}


// -----------------    ATTENDEES     ------------------ //

djs: {

	partyID: [ uid, uid, ...],
	partyID: []
}

djpoints: {
	uid: int,
	uid: int...
}


// -----------------    PARTIES     ------------------ //

parties: {
	partyID: name
}

addresses: {
	partyID: {}
}


// -----------------    PERSISTENCE     ------------------ //
djNames: {
	uid: ''
}


// -----------------    OTHER     ------------------ //

( party ID === uid of host)

// workaround if cannot set partyID to uid of host
partyHosts: {
	uniquePartyId: uid of host
}


RULES OF QUEUES

1. Top Ten are immutable but can move up/down top ten depending on 1) up/downvotes and 2) time 
2. When a song finishes playing, the next song to play is #1 on the Top Ten
3. When a song finishes playing, the next song to go to the Top Ten is the one on the shadow queue with highest priority
4. Shadow Queue consists of one song per user
5. Personal Queues have a limit of 10 songs per user
6. When a song enters the Shadow queue, its priority is based on the DJ points of the user who selected it
7. All songs gain priority at an equal rate while on the shadow queue (and top ten, per rule #1)
8. When a song enters the Top Ten, its 'priority points' are set to zero


THEREFORE
A. When a song finishes playing:
		i. Node sets the new Current Song to #1 in Top Ten
		ii. Node takes the highest priority song in the shadow queue (call it 'Song X') and adds it to the Top Ten
		iii. Node finds DJ of Song X, takes his/her #1 suggestion (from personal queue) and adds it to the Shadow Queue.
		iv. When adding 'Song X', Node takes into account DJ points of 'DJ X' to set initial priority

B. When a song is up/downvoted in Top Ten
	i. Node listens for this event, and re-orders Top Ten accordingly
	ii. Node adjusts DJ points of song suggestor

C. With the passage of time
	i. All songs on Shadow Queue gain priority
	ii. All songs on Top Ten gain priority


*/