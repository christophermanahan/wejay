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
    "needSong" : false,
    songToRemove: ''

  },
  "RUOtMwp3qkWF7tZDjclrLOBT32s1" : {
    "active" : true,
    "id" : "RUOtMwp3qkWF7tZDjclrLOBT32s1",
    "location" : "weJay Demo Table",
    "name" : "OFFICIAL weJay Party!",
    "needSong" : false,
    songToRemove: ''

  }
}

export const dillonsUserIdwhichisalsothepartyid = 'dillonsUserIdwhichisalsothepartyid'

export const sampleParty = {
    active: true,
    id: "dillonsUserIdwhichisalsothepartyid",
    location: "5 Hanover Sq",
    name: "Dillon's ppppparty",
    needSong: false,
    songToRemove: ''
}

export const sampleParty2 = {
    active: true,
    id: "dillonsUserIdwhichisalsothepartyid",
    location: "5 Hanover Sq",
    name: "Dillon's ppppparty",
    needSong: false,
    songToRemove: ''

}

export const sampleNewParty = {
  active: true,
  id : "idForNewSampleParty",
  location: "newly added spacetime",
  name: "New Party!",
  needSong: false,
  songToRemove: ''

}

export const idForNewSampleParty = "idForNewSampleParty";


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
export const sampleDjHostId = "dillonsUserIdwhichisalsothepartyid";


export const sampleDjGuest = {
  "dj_name" : "DJ Tom",
  "dj_points" : 14,
  "photo" : "https://image.freepik.com/free-icon/dj-boy-playing-music_318-29813.png",
  "uid" : "tomsUserId"
};
export const sampleDjGuestId = "tomsUserId";

export const sampleDj = {
  "dj_name" : "DJ Shane",
  "dj_points" : 2,
  "photo" : "https://image.freepik.com/free-icon/musical-disc-and-dj-hand_318-43527.png",
  "uid" : "shanesUserId"
};

export const sampleDjVoter = {
  "dj_name" : "DJ Chris",
  "dj_points" : 0,
  "photo" : "https://image.freepik.com/free-icon/musical-disc-and-dj-hand_318-43527.png",
  "uid" : "abc123"
};

export const sampleDjId = "shanesUserId";


export const sampleDJsInSingleParty = {
  dillonsUserIdwhichisalsothepartyid: sampleDjHost,
  tomsUserId: sampleDjGuest,
  shanesUserId: sampleDj
}


export const samplePartyDjs = {
  [sampleDjHostId]: sampleDjHost,
  [sampleDjGuestId]: sampleDjGuest,
  [sampleDjId]: sampleDj
};

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

export const sampleCurrentSong = Object.assign({}, sampleSong);

export const sampleTopTen = {
  song1: sampleSong,
  song2: sampleSong2
};


export const sampleTopTenFull = {
  song1: sampleSongHighestPri,
  song2: sampleSong2,
  song3: sampleSong3,
  song4: sampleSong4,
  song5: sampleSong,
  song6: sampleSong2,
  song7: sampleSong3,
  song8: sampleSong4,
  song9: sampleSong,
  song10: sampleSong2
};

export const sampleTopNine = {
  song2: sampleSong2,
  song3: sampleSong3,
  song4: sampleSong4,
  song5: sampleSong,
  song6: sampleSong2,
  song7: sampleSong3,
  song8: sampleSong4,
  song9: sampleSong,
  song10: sampleSong2
};

export const sampleShadowQueue = {
  song11: sampleSong,
  song12: sampleSongHighestPri,                 // HIGHEST PRIORITY
  song13: sampleSong3
};

export const sqSong2 = Object.assign({}, sampleSong, {uid: sampleUser.uid})

export const sampleSQBefore = {
  firstsong: sampleSongHighestPri,
  secondsong: sampleSong3,
};

export const sampleSQAfter = {
  firstsong: Object.assign({}, sampleSongHighestPri, {time_priority: 15}),
  secondsong: Object.assign({}, sampleSong3, {time_priority: 8})
};

export const sampleTTBefore = {
  num1: sampleSong5,
  num2: sampleSong2,
  num3: sampleSong3,
  num4: sampleSong4,
  num5: sampleSongHighestPri,
  num6: sampleSong5,
  num7: sampleSong2,
  num8: sampleSong3,
  num9: sampleSong4,
  num10: sampleSongHighestPri,
}

export const sampleTTAfter = {  // increment all by 5
  num1: Object.assign({}, sampleSong5, {time_priority: 5}),
  num2: Object.assign({}, sampleSong2, {time_priority: 7}),
  num3: Object.assign({}, sampleSong3, {time_priority: 8}),
  num4: Object.assign({}, sampleSong4, {time_priority: 5}),
  num5: Object.assign({}, sampleSongHighestPri, {time_priority: 15}),
  num6: Object.assign({}, sampleSong5, {time_priority: 5}),
  num7: Object.assign({}, sampleSong2, {time_priority: 7}),
  num8: Object.assign({}, sampleSong3, {time_priority: 8}),
  num9: Object.assign({}, sampleSong4, {time_priority: 5}),
  num10: Object.assign({}, sampleSongHighestPri, {time_priority: 15})
}

export const sampleTopTenBeforeWorst = {
  s1: Object.assign({}, sampleSong5),
  s2: Object.assign({}, sampleSong2),
  s3: Object.assign({}, sampleSong3),
  s4: Object.assign({}, sampleSong4),
  s5: Object.assign({}, sampleSong2),
  s6: Object.assign({}, sampleSong5),
  s7: Object.assign({}, sampleSong2),
  s8: Object.assign({}, sampleSong3),
  s9: Object.assign({}, sampleSong4),
  s10: Object.assign({}, sampleSong5)
};


export const sampleTopTenAfterWorst = {
  s2: Object.assign({}, sampleSong2),
  s3: Object.assign({}, sampleSong3),
  s4: Object.assign({}, sampleSong4),
  s5: Object.assign({}, sampleSong2),
  s6: Object.assign({}, sampleSong5),
  s7: Object.assign({}, sampleSong2),
  s8: Object.assign({}, sampleSong3),
  s9: Object.assign({}, sampleSong4),
  s10: Object.assign({}, sampleSong5),
  s12: Object.assign({}, sampleSongHighestPri)
}


export const sampleShadowQueueBeforeWorst = {
  s11: Object.assign({}, sampleSong2),
  s12: Object.assign({}, sampleSongHighestPri),    // HIGHEST PRIORITY
  s13: Object.assign({}, sampleSong3)
};

export const sampleShadowQueueAfterWorst = {
  s11: Object.assign({}, sampleSong2),
  s13: Object.assign({}, sampleSong3),
  tomsong1: Object.assign({}, sampleSong2)
}

// will belong to DJ Tom
export const samplePersonalQueueBeforeWorst = {
  tomsong1: Object.assign({}, sampleSong2), // HIGHER PRIORITY
  tomsong2: Object.assign({}, sampleSong5)
};

export const samplePersonalQueueAfterWorst = {
  tomsong2: Object.assign({}, sampleSong5)
};

export const sampleDownvoteTTBefore = {
  x1: Object.assign({}, sampleSong5, {vote_priority: -5}), // 0 time_priority
  x2: Object.assign({}, sampleSong2),
  x3: Object.assign({}, sampleSong3),
  x4: Object.assign({}, sampleSong4),
  x5: Object.assign({}, sampleSong2),
  x6: Object.assign({}, sampleSong5),
  x7: Object.assign({}, sampleSong2),
  x8: Object.assign({}, sampleSong3),
  x9: Object.assign({}, sampleSong4),
  x10: Object.assign({}, sampleSong5)
}


export const fbSampleShadowQueue = {
  song12: sqSong2,
  song13: sampleSong3
};

// will belong to DJ Tom
export const samplePersonalQueue = {
  "hashValInPQ1": sampleSong2,          //higher priority of the 2
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


const fbSampleDjGuest = {
  dj_name: "DJ Tom",
  dj_points: 14,
  photo: "https://image.freepik.com/free-icon/dj-boy-playing-music_318-29813.png",
  uid: "tomsUserId",
  personal_queue: samplePersonalQueue
};

export const fbSamplePartyDjs = {
  [sampleDjHostId]: sampleDjHost,
  [sampleDjGuestId]: fbSampleDjGuest,
  [sampleDjId]: sampleDj
};

export const whateverPartyDJs = {
  foo: { uid: 'foo', dj_points: -2 },
  bar: { uid: 'bar', dj_points: 0 },
  baz: { uid: 'baz', dj_points: 10 },
  buzz: { uid: 'buzz', dj_points: 2 }
};

export const randoHostId = 'foo';

export const randoParty = {
  "active" : true,
  "id" : "foo",
  "location" : "Harlem",
  "name" : "R Kelly only plz",
  "needSong" : false,
  songToRemove: ''
};

export const terribleSong = Object.assign({}, sampleSong5, {uid: 'foo', vote_priority: -7})

export const randoTopTen = {
  y1: terribleSong,
  y2: Object.assign({}, sampleSong2, {uid: 'foo' })
};


