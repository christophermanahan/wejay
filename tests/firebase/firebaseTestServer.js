var FirebaseServer = require('firebase-server');

new FirebaseServer(5000, 'ws://127.0.1:5000', {
    states: {
        CA: 'California',
        AL: 'Alabama',
        KY: 'Kentucky'
    }
});
