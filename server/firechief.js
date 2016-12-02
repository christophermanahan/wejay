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
		console.log("into createPartyAddedListener");
		const partiesRef = this.db.ref('parties');
		partiesRef.on('child_added', snapshot => {
			const partyId = snapshot.val() && snapshot.val().id;
			if (!partyId) return;
			this.createNewPartyListener(partyId);
		});
	}

	createNewPartyListener(partyId) {
		console.log("into createNewPartyListener");

		const newPartyRef = this.db.ref('parties').child(partyId);

		newPartyRef.on('value', snapshot => {
			const needSong = this.checkIfNeedSong(snapshot);
			if (needSong) {
				// this.setCurrentSong(snapshot);

				//need to spread off of the returned promise all array
				console.log("into need song");

				this.masterReorder(partyId)

			}
		});
	}

	masterReorder(partyId) {
		this.setCurrentSong(partyId)
		.then(([one, two, three]) => {
			console.log("1", one);
			console.log("2",two);
			console.log("3",three);
		})
		.catch(console.error)
	}






	checkIfNeedSong(snapshot) {
		return snapshot.val() ? snapshot.val().needSong : false;
	}


	deconstructSongObject(song, option) {						//in Firebase unique hash vals point to songs
		const hash = Object.keys(song)[0]							//sometimes we want the key hash val,
		return option === "hash" ? hash : song[hash]	//sometimes the song object that it points to
	}

	setNeedSongToFalse(partyId) {
		return this.db.ref('parties').child(partyId).update({ needSong: false })
	}

	setCurrentSong(partyId) {
		const currentSongRef = this.db.ref('current_song').child(partyId)
		console.log("into setCurrentSong");

		return this.getHighestPriority(partyId, "top_ten")
		.then(song => {		//song ==> {nextSongId: nextSong}
			if(!song) {
				return this.setNeedSongToFalse(partyId)
			}
			const newSong = this.deconstructSongObject(song)
			const newSongId = this.deconstructSongObject(song, "hash")

			return Promise.all([
				//set current song to song
				currentSongRef.set(newSong),
				// update needSong to false
				this.setNeedSongToFalse(partyId),
				// remove song from top ten
				this.removeSong(partyId, "top_ten", newSongId)
			])
		})
		.catch(console.error);

	}


	removeSong(partyId, queue, hashId) {
		return this.db.ref(queue).child(partyId).child(hashId).remove()
		.then(err => {
			if(err){
				throw new Error(err)
			} else {
				return true;
			}
		})
		.catch(console.error);
	}


	getHighestPriority(partyId, queue) {
		const queueRef = this.db.ref(queue).child(partyId)
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







}

module.exports = Firechief;
