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
// testing for heroku
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
console.log("#1");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://wejay-ac08c.firebaseio.com'
});
console.log("#2");
const db = admin.database();
console.log("#3");

/* -----------------    DB LISTENERS     ------------------ */

const partiesRef = db.ref('parties');
console.log("#4");

partiesRef.on('child_added', (snapshot) => {
	console.log("#5");

	const partyId = snapshot.val() && snapshot.val().id
	if(!partyId) { return; }

	const newPartyRef = db.ref('parties').child(partyId)
	newPartyRef.on('value', (snapshot) => {

		const needSong = snapshot.val() ? snapshot.val().needSong : false;
		if(!needSong){
			return
		} else {

			const currentSongRef = db.ref('current_song').child(partyId)
			const topTenRef = db.ref('top_ten').child(partyId)
			const shadowQueueRef = db.ref('shadow_queue').child(partyId)

			topTenRef.once('value')
			.then(snapshot => {

				const topTen = snapshot && snapshot.val();
				let nextSong;
				let nextSongPriority = -1000;		//needs to address --> collisions when priority scores are equal
				let nextSongId;

				if (!topTen) return;

				for (let song in topTen){

					let netPriority = topTen[song].time_priority + topTen[song].vote_priority

					if(netPriority > nextSongPriority){
						nextSong = topTen[song]
						nextSongPriority = netPriority;
						nextSongId = song
					}
				}

				currentSongRef.set(nextSong);
				newPartyRef.update({ needSong: false })
				return topTenRef.child(nextSongId).remove()
			})
			.then((err) => {
				if(err){
					throw new Error(err);
				} else {
					return shadowQueueRef.once('value')
				}
			})
			.then(snapshot => {
				const shadowQueue = snapshot && snapshot.val()
				if(!shadowQueue) return;

				let nextSong;
				let nextSongPriority = -1000;		//needs to address --> collisions when priority scores are equal
				let nextSongId;

				for (let song in shadowQueue){

					let netPriority = shadowQueue[song].time_priority + shadowQueue[song].vote_priority

					if(netPriority > nextSongPriority){
						nextSong = shadowQueue[song]
						nextSongPriority = netPriority;
						nextSongId = song
					}
				}
				nextSong = Object.assign(nextSong, {time_priority: 0, vote_priority: 0})
				const uidOfNewSQSong = nextSong.uid
				topTenRef.update({[nextSongId]: nextSong})
				shadowQueueRef.child(nextSongId).remove()
				return uidOfNewSQSong												//We need to fix this....
			})
			.then((uidOfNewSQSong) => {
				console.log('should not be undefined', uidOfNewSQSong)
				if (!uidOfNewSQSong) { return; }
				const pQRef = db.ref('party_djs').child(partyId).child(uidOfNewSQSong).child('personal_queue')
				pQRef.once('value')
				.then(snapshot => {
					const personalQueue = snapshot && snapshot.val()
					if (!personalQueue) return;
					const key = Object.keys(personalQueue)[0]
					const newSongOfPQ = personalQueue[key]
					shadowQueueRef.update( {[key]: newSongOfPQ} )
					return pQRef.child(key).remove();
				})
				.then(err => {
					if(err){
						throw new Error(err)
					}
				})
			})
			.catch(console.error)
		}
	})
})




module.exports = admin;
