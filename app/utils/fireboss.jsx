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
  }

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
            .then(() => {
              this.checkAndUpdateDjName(partyId, user)
            })
            .catch(err => console.error(err));
  }

  createPartyWithListeners (partyId, user, partyObj) {
    let party = Object.assign(partyObj, {active: true, id: partyId, needSong: false, songToRemove: ''});
    return this.creatingParty(partyId, party)
            .then(() => {
              const addingHostDJ = this.addingPartyDJ(partyId, user);
              const associatingPartyAndHost = this.associatingPartyAndUser(partyId, user);

              Promise.all([addingHostDJ, associatingPartyAndHost])
                .then(() => {
                  this.setUpAllPartyListeners(partyId, user);
                  this.browserHistory.push('/app');
                })
                .then(() => {
                  this.checkAndUpdateDjName(partyId, user)
                })
                .catch(console.error)
            })
  }

  logOut (partyId, user) {
    //testing if user is host
    if (partyId === user.uid) {
      this.endParty(partyId)
        .then(() => {
          return this.auth.signOut()
        })
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

  userRemoveSong(partyId, uid, songId) {
    return this.database.ref('party_djs').child(partyId).child(uid).child('personal_queue').child(songId).remove()
           .catch(console.error)
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
  }

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
  }

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
  }

  createMessagesListener (onChangeFunc) {
    this.database.ref('messages').on('value', snapshot => {
      onChangeFunc(snapshot.val());
    });
  }

  createPersonalQueueListener (partyId, user) {
    this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').on('value', snapshot => {
      this.dispatchers.setPersonalQueue(snapshot.val());
    });
  }

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
  }

  removePartyListeners (partyId, user) {
    this.getParty(partyId).off();
    this.database.ref('current_song').child(partyId).off();
    this.database.ref('top_ten').child(partyId).off();
    this.database.ref('party_djs').child(partyId).off();
    this.getParty(partyId).child('active').off();
    this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').off();
    this.database.ref('shadow_queue').child(partyId).off();
    this.getParty(partyId).child('active').off();
  }


  /* ------------------- SNAPSHOTS ------------------- */

  gettingPartyItemSnapshot (partyId, item) {
    return this.database.ref(item).child(partyId).once('value');
  }

  checkingUserParty (user) {
    return this.database.ref('user_parties').child(user.uid).once('value');
  }

  getCurrentPartySnapshot (partyId) {
    return this.getParty(partyId).on('value', snapshot => {
      this.dispatchers.setCurrentParty(snapshot.val());
    });
  }

  checkAndUpdateDjName (partyId, user) {
    const { uid } = user

    // if no auth provider, do nothing
    if (!Object.keys(user.providerData).length) return;

    return this.database.ref('dj_names').child(user.uid).once('value')
      .then(snapshot => {
        const priorDjName = snapshot && snapshot.val()
        if(priorDjName) {
          this.database.ref('party_djs').child(partyId).child(uid).update({dj_name: priorDjName})
        }
      })
      .then(() =>{})
      .catch(console.error)
  }

  /* ------------------- SETTERS  ------------------- */

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
  }

  associatingPartyAndUser (partyId, user) {
    return this.database.ref('user_parties').child(user.uid).set(partyId)
  }

  settingCurrentSong (partyId, song) {
    return this.database.ref('current_song').child(partyId).set(song)
  }

  creatingParty (partyId, party) {
    return this.getParty(partyId).set(party)
  }

  removeUserParty (partyId, user) {
    return this.database.ref('user_parties').child(user.uid).remove()
  }

  removePartyDj (partyId, user) {
    return this.database.ref('party_djs').child(partyId).child(user.uid).remove()
  }

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
  }

  addToPartyQueue (partyId, type, song) {
    return this.database.ref(type).child(partyId).push(song)
  }

  updateDjName (partyId, user, newName) {
    const { uid } = user
    const updatingPartyDjs = this.database.ref('party_djs').child(partyId).child(uid).update({dj_name: newName})

    // if no auth provider, just update the temp dj name
    if (!Object.keys(user.providerData).length) return updatingPartyDjs

    const persistingDjName = this.database.ref('dj_names').update({[uid]: newName})
    return Promise.all([updatingPartyDjs, persistingDjName])
  }

   /* ------------------- REORDERING PERSONAL QUEUE ------------------- */

  addToPersonalQueue (partyId, user, song) {
   return this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').once('value')
      .then(snapshot => {
        let vote_priority = 0;
        const currentPq = snapshot.val();
        for (let track in currentPq) {
          vote_priority = Math.min(vote_priority, currentPq[track].vote_priority - 1);
        }
        song.vote_priority = vote_priority;
      })
      .then(() => {
        this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').push(song);
      })
      .catch(console.error)
  };

  moveUpPersonalQueue (partyId, user, song) {
    const { vote_priority } = song;
    return this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').once('value')
      .then(snapshot => {
        const currentPq = snapshot.val();
        let songToMoveUp,
            songToMoveUpKey,
            songToMoveDownKey,
            songToMoveDown = {vote_priority: 0};
        for (let track in currentPq) {
          if (currentPq[track].vote_priority === vote_priority) {
            songToMoveUp = currentPq[track];
            songToMoveUpKey = track;
          }
        }

        for (let track in currentPq) {
          if(currentPq[track].vote_priority > songToMoveUp.vote_priority && currentPq[track].vote_priority <= songToMoveDown.vote_priority) {
            songToMoveDown = currentPq[track];
            songToMoveDownKey = track;
          }
        }

        let temp = songToMoveUp.vote_priority;
        songToMoveUp.vote_priority = songToMoveDown.vote_priority;
        songToMoveDown.vote_priority = temp;

        const update = {
          [songToMoveUpKey]: songToMoveUp,
          [songToMoveDownKey]: songToMoveDown
        }
        // console.log("up", update[songToMoveUpKey].title, "down", update[songToMoveDownKey].title)
        return update
      })
      .then(update => {
        this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').update(update);
      })
  }

  moveDownPersonalQueue (partyId, user, song) {
    const { vote_priority } = song;
    return this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').once('value')
      .then(snapshot => {
        const currentPq = snapshot.val();
        let songToMoveDown,
            songToMoveDownKey,
            songToMoveUpKey,
            songToMoveUp = {vote_priority: -1000};
        for (let track in currentPq) {
          if (currentPq[track].vote_priority === vote_priority) {
            songToMoveDown = currentPq[track];
            songToMoveDownKey = track;
          }
        }

        for (let track in currentPq) {
          if(currentPq[track].vote_priority < songToMoveDown.vote_priority && currentPq[track].vote_priority > songToMoveUp.vote_priority) {
            songToMoveUp = currentPq[track];
            songToMoveUpKey = track;
          }
        }

        let temp = songToMoveUp.vote_priority;
        songToMoveUp.vote_priority = songToMoveDown.vote_priority;
        songToMoveDown.vote_priority = temp;

        const update = {
          [songToMoveUpKey]: songToMoveUp,
          [songToMoveDownKey]: songToMoveDown
        }
        // console.log("up", update[songToMoveUpKey].title, "down", update[songToMoveDownKey].title)
        return update
      })
      .then(update => {
        this.database.ref('party_djs').child(partyId).child(user.uid).child('personal_queue').update(update);
      })
  }

  /* ------------------- MACRO VOTING SETTERS ------------------- */

  // if songId is passed, we know that the ref is for top_ten; else, currSong
  onDownvote(partyId, song, songId) {
    const djsRef = this.database.ref('party_djs').child(partyId);
    this.dispatchers.decrementVotes();    // decement votes available to voter

    // 1. get snapshot of party Djs
    // 2. determine if need to decrement vote_priority or remove song
    // 3. always promise together with decrementing DJ points

    return djsRef.once('value')
      .then(snapshot => {
        const djs = snapshot && snapshot.val();
        if (!djs) return;

        const { uid, vote_priority, time_priority } = song;
        const netPriority = vote_priority + time_priority - 1;
        const numDjs = Object.keys(djs).length;

        // determine if song should be removed or just downvoted
        let removeOrDownvotePromise;
        const removeSong = this.meetsWorstSongThreshold(numDjs, netPriority, 2);

        // if need to remove, determine if it's a top_ten or current_song removal
        if (removeSong) {
          removeOrDownvotePromise = songId ?
            this.removeDownvotedSong(partyId, songId) :
            this.triggerNeedSong(partyId);
        } else {
          removeOrDownvotePromise = this.simpleVote(partyId, song, false, songId);
        }

        return Promise.all([
          removeOrDownvotePromise,
          this.updateDjPoints(uid, partyId, false)
        ]);
      })
      .catch(console.error);
  }

  // here, if songId is passed, we know it is for the top_ten; else, currSong
  onUpvote(partyId, song, songId) {
    this.dispatchers.decrementVotes();        // decrement votes available to voter;
    // 1. update song's vote priority
    // 2. increment dj_points of song's DJ

    const { uid } = song;

    return Promise.all([
      this.updateDjPoints(uid, partyId, true),
      this.simpleVote(partyId, song, true, songId)
    ])
    .then(() => {/*console.log('WE OUT HERE')*/})
    .catch(console.error);
  }


    /* ------------------- VOTING HELPER SETTERS ------------------- */


  // here, if addBool is passed, add a point, else, subtract a point
  updateDjPoints(uid, partyId, addBool) {
    const djRef = this.database.ref('party_djs').child(partyId).child(uid);
    return djRef.once('value')
      .then(snapshot => {
        const partyDj = snapshot && snapshot.val();
        if (!partyDj) return;

        // either increment or decement
        const newDjPoints = addBool ? partyDj.dj_points + 1 : partyDj.dj_points - 1;
        return djRef.update({ dj_points: newDjPoints });
      })
      .catch(console.error);
  }


  // if songId is passed, we know it is for top_ten because current_song has no songId
  // addBool is true, add one; else, subract one
  simpleVote(partyId, song, addBool, songId) {
    const newVotePriority = addBool ? song.vote_priority + 1 : song.vote_priority - 1;
    const songWithVote = Object.assign({}, song, {vote_priority: newVotePriority});

    const ref = songId ?
      this.database.ref('top_ten').child(partyId).child(songId) :
      this.database.ref('current_song').child(partyId);

    return ref.set(songWithVote);
  }


  triggerNeedSong (partyId) {
    return this.getParty(partyId).update({needSong: true});
  }

  removeDownvotedSong(partyId, songId) {
    return this.getParty(partyId).update({songToRemove: songId});
  }

  /* ------------------- HELPER FUNCTIONS ------------------- */

  promisify(value) {
    return new Promise(resolve => {
      return resolve(value);
    });
  }

  meetsWorstSongThreshold(numDjs, priority, magnitude) {
    return (magnitude * numDjs) <= (priority * -1);
  }

  getParty (partyId) {
    return this.database.ref('parties').child(partyId);
  }
}

export default Fireboss
