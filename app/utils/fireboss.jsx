/* Fireboss is a firebase database manager. A lot of firebase requests were used
   multiple times in the codebase, so we DRYed things up with this utility. It is
   mostly used to create listeners for parties and perfom some routine queries    */


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

Fireboss.prototype.checkUserParty = function(user) {
  return this.database.ref('user_parties').child(user.uid).once('value');
}


/* --------------------------- SETTERS --------------------------- */

Fireboss.prototype.addPartyDJ = function(partyId, user) {
  return this.database.ref('party_djs').child(partyId).child(user.uid)
         .set({
            dj_points: 0,
            dj_name: `DJ ${user.displayName || 'Rando'}`,
            personal_queue: {}
          })
}

Fireboss.prototype.associatePartyAndUser = function(partyId, user) {
  return this.database.ref('user_parties').child(user.uid).set(partyId)
}

Fireboss.prototype.setCurrentSong = function(partyId, song) {
  return this.database.ref('current_song').child(partyId).set(song)
}

Fireboss.prototype.createParty = function(partyId, party) {
  return this.database.ref('parties').child(partyId).set(party)
}

export default Fireboss
