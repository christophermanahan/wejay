# WE. ARE. WEJAY.

Remember that time you went to a party and some rando hijacked the playlist to spin some track no one else wanted to hear? Or that time you invited friends over but were too busy to manage the music? With weJay, the whole party decides which hot track plays next.

A host starts a party, and anyone who launches the app can join as a guest. Each guest is a DJ who can suggest songs, vote on others' suggestions, and accrue 'DJ points' depending on how many people up-vote their songs. The next song played is determined by its votes and the time passed since first suggested.

weJay uses Firebase to namespace different parties and provide real-time updates to each client. When a client suggests a song, it receives a snapshot of the relevant Firebase data and pushes the song to its proper place in the Firebase queue. Concurrently, Node listens to for when a song finishes playing, at which point it receives a snapshot of the Firebase party state and computes the next song accordingly. Songs are streamed from SoundCloud to the host client device only, but all guests can view the info of the song currently being played.

---
## DEFINITIONS:

**Current Song** - the song currently playing in the party.

**Top Ten** - the ten songs that are able to be voted on by all users. The #1 song will be played next. Priority is determined by time and vote count.

**Shadow Queue** - the songs that are next in line to enter the top ten. Songs cannot be removed by users once they reach this stage. Priority is determined by time and the amount of DJ Points the suggester had at the time of submission.

**Personal Queue** - the songs that a user has suggested, but are not yet locked in. Users can see their personal queue in the 'My Songs' tab, and songs can be reordered and removed.

**Fireboss** - manages application state on the client side. When a user adds a song, Fireboss decides what queue it goes into. When a user joins a party, Fireboss binds the application state to that party. When a host leaves, Firebosss kicks everyone out. In the WeJay application, Fireboss is truly the boss.

To do this, Fireboss connects the Redux store to our Firebase Realtime Database and listens for changes. Any changes are immediately dispatched to the client's Redux store, and all client actions are sent to Firebase directly (using methods on Fireboss). Fireboss can also use React-Router's browser history to update the client's view in realtime.

**Firechief** - controls Firebase logic on the server side. Listens to requests from parties and manages song flow through our queue system. Any time a party needs a new song, Firechief decides what song plays next. Any time a lame song is voted off the top ten, Firechief picks its replacement.

---
# FIREBOSS CLIENT SIDE LOGIC

## ON MAIN ENTER

**I. Create new Fireboss instance, and dispatch it to the Redux store.**

**II. Use Fireboss to create a listener for the ```parties``` ref on Firebase.**

  1. The ```createPartiesListener``` will always be active. It listens to the global parties list and 
     keeps the 'parties' state up to date with the latest party data.

**III. Use Fireboss to create an ```onAuthStateChanged``` listener.**

  The ```onAuthStateChanged``` listener checks if a user has been authenticated on Firebase.

  1. If the user is not autheticated, Fireboss dispatches ```clearUser``` (which clears the user from
     the Redux store). Fireboss then pushes the client to '/login'.

  2. If the user is authenticated, Fireboss dispatches ```setUser``` with the user's data. Fireboss 
     then checks if the user is currently associated with a party.
      * If the user is not associated with any parties, the user to pushed to '/parties' where they 
        can create or join a party

      * If the user is currently associated with a party, Fireboss then sets up listeners using the 
        partyId and user data (see below for detail). The user is then pushed to '/app' and the Top Ten 
        tab is immediately visible.

---
## SET UP ALL PARTY LISTENERS

**```setUpAllPartyListeners``` runs when a user enters a party. Users can enter a party from the '/parties' page by clicking CREATE PARTY or JOIN PARTY. The seven listeners are descibed below:**

* **Current Party Listener** - manages ```currentParty``` on the Redux store. Current party contains the partyId, so the user can send updates to the appropriate ref in Firebase.


* **Current Song Listener** - manages ```currentSong``` on the Redux store. Contains all relevant data about the current song, including the ```song_uri``` for the SoundCloud player.


* **Top Ten Listener** - manages ```topTen``` on the Redux store. Changes to the order of the top ten are dispatched from here.


* **Party DJs Listener** - manages ```djs``` on the Redux store. Lets the user know what DJs are in a party and how many DJ Points they have.


* **End Party Listener** - When the host ends a party, alerts the user, turns off all party specific listeners (including itself), and pushes the user to the '/parties' page.


* **Personal Queue Listener** - manages ```personalQueue``` on the Redux store. Listens to updates from the users personal queue.


* **Shadow Queue Listener** - manages ```shadowQueue``` on the Redux store. Listens to the Shadow Queue for the party.

---
## ADDING A SONG

**I.```submitUserSong``` runs when user selects a song they want to hear. Users can add songs from the ADD SONG page.**

  **```submitUserSong``` gets a snapshot of the party's current song, top ten, and shadow queue. THEN:

  1. Check ```current_song``` snapshot.
    * If no ```current_song```, set ```current_song``` to submitted song and return.
    * If ```current_song```, advance to 2.
 
  2. Check ```top_ten``` snapshot.
    * If no ```top_ten``` or if less than 10 songs in ```top_ten```, push submitted song to ```top_ten```.
    * If ```top_ten``` has 10 songs, advance to 3.

  3. Check ```shadow_queue``` snapshot.
    *  If user does not have song ```shadow_queue```, push submitted song and return.
    *  If user already has song in ```shadow_queue```, advance to 4.

  4.  Push submitted song to ```personal_queue```.

---
## VOTING

**I. Voting Rules**

  1. Users can vote for the current song or songs in the top ten. Voting increases or decreases a song's 
     ```vote_priority``` and increments or decrements the DJ points of whomever suggested it.

  2. A user starts with 5 votes, which are are replenished each time the current song changes. The vote count is stored 
     in local storage(not in Firebase) for simplicity. Users cannot vote for their own songs, or when they have 0 votes left.

  3. If a song's net priority, ie ```vote_priority + time_priority``` meets the worst song threshold, it is removed.

**II. 'onUpvote'**

  1. Decrement the user's vote count.

  2. Calls ```updateDjPoints``` with the song's uid, the party's id, and the third parameter ```addBool```
       as true. This finds the DJ who suggested the song and adds one to his/her DJ points.

  3. Calls ```simpleVote``` with the party's id, the song, true ie ```addBool```, and ```songId```.
      *  If songId is null, add a vote to the current song.
      *  If songId is given, add a vote to the appropriate song on the top ten.

**III. 'onDownvote'**

  1. Decrement the user's vote count.

  2. Calculate net priority of the song the user is downvoting and get a snapshot of 
     ```current_djs```. Check if this downvote pushes the song beyond the worst song threshold.
     * NOTE: The worst song threshold changes dynamically based on the number of djs in the party.

  3. If ```meetsWorstSongThreshold``` returns 'true':
      * Check if song has songId.
      * If song has songId that means it is a top ten song. Fireboss then calls ```removeDownvotedSong```
         which sets the party's ```songToRemove``` property on Firebase to the songId. Firechief hears this
         and updates the top ten.
      * If song does not have songId, calls ```triggerFirebase``` which skips to the next song in the Top Ten.

  4. If ```meetsWorstSongThreshold``` returns 'false':
      * Call ```simpleVote``` with the party's id, the song, false ie ```addBool```, and ```songId```.
          + If songId is null, remove a vote to the current song.
          + If songId is given, remove a vote to the appropriate song on the top ten.

## LEAVE PARTY / LOG OUT

**I. Leave Party**

  1. Check if user id is equal to the party id (if true, the user is the host).

  2. If user is host, call ```endParty``` with the partyId.
      * ```endParty``` removes the party from the DB. This triggers the ```endParty``` 
         listeners for all the guests, who have their listeners removed and get kicked out. THEN:
      * The host removes the ```current_song```, ```top_ten```, ```party_djs```, and ```shadow_queue``` from the db.
      * The host gets pushed to '/parties'.

    3) If user is a guest, call ```removeUserParty``` which dis-associates the user's id from the the party id.
        A) THEN: the user is removed from ```party_djs```.
        B) THEN: party listeners are removed, ```leaveParty``` is dispatched which clears the Redux store, and the
           user is pushed '/parties'.

**II. Log out (similar to leave party)**
  1. Check if user id is equal to the party id (if true, the user is the host).

  2. If user is host, call ```endParty``` with the partyId and ```Fireboss.auth.signout()```.
      * After both complete, the host gets pushed to '/login'.

  3. If user is a guest, call ```removeUserParty```, 'removePartyDj' and ```Fireboss.auth.signout()```.
      * After all three complete, the guest gets pushed to '/login'.


# FIRECHIEF SERVER SIDE LOGIC

## LISTEN FOR PARTIES BEING ADDED AND PARTIES BEING REMOVED

**I. On 'child_added' for parties, Firechief runs 'createNewPartyListener' & runs
  'createNewTimePriorityIncrementer' for the top ten and for the shadow queue.**

    1) Each new party listener listens to ‘needSong’ and ‘songToRemove’ on the party instance.

      A) If 'needSong = true', run 'masterReorder' which:
          i) FIRST: runs 'setCurrentSong' which:
            a) Checks if the top ten exists. If not, 'return' / if so:
            b) Find the song with the highest net priority.
            c) THEN: set that song to current song, remove it from the top ten,
               and set needSong to false.

          ii) THEN: If 'setCurrentSong' was successful, run 'pullFromShadowQueue' which:
              a) Checks if the shadow queue exists. If not, 'return' / if so:
              b) Find the song with the highest net priority.
              c) THEN: Add that song to the top ten, remove it from the shadow queue, and
                 pass the song submitter's uid to the next stage.

          iii) THEN: If 'pullFromShadowQueue' was successful, run 'pullFromPersonalQueue' which:
              a) Checks if a personal queue for the given uid exists. If not, 'return' / if so:
              b) Find the song with the highest net priority.
              c) THEN: add that song to the shadow queue and remove it from the personal queue.

        B) If 'songToRemove = aTruthyValue', run 'removeWorstSong' which:
          i)   FIRST: sets 'songToRemove' to an empty string (a falsy value).
          ii)  THEN: runs 'pullFromShadowQueue' as described above. If successful:
          iii) THEN: runs 'pullFromPersonalQueue' as described above.


    2) If 'createPartyAddedLister' is invoked with a 'topTenInterval' and a 'sqInterval':

      A) Run 'createTimePriorityIncrementer' for each queue.
        i) See if an incrementers object exists for the party. If object exists, set it equal
           to itself, if object does not exist create it.

        ii) Set Firechief[incrementers][partyId][queue] equal to a 'setInterval' invoked with
            incrementerHelper, the given interval, the partyId, and the chosen queue.

        iii) The incrementerHelper function takes the partyId and chosenQueue, and every
             time it is invoked, it snapshots the entire queue, increments the 'time_priority'
             of every song by one, and THEN replaces the old queue with the updated queue.


**II. On 'child_removed' for parties, Firechief uses the partyId to run 'removePartyListener' and 'removeTimePriorityIncrementer' for the party's shadow queue and its top ten.**

    1) 'removePartyListener' calls '.off()' the firebase database listener for the partyId

    2) 'removeTimePriorityIncrementer' calls 'clearInterval' on the queue and sets 
       Firechief[incrementers][partyId][queue] to 'null'
