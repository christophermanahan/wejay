import React, {Component} from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import { clearUser, setUser } from '../ducks/user';

import QuoteList from './chat-quote'

/* -----------------    COMPONENT     ------------------ */

class Chat extends Component {
  constructor(props) {
    super(props);

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
    let randomStr = Math.random() + ""
    let messages = this.props.messages
    messages[randomStr.slice(3, 12)] = {name: this.props.user.displayName, text:'swag'}

    this.props.firebase.database().ref('messages').set(messages)
  }

  render() {
    const { user, messages } = this.props

    return (
      <div>
        <h1>chat will be here</h1>
        <div>
          <div>
            {user && user.displayName ?
              <QuoteList messages={messages} />
              :
              <p>Log in to see messages</p>
            }
          </div>
          {user && user.displayName ?
              <form>
                <button type="submit" onClick={this.sendSwag}>send swag</button>
              </form>
              :
              <p>Log in to send swag</p>
            }

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
