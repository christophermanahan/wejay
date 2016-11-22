const admin = require('firebase-admin');

const type = process.env.FIREBASE_ADMIN_TYPE;
const project_id = process.env.FIREBASE_ADMIN_PROJECT_ID;
const private_key_id = process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID;
const private_key = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const client_email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const client_id = process.env.FIREBASE_ADMIN_CLIENT_ID;
const auth_uri = process.env.FIREBASE_ADMIN_AUTH_URI;
const token_uri = process.env.FIREBASE_ADMIN_TOKEN_URI;
const auth_provider_x509_cert_url = process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL;
const client_x509_cert_url = process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL;

const serviceAccount = {
	type,
	project_id,
	private_key_id,
	private_key,
	client_email,
	client_id,
	auth_uri,
	token_uri,
	auth_provider_x509_cert_url,
	client_x509_cert_url
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://wejay-ac08c.firebaseio.com'
});

const db = admin.database();

/* -----------------    DB LISTENERS     ------------------ */


const needSongRef = db.ref('needSong');
const topTenRef = db.ref('top_ten')
const currentSongRef = db.ref('current_song')

needSongRef.set(false)

// NEED TO REFACTOR FOR NEW TOP 10s and "need new songs" associated with rooms
// -----
// needSongRef.on('value', snapshot => {
// 	if (snapshot.val()) {
// 		console.log('we need a song!')
// 		let topTen;
// 		grab a song off the top 10

// 		topTenRef.once('value', snapshot => {
// 			topTen = snapshot.val()
// 			let nextSong;
// 			let songNames = Object.keys(topTen)
// 			let randIndex = Math.floor(Math.random() * songNames.length)
// 			nextSong = topTen[songNames[randIndex]]

// 			currentSongRef.set({room1: nextSong})
// 			needSongRef.set(false)
// 		})
// 		set that song to the current


// 	}

// });

module.exports = admin;
