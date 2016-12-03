/*---------- FIREBASE ----------*/

export const fakeFirebase = {
  FacebookAuth: function () {},
  GoogleAuth: function () {},
  database: function () {},
  auth: function () {}
};

/*---------- PARTIES ----------*/
export const sampleParties = {
  "dillonsUserIdwhichisalsothepartyid" : {
    "active" : true,
    "id" : "dillonsUserIdwhichisalsothepartyid",
    "location" : "5 Hanover Sq",
    "name" : "Dillon's ppppparty",
    "needSong" : false
  },
  "RUOtMwp3qkWF7tZDjclrLOBT32s1" : {
    "active" : true,
    "id" : "RUOtMwp3qkWF7tZDjclrLOBT32s1",
    "location" : "weJay Demo Table",
    "name" : "OFFICIAL weJay Party!",
    "needSong" : false
  }
}

export const sampleParty = {
    active: true,
    id: "dillonsUserIdwhichisalsothepartyid",
    location: "5 Hanover Sq",
    name: "Dillon's ppppparty",
    needSong: false
}

export const sampleParty2 = {
    active: true,
    id: "dillonsUserIdwhichisalsothepartyid",
    location: "5 Hanover Sq",
    name: "Dillon's ppppparty",
    needSong: false
}

export const sampleNewParty = {
  "idForNewSampleParty" : {
    active: true,
    id : "idForNewSampleParty",
    location: "newly added spacetime",
    name: "New Party!",
    needSong: false
  }
}

/*---------- USER ----------*/

// sampleUser is also sampleDjGuest
export const sampleUser = {
	displayName: 'Tom Kelly',
	email: 'tom@kelly.com',
	uid: 'tomsUserId'
}; 


/*---------- DJS ----------*/
// these DJs are inside of the first of sampleParties
// titled: Dillon's ppppparty.
// the host is DJ Dirron


export const sampleDjHost = {
  "dj_name" : "DJ Dirron",
  "dj_points" : 10,
  "photo" : "https://cdn3.iconfinder.com/data/icons/devices-and-communication-2/100/turntable-512.png",
  "uid" : "dillonsUserIdwhichisalsothepartyid"
};
export const sampleDjHostId = "dillonsUserIdwhichisalsothepartyid"


export const sampleDjGuest = {
  "dj_name" : "DJ Tom",
  "dj_points" : 14,
  "photo" : "https://image.freepik.com/free-icon/dj-boy-playing-music_318-29813.png",
  "uid" : "tomsUserId"
};
export const sampleDjGuestId = "tomsUserId"


export const sampleDj = {
  "dj_name" : "DJ Shane",
  "dj_points" : 2,
  "photo" : "https://image.freepik.com/free-icon/musical-disc-and-dj-hand_318-43527.png",
  "uid" : "shanesUserId"
};

export const sampleDjId = "shanesUserId";


export const sampleDJsInSingleParty = {
  dillonsUserIdwhichisalsothepartyid: sampleDjHost,
  tomsUserId: sampleDjGuest,
  shanesUserId: sampleDj
}



/*---------- SONGS ----------*/

export const sampleSong = {
  artist: "dazzel-almond",
  dj_name: "DJ Dirron",
  song_uri: "https://soundcloud.com/dazzel-almond/dark-ally",
  time_priority: 0,
  title: "Dark Ally",
  uid: "dillonsUserIdwhichisalsothepartyid",
  vote_priority: 0
}

export const sampleSong2 = {
  artist: "dazzel-almond 2",
  dj_name: "DJ Tom",
  song_uri: "https://soundcloud.com/dazzel-almond/dark-ally",
  time_priority: 2,
  title: "Darker Ally",
  uid: "tomsUserId",
  vote_priority: 0
}

export const sampleSong3 = {
  "artist" : "FettyWap1738",
  "artwork_url" : "https://i1.sndcdn.com/artworks-B72n1OeTuXRb-0-large.jpg",
  "dj_name" : "DJ Shane",
  "song_uri" : "https://soundcloud.com/harlem_fetty/fetty-wap-trap-queen-rough",
  "time_priority" : 3,
  "title" : "Trap Queen",
  "uid" : "shanesUserId",
  "vote_priority" : 3
}

export const sampleSong4 = {
  "artist" : "Shane And Friends",
  "artwork_url" : "https://i1.sndcdn.com/artworks-000162860668-hccoaa-large.jpg",
  "dj_name" : "DJ Shane",
  "song_uri" : "https://soundcloud.com/shaneandfriends/episode-1-rebecca-black",
  "time_priority" : 0,
  "title" : "Shane And Friends - Ep. 1 (with Rebecca Black)",
  "uid" : "shanesUserId",
  "vote_priority" : 4
}

export const sampleSong5 = {
  "artist" : "more puppies",
  "artwork_url" : "whatever.com/jpg",
  "dj_name" : "DJ Tom",
  "song_uri" : "https://soundcloud.com/shaneandfriends/episode-1-rebecca-black",
  "time_priority" : 0,
  "title" : "other song tom has",
  "uid" : "tomsUserId",
  "vote_priority" : 0
}

export const sampleSong6 = {
  "artist" : "more puppies",
  "artwork_url" : "whatever.com/jpg",
  "dj_name" : "DJ Tom",
  "song_uri" : "https://soundcloud.com/shaneandfriends/episode-1-rebecca-black",
  "time_priority" : 0,
  "title" : "other song tom has",
  "uid" : "abc123",
  "vote_priority" : 0
}

export const sampleSongHighestPri = {
  "artist" : "PUPPIES",
  "artwork_url" : "whatever.com/jpg",
  "dj_name" : "DJ Tom",
  "song_uri" : "https://soundcloud.com/shaneandfriends/episode-1-rebecca-black",
  "time_priority" : 10,
  "title" : "BEST SONG OF ALL TIME",
  "uid" : "tomsUserId",
  "vote_priority" : 10
}


/*---------- QUEUES ----------*/

export const sampleCurrentSong = sampleSong;

export const sampleTopTen = {
  song1: sampleSong,
  song2: sampleSong2
};

export const sampleTopTenFull = {
  song1: sampleSongHighestPri,
  song2: sampleSong3,
  song3: sampleSong3,
  song4: sampleSong4,
  song5: sampleSong,
  song6: sampleSong2,
  song7: sampleSong3,
  song8: sampleSong4,
  song9: sampleSong,
  song10: sampleSong2,
};

export const sampleShadowQueue = {
  dillonsUserIdwhichisalsothepartyid: sampleSong,
  tomsUserId: sampleSong2,
  shanesUserId: sampleSong3 // HIGHEST PRIORITY
};

// will belong to DJ Tom
export const samplePersonalQueue = {
  "hashValInPQ1": sampleSong2,
  "hashValInPQ2": sampleSong5
};


/*---------- SEARCH RESULTS ----------*/

export const sampleSearchResult = {
	id: 107780701,
	permalink_url: "https://soundcloud.com/dazzel-almond/black-walk",
	uri: "https://api.soundcloud.com/tracks/107780701",
	permalink: "black-walk",
	description: "I liked the way this one turned out actually."
}

export const sampleSearchResults = [
	sampleSearchResult,
	sampleSearchResult,
	sampleSearchResult,
	sampleSearchResult
]


