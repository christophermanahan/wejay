/* Firechief is a firebase database manager for Node. It is the Fireboss for the back-end.

   Firechief can:
     - create or remove listeners for parties
     - update and re-order relevant queues (Top Ten, Shadow Queue, Personal Queue)
     - remove songs based on song ending or down-vote accrual
*/


class Firechief {
	constructor(db) {
		this.db = db;
	}

	createPartyAddedListener() {
		const partiesRef = this.db.ref('parties');
		partiesRef.on('child_added', snapshot => {
			const partyId = snapshot.val() && snapshot.val().id;
			if (!partyId) return;
			this.createNewPartyListener(partyId);
		});
	}

	createNewPartyListener(partyId) {
		const newPartyRef = this.db.ref('parties').child(partyId);

		newPartyRef.on('value', snapshot => {
			const needSong = this.checkIfNeedSong(snapshot);
			if (needSong) {
				this.setCurrentSong(snapshot);
			}
		});
	}

	checkIfNeedSong(snapshot) {
		return snapshot.val() ? snapshot.val().needSong : false;
	}

	setCurrentSong(partyId) {
		const currentSongRef = db.ref('current_song').child(partyId)
		this.getHighestPriority(partyId, "top_ten")
		.then(song => {
			if(!song) {
				return this.setNeedSongToFalse(partyId)
				//////////////////
				/////////////////
			}
		})

	}


	setNeedSongToFalse(partyId) {
		return this.db.ref('parties').child(partyId).update({ needSong: false })
	}


	getHighestPriority(partyId, queue) {
		const queueRef = db.ref(queue).child(partyId)
		return queueRef.once('value')
		.then(snapshot => {
			const songsInQueue = snapshot && snapshot.val();

			if(queue === "top_ten" && !songsInQueue){
				return
			}

			let nextSong;
			let nextSongPriority = -1000;		//needs to address --> collisions when priority scores are equal
			let nextSongId;

			for (let song in songsInQueue){

				let netPriority = songsInQueue[song].time_priority + songsInQueue[song].vote_priority

				if(netPriority > nextSongPriority){
					nextSong = songsInQueue[song]
					nextSongPriority = netPriority;
					nextSongId = song
				}
			}
			return {[nextSongId]: nextSong}
		})
		.catch(console.error);


	}

	removeSong(snapshot) {
		//

	}




}

module.exports = Firechief;
