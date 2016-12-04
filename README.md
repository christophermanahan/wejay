# WE. ARE. WEJAY.

Remember that time you went to a party and some rando hijacked the playlist to spin some track no one else wanted to hear? Or that time you invited friends over but were too busy to manage the music? With weJay, the whole party decides which hot track plays next.

A host starts a party, and anyone who launches the app can join as a guest. Each guest is a DJ who can suggest songs, vote on others' suggestions, and accrue 'DJ points' depending on how many people up-vote their songs. The next song played is determined by its votes and the time passed since first suggested.

weJay uses Firebase to namespace different parties and provide real-time updates to each client. When a client suggests a song, it receives a snapshot of the relevant Firebase data and pushes the song to its proper place in the Firebase queue. Concurrently, Node listens to for when a song finishes playing, at which point it receives a snapshot of the Firebase party state and computes the next song accordingly. Songs are streamed from SoundCloud to the host client device only, but all guests can view the info of the song currently being played.


DEFINITIONS:

Current Song - the song currently playing in the party.

Top Ten - the ten songs that are able to be voted on by all users. The #1 song will
          be played next

Shadow Queue - the songs that are next in line to enter the top ten. Cannot be removed.

Personal Queue - the songs that a user has suggested, but are not locked in.
                 can be reordered and removed in 'My Songs'


--------------------------- SERVER SIDE LOGIC (FIRECHIEF) ---------------------------------

LISTEN FOR PARTIES BEING ADDED AND PARTIES BEING REMOVED

I. On 'child_added' for parties, Firechief runs 'createNewPartyListener' & runs
  'createNewTimePriorityIncrementer' for the top ten and for the shadow queue.


   1) Each new party listener listens to ‘needSong’ and ‘songToRemove’ on the party instance.

      A) If 'needSong = true', run 'masterReorder' which:
          i) FIRST: runs 'setCurrentSong' which:
              a) Checks if the top ten exists. If not, 'return' / if so:
              b) Find the song with the highest net priority.
              c) THEN: set that song to current song, remove it from the top ten, and set
                 needSong to false.

          ii) THEN: If 'setCurrentSong' was successful, run 'pullFromShadowQueue' which:
              a) Checks if the shadow queue exists. If not, 'return' / if so:
              b) Find the song with the highest net priority.
              c) THEN: Add that song to the top ten, remove it from the shadow queue, and pass
                 the song submitter's uid to the next stage.

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



II. On 'child_removed' for parties, Firechief uses the partyId to run 'removePartyListener' and
    'removeTimePriorityIncrementer' for the party's shadow queue and its top ten.

    1) 'removePartyListener' calls '.off()' the firebase database listener for the partyId

    2) 'removeTimePriorityIncrementer' calls 'clearInterval' on the queue and sets
       Firechief[incrementers][partyId][queue] to 'null'
