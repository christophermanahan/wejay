/* Fireboss is a firebase database manager. It allows us to DRYly implement
   our core functionality.

   Fireboss can:
     - create listeners for parties
     - perform routine firebase queries
     - post updates to the firebase database  */

const Fireboss = function(firebase) {
  this.database = firebase.database()
  this.auth = firebase.auth()
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

Fireboss.prototype.endPartyListener = function(partyId, user, leaveParty, browserHistory) {
  this.database.ref('parties').child(partyId).child('active').on('value', snapshot => {
    if(snapshot.val()) {
      console.log('party still raging')
    } else {
      this.removeUserParty(partyId, user)
        .then(err => {
          if(err){
            throw new Error(err)
          } else {
            return this.removePartyDj(partyId, user)
          }
        })
        .then(err => {
          if(err){
            throw new Error(err)
          } else {
            this.removePartyListeners(partyId, user)
            leaveParty();
            if(partyId !== user.uid) {
              alert('the host has ended this party')
              browserHistory.push('/parties')
            } else {
              console.log('you ended the party')
            }
          }
        })
        .catch(console.error)
      }
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

Fireboss.prototype.removePartyListeners = function(partyId, user) {
  this.database.ref('current_song').child(partyId).off()
  this.database.ref('top_ten').child(partyId).off()
  this.database.ref('party_djs').child(partyId).off()
  this.database.ref('messages').off()
  this.database.ref('parties').child(partyId).child('partyEnded').off()
  this.database.ref('party_djs').child(partyId).child(user.uid)
    .child('personal_queue').off()
  console.log('listeners removed!')
}


/* ------------------- SETTERS RETURNING PROMISES ------------------- */

Fireboss.prototype.gettingPartyItemSnapshot = function(partyId, item) {
  return this.database.ref(item).child(partyId).once('value');
}

Fireboss.prototype.checkingUserParty = function(user) {
  return this.database.ref('user_parties').child(user.uid).once('value');
}

Fireboss.prototype.addingPartyDJ = function(partyId, user) {
  return this.database.ref('party_djs').child(partyId).child(user.uid)
         .set({
            dj_points: 0,
            uid: user.uid,
            photo: user.photoURL || "https://thumbnailer.mixcloud.com/unsafe/318x318/extaudio/0/9/b/f/ce50-0b29-40a3-a31b-95b1b9b38c5c",
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

Fireboss.prototype.removeUserParty = function(partyId, user) {
  return this.database.ref('user_parties').child(user.uid).remove()
}

Fireboss.prototype.removePartyDj = function(partyId, user) {
  return this.database.ref(partyId).child(user.uid).remove()
}

/* ------------------- SETTERS (NO PROMISES) ------------------- */

Fireboss.prototype.getCurrentPartySnapshot = function(partyId, callback) {
  this.database.ref('parties').child(partyId).once('value', snapshot => {
    callback(snapshot.val());
  });
}

Fireboss.prototype.setCurrentSong = function(partyId, song) {
  this.database.ref('current_song').child(partyId).set(song)
}

Fireboss.prototype.endParty = function(partyId) {
  this.database.ref('parties').child(partyId).remove()
    .then(err => {
        if(err){
          throw new Error(err)
        } else {
          this.database.ref('current_song').child(partyId).remove()
          this.database.ref('top_ten').child(partyId).remove()
          this.database.ref('party_djs').child(partyId).remove()
          this.database.ref('shadow_queue').child(partyId).remove()
        }
      })
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
  // get snapshot of song, then add 1 to vote priority and djPoints
  partyTopTenSongRef.once('value')
    .then(snapshot => {
      const currentVotes = snapshot && snapshot.val().vote_priority
      const userId = snapshot && snapshot.val().uid

      this.database.ref('party_djs').child(partyId).child(userId).once('value')
        .then(snapshot => {
          const currentDjPoints = snapshot && snapshot.val().dj_points
          this.database.ref('party_djs').child(partyId).child(userId)
            .update({dj_points: (currentDjPoints + 1)})
        })

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
      const userId = snapshot && snapshot.val().uid

      this.database.ref('party_djs').child(partyId).child(userId).once('value')
        .then(snapshot => {
          const currentDjPoints = snapshot && snapshot.val().dj_points
          this.database.ref('party_djs').child(partyId).child(userId)
            .update({dj_points: (currentDjPoints - 1)})
        })

      return partyTopTenSongRef.update({vote_priority: (currentVotes - 1)})
    })
    .then(() => {console.log('vote added!')})
}


export default Fireboss
