import React, {Component} from 'react';
import { connect } from 'react-redux';

import { TextField } from 'material-ui';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import DjList from './DjsList'

/* -----------------    DUMB COMPONENT     ------------------ */

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

class DjsComponent extends Component {
  constructor(props) {
    super(props);
    const { djs, user } = this.props;
    let djName = djs[user.uid] && djs[user.uid].dj_name;

    this.state = { value: djName }
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { djs, user } = nextProps;
    let djName = djs[user.uid] && djs[user.uid].dj_name;
    this.setState({value: djName});
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { firebase, currentParty, user } = this.props
    firebase.database().ref('party_djs').child(currentParty.id).child(user.uid)
    .update({dj_name: this.state.value})
  }

  handleChange(evt) {
    evt.preventDefault();
    this.setState({value: evt.target.value})
  }


  render() {
    const { djs, user } = this.props;
    const djPoints = djs[user.uid] && djs[user.uid].dj_points;
    let djName = djs[user.uid] && djs[user.uid].dj_name;
    const otherDjs = Object.assign({}, djs)
    delete otherDjs[user.uid];

    return (
        <Row>
          <Col xs={12}>
            <Row>
              <Col xs={6}>
                <h1>Your DJ Data</h1>
              </Col>
              <Col xs={6}>
                <h1>{user.displayName}</h1>
              </Col>
            </Row>
            <form onSubmit={this.onSubmit}>
              <label> DJ NAME --- </label>
              <input value={this.state.value || ''} onChange={this.handleChange}></input>
              <button type="submit">update my dj name</button>
            </form>
            <br />
            <p>Points: {djPoints}</p>
            <hr/>
            <h1> Party DJs</h1>
            <DjList djs={otherDjs}/>
          </Col>
        </Row>
    );
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase, user, djs, currentParty }) => ({ firebase, user, djs, currentParty });

export default connect(mapStateToProps)(DjsComponent);

