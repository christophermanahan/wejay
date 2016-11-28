/* Fireboss is a firebase database manager. It allows us to DRYly implement
   our core functionality and perfom tests using firebase-mock.

   Fireboss can:
     - create listeners for parties
     - perform routine firebase queries
     - post updates to the firebase database  */

const Fireboss = function(firebase) {
  this.database = firebase.database()
}


/* -------------------------- LISTENERS -------------------------- */

Fireboss.prototype.createPartiesListener = function(onChangeFunc) {
    this.database.ref('parties').on('value', snapshot => {
    onChangeFunc(snapshot.val());
  });
}

Fireboss.prototype.createPartyListener = function(partyId, type, onChangeFunc) {
    this.database.ref(type).child(partyId).on('value', snapshot => {
    onChangeFunc(snapshot.val());
  });
}

Fireboss.prototype.createMessagesListener = function(onChangeFunc) {
  this.database.ref('messages').on('value', snapshot => {
    onChangeFunc(snapshot.val());
  });
}

Fireboss.prototype.createPersonalQueueListener = function(partyId, user, onChangeFunc) {
  this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').on('value', snapshot => {
    onChangeFunc(snapshot.val());
  });
}


/* -------------------------- SNAPSHOTS -------------------------- */

Fireboss.prototype.getCurrentPartySnapshot = function(partyId, callback) {
  this.database.ref('parties').child(partyId).once('value', snapshot => {
    callback(snapshot.val());
  });
}

Fireboss.prototype.gettingPartyItemSnapshot = function(partyId, item) {
  return this.database.ref(item).child(partyId).once('value');
}

Fireboss.prototype.checkingUserParty = function(user) {
  return this.database.ref('user_parties').child(user.uid).once('value');
}


/* --------------------------- SETTERS --------------------------- */

Fireboss.prototype.addingPartyDJ = function(partyId, user) {
  return this.database.ref('party_djs').child(partyId).child(user.uid)
         .set({
            dj_points: 0,
            dj_name: `DJ ${user.displayName || 'Rando'}`,
            personal_queue: {}
          })
}

Fireboss.prototype.associatingPartyAndUser = function(partyId, user) {
  return this.database.ref('user_parties').child(user.uid).set(partyId)
}

Fireboss.prototype.settingCurrentSong = function(partyId, song) {
  return this.database.ref('current_song').child(partyId).set(song)
}

Fireboss.prototype.creatingParty = function(partyId, party) {
  return this.database.ref('parties').child(partyId).set(party)
}

Fireboss.prototype.setCurrentSong = function(partyId, song) {
  this.database.ref('current_song').child(partyId).set(song)
}

Fireboss.prototype.addToPartyQueue = function(partyId, type, song) {
  this.database.ref(type).child(partyId).push(song)
}

Fireboss.prototype.addToPersonalQueue = function(partyId, user, song) {
  this.database.ref('party_djs').child(partyId).child(user.uid)
  .child('personal_queue')
  .push(song);
}

Fireboss.prototype.incrementVotePriority = function(partyId, songId) {
  const partyTopTenSongRef = this.database.ref('top_ten').child(partyId).child(songId)
  // get snapshot of song, then add 1 to vote priority
  partyTopTenSongRef.once('value')
    .then(snapshot => {
      const currentVotes = snapshot && snapshot.val().vote_priority
      return partyTopTenSongRef.update({vote_priority: (currentVotes + 1)})
    })
    .then(() => {console.log('vote added!')})
}

Fireboss.prototype.decrementVotePriority = function(partyId, songId) {
  const partyTopTenSongRef = this.database.ref('top_ten').child(partyId).child(songId)
  // get snapshot of song, then subtract 1 from vote priority
  partyTopTenSongRef.once('value')
    .then(snapshot => {
      const currentVotes = snapshot && snapshot.val().vote_priority
      return partyTopTenSongRef.update({vote_priority: (currentVotes - 1)})
    })
    .then(() => {console.log('vote added!')})
}

export default Fireboss
