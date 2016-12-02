const admin = require('firebase-admin');
const Firechief = require('./firechief');


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
const databaseURL = process.env.FIREBASE_DATABASE_URL;
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

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL
});
const db = admin.database();

// create new Firechief instance
const firechief = new Firechief(db);


// listen for when parties are added
firechief.createPartyAddedListener();

// listen for when parties are removed
firechief.createPartyRemovedListener();

module.exports = admin;
