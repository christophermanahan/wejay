import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbSignup = props => {
	const { submitForm, onType, validateMsg, reset } = props;
	const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={ reset }
      />];
	return (
		<div id="signup-form">
			<form onSubmit={ submitForm }>
		    <TextField
		      hintText="avicii@example.dj"
		      name="email"
		      type="email"
		      floatingLabelText="Email"
		      className="signup-field"
		      style={{display: "block"}}
		      onChange={ onType }
		    />
		    <TextField
		      floatingLabelText="Password"
		      name="password"
		      type="password"
					className="signup-field"
					style={{display: "block"}}
		      onChange={ onType }
		    />
		    <TextField
		      hintText="DJ ..."
		      name="djName"
		      floatingLabelText="DJ Name"
		      className="signup-field"
		      style={{display: "block"}}
		      onChange={ onType }
		    />
		    <RaisedButton
					label="Submit"
					style={{display: "block"}}
					className="login-btn"
					type="submit"
					onTouchTap={ submitForm }
		    />
				<Dialog
					title="Whoops!"
					modal={true}
					actions={actions}
					open={!!validateMsg}
				>{ validateMsg }
				</Dialog>
	    </form>
		</div>
	);
};


/* -----------------    STATEFUL REACT COMPONENT     ------------------ */


class Signup extends Component {
	constructor(props) {
		super(props);
		this.submitForm = this.submitForm.bind(this);
		this.onType = this.onType.bind(this);
		this.reset = this.reset.bind(this);
		this.state = {
			email: '',
			password: '',
			djName: '',
			emailValidate: '',
			passwordValidate: '',
			djNameValidate: ''
		};
	}

	submitForm(evt) {
		evt.preventDefault();
		let valid = true;
		const { firebase, renderError } = this.props;
		const { email, password, djName } = this.state;

		const emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		const passwordRE = /.{6,}/;
		const djRE = /DJ .*/;

		if (!emailRE.test(email)) {
			valid = false;
			this.setState({emailValidate:'Please enter a valid email. '});
		}
		if (!passwordRE.test(password)) {
			valid = false;
			this.setState({passwordValidate: 'Please enter a password of at least 6 characters. '});
		}
		if (!djRE.test(djName)) {
			valid = false;
			this.setState({djNameValidate: 'Please enter a DJ name, like \'DJ Surf \'n Turf\'. '});
		}

		// here, we create a new user.
		// TODO: not currently doing anything with the DJ name
		if (valid) {
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.catch(renderError);
		}
	}

	onType(evt) {
		const newState = evt.target.value;
		const key = evt.target.name;
		this.setState({[key]: newState});
	}

	reset() {
		this.setState({emailValidate: '', passwordValidate: '', djNameValidate: ''});
	}

	render() {
		return (
			<DumbSignup
				submitForm={ this.submitForm }
				onType={ this.onType }
				validateMsg={ this.state.emailValidate + this.state.passwordValidate + this.state.djNameValidate }
				reset={ this.reset }
			/>
		);
	}
}

export default Signup;
