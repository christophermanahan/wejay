import React, { Component } from 'react';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import PlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import Audiotrack from 'material-ui/svg-icons/image/audiotrack';



/* -----------------    DUMB COMPONENTS     ------------------ */

const SingleSong = props => {
  const { title, permalink_url, username, addToQuery, sc_id } = props;
  return (
    <div>
			<ListItem
				primaryText={title}
				secondaryText={username}
				leftAvatar={<Avatar icon={<Audiotrack />}/>}
				rightIcon={<PlaylistAdd />}
				onTouchTap={ () => addToQuery(permalink_url, title, sc_id) }
			/>
    </div>
  );
};


const SearchResults = props => {
	const { searchResults, addToQuery } = props;
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
					addToQuery={addToQuery}
					title={song.title}
					key={song.id}
					sc_id={song.id}
					permalink_url={song.permalink_url}
					username={song.user.username}
        />
      ))}
      </List>
    </div>
  );
};

export default SearchResults;
