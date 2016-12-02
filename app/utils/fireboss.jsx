/* Fireboss is a firebase database manager. It allows us to DRYly implement
   our core functionality.

   Fireboss can:
     - create listeners for parties
     - perform routine firebase queries
     - post updates to the firebase database  */

var hri = require('human-readable-ids').hri, i;

const Fireboss = function(firebase, dispatchers, browserHistory) {
  this.database = firebase.database();
  this.auth = firebase.auth();
  this.dispatchers = dispatchers;
  this.browserHistory = browserHistory;
  this.GoogleAuth = function() {
    return new firebase.auth.GoogleAuthProvider();
  };
  this.FacebookAuth = function() {
    return new firebase.auth.FacebookAuthProvider();
  };
  this.createUserEP = function(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password)
  };
};



/* -------------------------- LISTENERS -------------------------- */

Fireboss.prototype.createPartiesListener = function() {
  this.database.ref('parties').on('value', snapshot => {
    this.dispatchers.setParties(snapshot.val());
  });
};

Fireboss.prototype.createPartyListener = function(partyId, type) {
  switch(type) {
    case 'current_song':
      this.database.ref('current_song').child(partyId).on('value', snapshot => {
        this.dispatchers.setCurrentSong(snapshot.val());
      });

    case 'top_ten':
      this.database.ref('top_ten').child(partyId).on('value', snapshot => {
        this.dispatchers.setTopTen(snapshot.val());
      });

    case 'party_djs':
      this.database.ref('party_djs').child(partyId).on('value', snapshot => {
        this.dispatchers.setDjs(snapshot.val());
      });
  }
};

Fireboss.prototype.endPartyListener = function(partyId, user) {
  this.database.ref('parties').child(partyId).child('active').on('value', snapshot => {
    if (snapshot.val()) {
      // console.log('party still raging');
    } else {
      this.removeUserParty(partyId, user)
        .then(err => {
          if (err){
            throw new Error(err);
          } else {
            return this.removePartyDj(partyId, user);
          }
        })
        .then(err => {
          if (err){
            throw new Error(err);
          } else {
            this.removePartyListeners(partyId, user);
            this.dispatchers.leaveParty();
            if (partyId !== user.uid) {
              alert('the host has ended this party');
              this.browserHistory.push('/parties');
            } else {
              // console.log('you ended the party');
            }
          }
        })
        .catch(console.error);
      }
  });
};

Fireboss.prototype.createMessagesListener = function(onChangeFunc) {
  this.database.ref('messages').on('value', snapshot => {
    onChangeFunc(snapshot.val());
  });
};

Fireboss.prototype.createPersonalQueueListener = function(partyId, user) {
  this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').on('value', snapshot => {
    this.dispatchers.setPersonalQueue(snapshot.val());
  });
};

Fireboss.prototype.createShadowQueueListener = function(partyId, user) {
  this.database.ref('shadow_queue').child(partyId).on('value', snapshot => {

    // filter songs so only user's songs sent to redux store, not full shadow queue
    const fullShadowQueue = snapshot.val();
    let userSongsInSQ = {};

    for (let song in fullShadowQueue) {
      if (fullShadowQueue[song].uid === user.uid) {
        userSongsInSQ[song] = fullShadowQueue[song];
      }
    }
    this.dispatchers.setShadowQueue(userSongsInSQ);
  });
};

Fireboss.prototype.removePartyListeners = function(partyId, user) {
  const l1 = this.database.ref('current_song').child(partyId).off();
  const l2 = this.database.ref('top_ten').child(partyId).off();
  const l3 = this.database.ref('party_djs').child(partyId).off();
  // this.database.ref('messages').off();
  const l4 = this.database.ref('parties').child(partyId).child('partyEnded').off();
  const l5 = this.database.ref('party_djs').child(partyId).child(user.uid)
    .child('personal_queue').off();
  const l6 = this.database.ref('shadow_queue').child(partyId).off();
  const l7 = this.database.ref('parties').child(partyId).child('active').off()
  // l1 - l7 represent Promises that turn off specific listeners
  return Promise.all([l1, l2, l3, l4, l5, l6, l7])
};


/* ------------------- SNAPSHOTS (PROMISE & NO PROMISE) ------------------- */

Fireboss.prototype.gettingPartyItemSnapshot = function(partyId, item) {
  return this.database.ref(item).child(partyId).once('value');
};

Fireboss.prototype.checkingUserParty = function(user) {
  return this.database.ref('user_parties').child(user.uid).once('value');
};

Fireboss.prototype.getCurrentPartySnapshot = function(partyId) {
  this.database.ref('parties').child(partyId).once('value', snapshot => {
    this.dispatchers.setCurrentParty(snapshot.val());
  });
};

/* ------------------- SETTERS RETURNING PROMISES ------------------- */

Fireboss.prototype.addingPartyDJ = function(partyId, user) {
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  let hriString = hri.random().split('-');
  let djName = [];
  for(let i = 0; i < 2; i++) {
    djName.push(capitalize(hriString[i]));
  }
  djName = djName.join(' ');
  // console.log(djName);

  let djPhotos = [
    "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-headphone-512.png",
    "https://cdn3.iconfinder.com/data/icons/block/32/headphones-512.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Headphone_icon.svg/1024px-Headphone_icon.svg.png",
    "https://image.freepik.com/free-icon/dj-boy-playing-music_318-29813.png",
    "https://image.freepik.com/free-icon/musical-disc-and-dj-hand_318-43527.png",
    "https://maxcdn.icons8.com/Share/icon/Music/dj1600.png",
    "https://image.freepik.com/free-icon/disc-jockey-with-shades-and-headphones-at-dj-booth_318-43815.jpg",
    "https://cdn3.iconfinder.com/data/icons/devices-and-communication-2/100/turntable-512.png",
    "http://northernlinestudio.co.uk/wp-content/themes/NorthernLineWPTheme/assets/img/icon_dj.png",
    "http://icons.iconarchive.com/icons/icons8/android/512/Music-Dj-icon.png"
  ]

  let djPhoto = djPhotos[Math.floor(Math.random() * 10)];

  return this.database.ref('party_djs').child(partyId).child(user.uid)
         .set({
            dj_points: 0,
            uid: user.uid,
            photo: user.photoURL || djPhoto,
            dj_name: `DJ ${user.displayName || djName}`,
            personal_queue: {}
          })
};

Fireboss.prototype.associatingPartyAndUser = function(partyId, user) {
  return this.database.ref('user_parties').child(user.uid).set(partyId)
};

Fireboss.prototype.settingCurrentSong = function(partyId, song) {
  return this.database.ref('current_song').child(partyId).set(song)
};

Fireboss.prototype.creatingParty = function(partyId, party) {
  return this.database.ref('parties').child(partyId).set(party)
};

Fireboss.prototype.removeUserParty = function(partyId, user) {
  return this.database.ref('user_parties').child(user.uid).remove()
};

Fireboss.prototype.removePartyDj = function(partyId, user) {
  return this.database.ref('party_djs').child(partyId).child(user.uid).remove()
};

/* ------------------- SETTERS (NO PROMISES) ------------------- */

Fireboss.prototype.setCurrentSong = function(partyId, song) {
  this.database.ref('current_song').child(partyId).set(song)
};

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
};

Fireboss.prototype.addToPartyQueue = function(partyId, type, song) {
  this.database.ref(type).child(partyId).push(song)
};

Fireboss.prototype.addToPersonalQueue = function(partyId, user, song) {
  this.database.ref('party_djs').child(partyId).child(user.uid)
  .child('personal_queue')
  .push(song);
};

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
};

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
};

Fireboss.prototype.incrementCurrSongDjPoints = function(userId, partyId) {
  const currentSongRef = this.database.ref('current_song').child(partyId);

  currentSongRef.once('value')
  .then(snapshot => {
    const currentVotes = snapshot && snapshot.val().vote_priority

    this.database.ref('party_djs').child(partyId).child(userId).once('value')
    .then(snapshot => {
      const currentDjPoints = snapshot && snapshot.val().dj_points;
      this.database.ref('party_djs').child(partyId).child(userId)
      .update({dj_points: (currentDjPoints + 1)});
    });

    return currentSongRef.update({vote_priority: (currentVotes + 1)})
  })
  .then(() => {console.log('vote added!')});
};

Fireboss.prototype.decrementCurrSongDjPoints = function(userId, partyId) {
  const currentSongRef = this.database.ref('current_song').child(partyId);

  currentSongRef.once('value')
  .then(snapshot => {
    const currentVotes = snapshot && snapshot.val().vote_priority

    this.database.ref('party_djs').child(partyId).child(userId).once('value')
    .then(snapshot => {
      const currentDjPoints = snapshot && snapshot.val().dj_points;
      this.database.ref('party_djs').child(partyId).child(userId)
      .update({dj_points: (currentDjPoints - 1)});
    });

    return currentSongRef.update({vote_priority: (currentVotes - 1)})
  })
  .then(() => {console.log('vote added!')});
};

Fireboss.prototype.triggerNeedSong = function(partyId) {
  this.database.ref('parties').child(partyId).update({needSong: true})
};


/* ---------------------- COMBOS ---------------------- */

Fireboss.prototype.setUpAllPartyListeners = function(partyId, user) {
  this.getCurrentPartySnapshot(partyId);
  this.createPartyListener(partyId, 'current_song');
  this.createPartyListener(partyId, 'top_ten');
  this.createPartyListener(partyId, 'party_djs');
  this.endPartyListener(partyId, user);
  this.createPersonalQueueListener(partyId, user);
  this.createShadowQueueListener(partyId, user);
}

Fireboss.prototype.joinParty = function(partyId, user) {
  const associatingPartyAndUser = this.associatingPartyAndUser(partyId, user);
  const addingPartyDJ = this.addingPartyDJ(partyId, user);

  return Promise.all([associatingPartyAndUser, addingPartyDJ])
          .then(() => {
            this.setUpAllPartyListeners(partyId, user)
            this.browserHistory.push('/app');
          })
          .catch(err => console.error(err)) // TODO: need real error handling

}

Fireboss.prototype.createPartyWithListeners = function(partyId, user, partyObj) {
  let party = Object.assign(partyObj, {active: true, id: partyId, needSong: false});
  return this.creatingParty(partyId, party)
          .then(() => {
            const addingHostDJ = this.addingPartyDJ(partyId, user);
            const associatingPartyAndHost = this.associatingPartyAndUser(partyId, user);

            Promise.all([addingHostDJ, associatingPartyAndHost])
              .then(() => {
                this.setUpAllPartyListeners(partyId, user)
                this.browserHistory.push('/app');
              })
              .catch(console.error) // TODO: real error handling
          });
}

Fireboss.prototype.logOut = function(partyId, user) {
  const { uid } = user;
  if(partyId === uid) {
    this.endParty(partyId)
    this.auth.signOut()
      .then(() => {
        this.dispatchers.clearUser();
        this.browserHistory.push('/login')
      },
            () =>{console.log('error')}
      )
  }
  else {
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
          this.dispatchers.leaveParty();
          this.dispatchers.clearUser();
          this.auth.signOut()
            .then(() => {this.browserHistory.push('/login')},
                  () =>{console.log('error')}
            )
        }
      })
      .catch(console.error)
  }
}

Fireboss.prototype.userLeaveParty = function(partyId, user) {
  const { uid } = user;

  if(partyId === uid) {
    // console.log("you are the host")
    this.endParty(partyId)
    this.browserHistory.push('/parties');
  }
  else {
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
            this.dispatchers.leaveParty()
            this.browserHistory.push('/parties');
          }
        })
      .catch(console.error)
  }
}

Fireboss.prototype.submitUserSong = function(partyId, user, song, openSnackbar) {
  const { uid } = user;
  const gettingCurrentSong = this.gettingPartyItemSnapshot(partyId, 'current_song');
  const gettingTopTen = this.gettingPartyItemSnapshot(partyId, 'top_ten')
  const gettingShadowQueue = this.gettingPartyItemSnapshot(partyId, 'shadow_queue');

  Object.assign(song, {uid: user.uid})

  return Promise.all([gettingCurrentSong, gettingTopTen, gettingShadowQueue])
    .then(results => {
      const currentSongVal = results[0] && results[0].val();
      const topTenVal = results[1] && results[1].val();
      const shadowQueueVal = results[2] && results[2].val();

      let userSongInShadowQueue = false;

      if (shadowQueueVal) {
        for (let track in shadowQueueVal) {
          if (uid === shadowQueueVal[track].uid) userSongInShadowQueue = true;
        }
      }

      if (!currentSongVal) {
        this.setCurrentSong(partyId, song);
        openSnackbar('Nice!!! Song now playing!');
      } else if (!topTenVal || Object.keys(topTenVal).length < 10) {
        this.addToPartyQueue(partyId, 'top_ten', song);
        openSnackbar('Added to Top Ten!');
      } else if (!shadowQueueVal || !userSongInShadowQueue) {
        this.addToPartyQueue(partyId, 'shadow_queue', song);
        openSnackbar('Sent as a recommendation!');
      } else {
        this.addToPersonalQueue(partyId, user, song);
        openSnackbar('Added to My Songs!');
      }
    });
}

export default Fireboss
