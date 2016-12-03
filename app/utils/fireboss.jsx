/* Fireboss is a firebase database manager. It allows us to DRYly implement
   our core functionality.

   Fireboss can:
     - create listeners for parties
     - perform routine firebase queries
     - post updates to the firebase database  */

var hri = require('human-readable-ids').hri, i;

class Fireboss {

  constructor (firebase, dispatchers, browserHistory) {
    this.database = firebase.database();
    this.auth = firebase.auth();
    this.dispatchers = dispatchers;
    this.browserHistory = browserHistory;
    this.GoogleAuth = () => {
      return new firebase.auth.GoogleAuthProvider();
    };
    this.FacebookAuth = () => {
      return new firebase.auth.FacebookAuthProvider();
    };
    this.createUserEP = (email, password) => {
      return this.auth.createUserWithEmailAndPassword(email, password)
    };
  };

  /* ---------------------- FIREBASE METHODS ---------------------- */

  setUpAllPartyListeners (partyId, user) {
    this.getCurrentPartySnapshot(partyId);
    this.createPartyListener(partyId, 'current_song');
    this.createPartyListener(partyId, 'top_ten');
    this.createPartyListener(partyId, 'party_djs');
    this.endPartyListener(partyId, user);
    this.createPersonalQueueListener(partyId, user);
    this.createShadowQueueListener(partyId, user);
  }

  joinParty (partyId, user) {
    const associatingPartyAndUser = this.associatingPartyAndUser(partyId, user);
    const addingPartyDJ = this.addingPartyDJ(partyId, user);

    return Promise.all([associatingPartyAndUser, addingPartyDJ])
            .then(() => {
              this.setUpAllPartyListeners(partyId, user);
              this.browserHistory.push('/app');
            })
            .catch(err => console.error(err));
  }

  createPartyWithListeners (partyId, user, partyObj) {
    let party = Object.assign(partyObj, {active: true, id: partyId, needSong: false});
    return this.creatingParty(partyId, party)
            .then(() => {
              const addingHostDJ = this.addingPartyDJ(partyId, user);
              const associatingPartyAndHost = this.associatingPartyAndUser(partyId, user);

              Promise.all([addingHostDJ, associatingPartyAndHost])
                .then(() => {
                  this.setUpAllPartyListeners(partyId, user);
                  this.browserHistory.push('/app');
                })
                .catch(console.error)
            })
  }

  logOut (partyId, user) {
    //testing if user is host
    if (partyId === user.uid) {
      const p1 = this.endParty(partyId);
      const p2 = this.auth.signOut();
      return Promise.all([p1, p2])
        .catch(console.error)
    } else { //if user is not host logout normally
      return this.removeUserParty(partyId, user)
        .then(err => {
          if(err) throw new Error(err);
          return this.removePartyDj(partyId, user);
        })
        .then(err => {
          if(err) throw new Error(err);
          this.removePartyListeners(partyId, user);
          this.dispatchers.leaveParty();
          this.dispatchers.clearUser();
          return this.auth.signOut()
        })
        .then(() => this.browserHistory.push('/login'))
        .catch(console.error)
    }
  }

  userLeaveParty (partyId, user) {
    //testing if user is host
    if(partyId === user.uid) {
      return this.endParty(partyId)
        .then(() => {
          this.browserHistory.push('/parties');
        })
    } else {
      return this.removeUserParty(partyId, user)
        .then(err => {
          if(err) throw new Error(err);
          return this.removePartyDj(partyId, user);
        })
        .then(err => {
          if(err) throw new Error(err);
          this.removePartyListeners(partyId, user)
          this.dispatchers.leaveParty()
          this.browserHistory.push('/parties');
        })
        .catch(console.error)
    }
  }

  submitUserSong (partyId, user, song, openSnackbar) {
    const gettingCurrentSong = this.gettingPartyItemSnapshot(partyId, 'current_song');
    const gettingTopTen = this.gettingPartyItemSnapshot(partyId, 'top_ten')
    const gettingShadowQueue = this.gettingPartyItemSnapshot(partyId, 'shadow_queue');

    Object.assign(song, {uid: user.uid})

    return Promise.all([gettingCurrentSong, gettingTopTen, gettingShadowQueue])
      .then((results) => {
        const currentSongVal = results[0] && results[0].val();
        const topTenVal = results[1] && results[1].val();
        const shadowQueueVal = results[2] && results[2].val();

        let userSongInShadowQueue = false;

        if (shadowQueueVal) {
          for (let track in shadowQueueVal) {
            if (user.uid === shadowQueueVal[track].uid) userSongInShadowQueue = true;
          }
        }

        if (!currentSongVal) {
          return this.settingCurrentSong(partyId, song)
            .then(() => openSnackbar('Nice!!! Song now playing!'));
        } else if (!topTenVal || Object.keys(topTenVal).length < 10) {
          return this.addToPartyQueue(partyId, 'top_ten', song)
            .then(() => openSnackbar('Added to Top Ten!'));
        } else if (!shadowQueueVal || !userSongInShadowQueue) {
          return this.addToPartyQueue(partyId, 'shadow_queue', song)
            .then(() => openSnackbar('Sent as a recommendation!'));
        } else {
          return this.addToPersonalQueue(partyId, user, song)
            .then(() => openSnackbar('Added to My Songs!'));
        }
      })
  }



/* -------------------------- LISTENERS -------------------------- */

  createPartiesListener () {
    this.database.ref('parties').on('value', snapshot => {
      this.dispatchers.setParties(snapshot.val());
    });
  };

  createPartyListener (partyId, type) {
    if (type === 'current_song') { 
      return this.database.ref('current_song').child(partyId).on('value', snapshot => {
        this.dispatchers.setCurrentSong(snapshot.val());
      });
    } else if ( type === 'top_ten') {
      return this.database.ref('top_ten').child(partyId).on('value', snapshot => {
        this.dispatchers.setTopTen(snapshot.val());
      }); 
    } else {
      return this.database.ref('party_djs').child(partyId).on('value', snapshot => {
        this.dispatchers.setDjs(snapshot.val());
      });
    }
  };

  endPartyListener (partyId, user) {
    this.getParty(partyId).child('active').on('value', snapshot => {
      if (snapshot.val()) return;
      return this.removeUserParty(partyId, user)
        .then(err => {
          if (err) throw new Error(err);
          return this.removePartyDj(partyId, user);
        })
        .then(err => {
          if (err) throw new Error(err);
          this.removePartyListeners(partyId, user)
          this.dispatchers.leaveParty();
          if (partyId === user.uid) return;  //dont send alert to host
          alert('the host has ended this party');
          this.browserHistory.push('/parties');
        })
        .catch(console.error);
    });
  };

  createMessagesListener (onChangeFunc) {
    this.database.ref('messages').on('value', snapshot => {
      onChangeFunc(snapshot.val());
    });
  };

  createPersonalQueueListener (partyId, user) {
    this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').on('value', snapshot => {
      this.dispatchers.setPersonalQueue(snapshot.val());
    });
  };

  createShadowQueueListener (partyId, user) {
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

  removePartyListeners (partyId, user) {
    this.database.ref('current_song').child(partyId).off();
    this.database.ref('top_ten').child(partyId).off();
    this.database.ref('party_djs').child(partyId).off();
    this.getParty(partyId).child('active').off();
    this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').off();
    this.database.ref('shadow_queue').child(partyId).off();
    this.getParty(partyId).child('active').off()
  };


  /* ------------------- SNAPSHOTS ------------------- */

  gettingPartyItemSnapshot (partyId, item) {
    return this.database.ref(item).child(partyId).once('value');
  };

  checkingUserParty (user) {
    return this.database.ref('user_parties').child(user.uid).once('value');
  };

  getCurrentPartySnapshot (partyId) {
    return this.getParty(partyId).once('value', snapshot => {
      this.dispatchers.setCurrentParty(snapshot.val());
    });
  };

  /* ------------------- SETTERS RETURNING PROMISES ------------------- */

  addingPartyDJ (partyId, user) {
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

  associatingPartyAndUser (partyId, user) {
    return this.database.ref('user_parties').child(user.uid).set(partyId)
  };

  settingCurrentSong (partyId, song) {
    return this.database.ref('current_song').child(partyId).set(song)
  };

  creatingParty (partyId, party) {
    return this.getParty(partyId).set(party)
  };

  removeUserParty (partyId, user) {
    return this.database.ref('user_parties').child(user.uid).remove()
  };

  removePartyDj (partyId, user) {
    return this.database.ref('party_djs').child(partyId).child(user.uid).remove()
  };

  endParty (partyId) {
    return this.getParty(partyId).remove()
      .then(err => {
        if(err) throw new Error(err)
        const p1 = this.database.ref('current_song').child(partyId).remove();
        const p2 = this.database.ref('top_ten').child(partyId).remove();
        const p3 = this.database.ref('party_djs').child(partyId).remove();
        const p4 = this.database.ref('shadow_queue').child(partyId).remove();
        return Promise.all([p1, p2, p3, p4])
      })
      .catch(console.error)
  };

  addToPartyQueue (partyId, type, song) {
    return this.database.ref(type).child(partyId).push(song)
  };

  addToPersonalQueue (partyId, user, song) {
    return this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').push(song);
  };

  incrementVotePriority (partyId, songId) {
    const partyTopTenSongRef = this.database.ref('top_ten').child(partyId).child(songId)
    // get snapshot of song, then add 1 to vote priority and djPoints
    return partyTopTenSongRef.once('value')
      .then(snapshot => {
        const currentVotes = snapshot && snapshot.val().vote_priority
        let userId = snapshot && snapshot.val().uid;
        const promisifiedUserId = this.promisify(userId);
        const gettingPartyDj = this.database.ref('party_djs').child(partyId).child(userId).once('value');
        const updatingTopTenVotes = partyTopTenSongRef.update({vote_priority: (currentVotes + 1)});
        return Promise.all([gettingPartyDj, promisifiedUserId, updatingTopTenVotes])
      })
      .then((results) => {
        const currentDjPoints = results[0] && results[0].val().dj_points;
        let userId = results[1];
        //increase current dj points by 1
        return this.database.ref('party_djs').child(partyId).child(userId)
          .update({dj_points: (currentDjPoints + 1)})
      })
      .then(() => {console.log('vote added!')})
      .catch(console.error)
  };

  decrementVotePriority (partyId, songId) {
    const partyTopTenSongRef = this.database.ref('top_ten').child(partyId).child(songId)
    // get snapshot of song, then add 1 to vote priority and djPoints
    return partyTopTenSongRef.once('value')
      .then(snapshot => {
        const currentVotes = snapshot && snapshot.val().vote_priority
        let userId = snapshot && snapshot.val().uid;
        const promisifiedUserId = this.promisify(userId);
        const gettingPartyDj = this.database.ref('party_djs').child(partyId).child(userId).once('value');
        const updatingTopTenVotes = partyTopTenSongRef.update({vote_priority: (currentVotes - 1)});
        return Promise.all([gettingPartyDj, promisifiedUserId, updatingTopTenVotes])
      })
      .then((results) => {
        const currentDjPoints = results[0] && results[0].val().dj_points;
        let userId = results[1];
        //increase current dj points by 1
        return this.database.ref('party_djs').child(partyId).child(userId)
          .update({dj_points: (currentDjPoints - 1)})
      })
      .then(() => {console.log('vote added!')})
      .catch(console.error)
  };

  incrementCurrSongDjPoints (userId, partyId) {
    const currentSongRef = this.database.ref('current_song').child(partyId);
    // get snapshot of song, then add 1 to vote priority and djPoints
    return currentSongRef.once('value')
      .then(snapshot => {
        const currentVotes = snapshot && snapshot.val().vote_priority
        let userId = snapshot && snapshot.val().uid;
        const promisifiedUserId = this.promisify(userId);
        const gettingPartyDj = this.database.ref('party_djs').child(partyId).child(userId).once('value');
        const updatingCurrentSongVotes = currentSongRef.update({vote_priority: (currentVotes + 1)});
        return Promise.all([gettingPartyDj, promisifiedUserId, updatingCurrentSongVotes])
      })
      .then((results) => {
        const currentDjPoints = results[0] && results[0].val().dj_points;
        let userId = results[1];
        //increase current dj points by 1
        return this.database.ref('party_djs').child(partyId).child(userId)
          .update({dj_points: (currentDjPoints + 1)})
      })
      .then(() => {console.log('vote added!')})
      .catch(console.error)
  };

  decrementCurrSongDjPoints (userId, partyId) {
    const currentSongRef = this.database.ref('current_song').child(partyId);
    // get snapshot of song, then add 1 to vote priority and djPoints
    return currentSongRef.once('value')
      .then(snapshot => {
        const currentVotes = snapshot && snapshot.val().vote_priority
        let userId = snapshot && snapshot.val().uid;
        const promisifiedUserId = this.promisify(userId);
        const gettingPartyDj = this.database.ref('party_djs').child(partyId).child(userId).once('value');
        const updatingCurrentSongVotes = currentSongRef.update({vote_priority: (currentVotes - 1)});
        return Promise.all([gettingPartyDj, promisifiedUserId, updatingCurrentSongVotes])
      })
      .then((results) => {
        const currentDjPoints = results[0] && results[0].val().dj_points;
        let userId = results[1];
        //increase current dj points by 1
        return this.database.ref('party_djs').child(partyId).child(userId)
          .update({dj_points: (currentDjPoints - 1)})
      })
      .then(() => {console.log('vote added!')})
      .catch(console.error)
  };

  triggerNeedSong (partyId) {
    return this.getParty(partyId).update({needSong: true})
  };

  //Helper Functions
  promisify (value) {
    return new Promise(resolve => {
      return resolve(value);
    });
  }

  getParty (partyId) {
    return this.database.ref('parties').child(partyId);
  }
}

export default Fireboss
