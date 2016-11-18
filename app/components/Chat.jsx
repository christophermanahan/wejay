import React, {Component} from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import { clearUser, setUser } from '../ducks/user';

/* -----------------    COMPONENT     ------------------ */

class Chat extends Component {
  constructor(props) {
    super(props);

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
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

  render() {
    const { user } = this.props
    return (
      <div>
        <h1>chat will be here</h1>
        <div>
          <div>
            <p>placeholder for messages</p>
          </div>
          <form>
            <input type="text" />
            <button type="submit">send message</button>
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

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase, user }) => ({ firebase, user });
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(clearUser()),
  login: user => dispatch(setUser(user)) 
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
