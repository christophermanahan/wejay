import React, {Component} from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import { clearUser, setUser } from '../ducks/user';

import MessageList from './MessageList'

/* -----------------    COMPONENT     ------------------ */

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txt: ''
    }

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.sendSwag = this.sendSwag.bind(this);
  }

  signIn(e) {
    e.preventDefault();
    const { firebase, login } = this.props;
    const myAuth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    myAuth.signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        login(user);
      })
      .catch(err => console.error(err))
  }

  signOut(e) {
    e.preventDefault();
    const { firebase, logout } = this.props;
    firebase.auth().signOut()
      .then(() => {
        logout()
      })
      .catch(err => console.error(err))
  }

  sendSwag(e) {
    e.preventDefault();
    let timeStamp = Date.now() + '';
    const { messages, user, firebase } = this.props;
    const userName = user.displayName || 'anon';
    const messageText = this.state.txt;
    
    this.setState({txt: ''})
    messages[timeStamp] = {name: userName, text: messageText};
    firebase.database().ref('messages').set(messages);

  }

  render() {
    const { user, messages } = this.props

    return (
      <div>
        <h1>chat will be here</h1>
        <div>
          <div>
            
              <MessageList messages={messages} />
     
          </div>
         
              <form>
                <input type="text" name="chattext" value={this.state.txt} onChange={(e) => { this.setState({txt: e.target.value}) }}/>
                <button type="submit" onClick={this.sendSwag}>Send Swag</button>
              </form>

          {
            user && user.displayName ?
            <span>Welcome, {user.displayName}
              <button onClick={this.signOut}>sign out</button>
            </span>
            :
            <span><button onClick={this.signIn}>sign in</button></span>
          }
        </div>
      </div>
    )
  }
}


// <input type="text" />
/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase, user, messages }) => ({ firebase, user, messages });
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(clearUser()),
  login: user => dispatch(setUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
