# WE. ARE. WEJAY.

Remember that time you went to a party and some rando hijacked the playlist to spin some track no one else wanted to hear? Or that time you invited friends over but were too busy to manage the music? With weJay, the whole party decides which hot track plays next.

A host starts a party, and anyone who launches the app can join as a guest. Each guest is a DJ who can suggest songs, vote on others' suggestions, and accrue 'DJ points' depending on how many people up-vote their songs. The next song played is determined by its votes and the time passed since first suggested.

weJay uses Firebase to namespace different parties and provide real-time updates to each client. When a client suggests a song, it receives a snapshot of the relevant Firebase data and pushes the song to its proper place in the Firebase queue. Concurrently, Node listens to for when a song finishes playing, at which point it receives a snapshot of the Firebase party state and computes the next song accordingly. Songs are streamed from SoundCloud to the host client device only, but all guests can view the info of the song currently being played.
