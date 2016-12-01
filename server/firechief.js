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

			const newPartyRef = this.db.ref('parties').child(partyId);

			newPartyRef.on('value', val => {
				const needSong = this.checkIfNeedSong(val);
				if (needSong) {
					this.reOrderQueues(val);
				}
			});
		});
	}

	checkIfNeedSong(snapshot) {
		//
	}

	reOrderQueues(snapshot) {
		//
	}




}

module.exports = Firechief;

