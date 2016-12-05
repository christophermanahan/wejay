/* Firechief is a firebase database manager for Node. It is the Fireboss for the back-end.

   Firechief can:
     - create or remove listeners for parties
     - update and re-order relevant queues (Top Ten, Shadow Queue, Personal Queue)
     - remove songs based on song ending or down-vote accrual
*/


class Firechief {
	constructor(db) {
		this.db = db;
		this.incrementers = {};

		this.incrementerHelper = this.incrementerHelper.bind(this);
	}

	/*---------------------- CORE LISTENERS -------------------------*/

	createPartyAddedListener(topTenInterval, sqInterval) {
		const partiesRef = this.db.ref('parties');

		partiesRef.on('child_added', snapshot => {
			const partyId = snapshot.val() && snapshot.val().id;
			if (!partyId) return;

			this.createNewPartyListener(partyId);
			if (topTenInterval) {
				this.createTimePriorityIncrementer(partyId, topTenInterval, 'top_ten');
			}
			if (sqInterval) {
				this.createTimePriorityIncrementer(partyId, sqInterval, 'shadow_queue');
			}
		});
	}

	createPartyRemovedListener() {
		const partiesRef = this.db.ref('parties');

		partiesRef.on('child_removed', snapshot => {
			const partyId = snapshot.val() && snapshot.val().id;
			if (!partyId) return;
			this.removePartyListener(partyId);
			this.removeTimePriorityIncrementer(partyId, 'top_ten');
			this.removeTimePriorityIncrementer(partyId, 'shadow_queue');
		});
	}

	/*---------------------- SUB-LISTENERS -------------------------*/

	createNewPartyListener(partyId) {
		const newPartyRef = this.db.ref('parties').child(partyId);
		newPartyRef.on('value', snapshot => {
			const party = snapshot && snapshot.val();
			if (!party) return;
			const { needSong, songToRemove } = party;

			if (needSong) {
				this.masterReorder(partyId);
			} else if (songToRemove) {
				this.removeWorstSong(partyId, songToRemove);
			}
		});
	}

	removePartyListener(partyId) {
		this.db.ref('parties').child(partyId).off();
	}

	/*---------------------- TIME PRIORITY -------------------------*/

	createTimePriorityIncrementer(partyId, interval, queue) {
		this.incrementers[partyId] = this.incrementers[partyId] || {};
		this.incrementers[partyId][queue] = setInterval(this.incrementerHelper, interval, partyId, queue);

	}

	removeTimePriorityIncrementer(partyId, queue) {
		clearInterval(this.incrementers[partyId][queue]);
		this.incrementers[partyId][queue] = null;
	}

	/*---------------------- CORE RE-ORDERING -------------------------*/


	masterReorder(partyId) {
		return this.setCurrentSong(partyId)
		.then(() => {
			return this.pullFromShadowQueue(partyId);
		})
		.then(resultsArr => {
			if (!resultsArr) return;
			const uid = resultsArr[0];
			return this.pullFromPersonalQueue(partyId, uid);
		})
		.then(() => {
			// console.log('finished a full re-order, including PQ!');
		})
		.catch(console.error);
	}

	removeWorstSong(partyId, songId) {
		return this.clearSongToRemove(partyId)
		.then(() => {
			return this.removeSong(partyId, 'top_ten', songId);
		})
		.then(() => {
			return this.pullFromShadowQueue(partyId);
		})
		.then(resultsArr => {
			if (!resultsArr) return;
			const uid = resultsArr[0];
			return this.pullFromPersonalQueue(partyId, uid);
		})
		.then(() => {
			// console.log('finished a re-order post-worst song!')
		})
		.catch(console.error);
	}

	/*---------------------- SUB-RE-ORDERING -------------------------*/


	pullFromShadowQueue(partyId){
		return this.getHighestPriority(partyId, 'shadow_queue')		//get hi pri from SQ
		.then(song => {
			if (!song) return;
			const songId = this.deconstructSongObject(song, 'hash');
			const songObj = this.deconstructSongObject(song);
			const { uid } = songObj;
			return Promise.all([
				this.promisifySQuid(uid),
				this.db.ref('top_ten').child(partyId).update(song), 	// push onto top ten
				this.removeSong(partyId, 'shadow_queue', songId) 			// delete song from SQ
			])
			.catch(console.error);
		});
	}


	pullFromPersonalQueue(partyId, uid) {
		return this.getHighestPriority(partyId, 'personal_queue', uid) //grab song from PQ
		.then(song => {
			if (!song) return;
			const songObj = this.deconstructSongObject(song);
			const { uid } = songObj;
			const songId = this.deconstructSongObject(song, 'hash');
			return Promise.all([
				this.db.ref('shadow_queue').child(partyId).update(song), 	// put onto shadow queue
				this.removeSong(partyId, 'personal_queue', songId, uid)		// delete song from PQ
			]);
		})
		.catch(console.error);
	}


	/*----------------------  HELPER SETTERS  -------------------------*/

	// below is a heavy-handed version that may over-write changes in the queue
	// we stored a .transaction solution in an earlier commit but it proved unreliable

	incrementerHelper(pid, queue) {

		const addOne = songsInQueue => {
			const keys = Object.keys(songsInQueue);

			keys.forEach(key => {
				songsInQueue[key].time_priority++;
			});
			return songsInQueue;
		};

		this.db.ref(queue).child(pid).once('value')
		.then(snapshot => {
			const songs = snapshot && snapshot.val();
			if (!songs) return;

			const newSongs = addOne(songs);
			return this.db.ref(queue).child(pid).set(newSongs);
		})
		.then(() => {})
		.catch(console.error);
	}

	setNeedSongToFalse(partyId) {
		return this.db.ref('parties').child(partyId).update({ needSong: false });
	}

	clearSongToRemove(partyId) {
		return this.db.ref('parties').child(partyId).update({ songToRemove: '' });
	}

	setCurrentSong(partyId) {
		const currentSongRef = this.db.ref('current_song').child(partyId);

		return this.getHighestPriority(partyId, 'top_ten')
		.then(song => {		//song ==> {nextSongId: nextSong}
			if (!song) {
				return Promise.all([
					currentSongRef.set({}),
					this.setNeedSongToFalse(partyId)
				]);
			}
			const newSong = this.deconstructSongObject(song);
			const newSongId = this.deconstructSongObject(song, 'hash');

			return Promise.all([
				//set current song to song
				currentSongRef.set(newSong),
				// update needSong to false
				this.setNeedSongToFalse(partyId),
				// remove song from top ten
				this.removeSong(partyId, 'top_ten', newSongId)
			]);
		})
		.catch(console.error);
	}


	removeSong(partyId, queue, hashId, uid) {
		const queueRef = (uid) ?
			this.db.ref('party_djs').child(partyId).child(uid).child(queue)
			:
			this.db.ref(queue).child(partyId);

		return queueRef.child(hashId).remove()
		.then(err => {
			if (err){
				throw new Error(err);
			} else {
				return true;
			}
		})
		.catch(console.error);
	}

	/*----------------------  HELPER GETTERS  -------------------------*/

	getHighestPriority(partyId, queue, uid) {
		const queueRef = (uid) ?
			this.db.ref('party_djs').child(partyId).child(uid).child(queue)
			:
			this.db.ref(queue).child(partyId);

		return queueRef.once('value')
		.then(snapshot => {
			const songsInQueue = snapshot && snapshot.val();

			if (!songsInQueue) return;

			let nextSong;
			let nextSongPriority = -1000;		// note: if priority scores are equal, nextSong defaults to song with older timestamp
			let nextSongId;

			for (let song in songsInQueue) {

				let netPriority = songsInQueue[song].time_priority + songsInQueue[song].vote_priority;

				if (netPriority > nextSongPriority){
					nextSong = songsInQueue[song];
					nextSongPriority = netPriority;
					nextSongId = song;
				}
			}
			if (uid) { nextSong = Object.assign({}, nextSong, { vote_priority: 0 }) }

			return {[nextSongId]: nextSong};
		})
		.catch(console.error);
	}

	/*----------------------  HELPER UTILS  -------------------------*/


	promisifySQuid(uid){
		return new Promise((resolve, reject) => {
			resolve(uid);
		});
	}

	deconstructSongObject(song, option) {						// Our Firebase often has unique hash vals that point to song objects
		const hash = Object.keys(song)[0];						// sometimes we want the hash val key,
		return option === 'hash' ? hash : song[hash];	// sometimes the song object that it points to
	}

}

module.exports = Firechief;
