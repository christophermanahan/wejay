var FirebaseServer = require('firebase-server');

new FirebaseServer(5000, 'ws://127.0.1:5000', {
    currentSong: {},
    topTen: {},
    shadowQueue: {},
    parties: {},
    user_parties: {},
    party_djs: {}
});
