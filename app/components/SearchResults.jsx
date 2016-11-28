import React, { Component } from 'react';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import PlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import Audiotrack from 'material-ui/svg-icons/image/audiotrack';



/* -----------------    DUMB COMPONENTS     ------------------ */

const SingleSong = props => {
  const { title, permalink_url, artist, addToQueue, artwork_url } = props;
  return (
    <div>
			<ListItem
				primaryText={title}
				secondaryText={artist}
				leftAvatar={<Avatar icon={<Audiotrack />}/>}
				rightIcon={<PlaylistAdd />}
				onTouchTap={ () => addToQueue(permalink_url, title, artist, artwork_url) }
			/>
    </div>
  );
};


const SearchResults = props => {
	const { searchResults, addToQueue } = props;
  return (
    <div>
			<List>
			{ searchResults && searchResults.length ?
				<Subheader>Results</Subheader>
				:
				''
			}
      { searchResults && searchResults.map(song => (

        <SingleSong
					addToQueue={addToQueue}
					title={song.title}
					key={song.id}
					artwork_url={song.artwork_url}
					permalink_url={song.permalink_url}
					artist={song.user.username}
        />
      ))}
      </List>
    </div>
  );
};

export default SearchResults;
