import React, {Component} from 'react';
import { connect } from 'react-redux';

import { TextField, RaisedButton } from 'material-ui';
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
j
  handleChange(evt) {
    evt.preventDefault();
    this.setState({value: evt.target.value})
  }


  render() {
    const { djs, user } = this.props;
    let djArr = []
    for (let dj in djs) { djArr.push(djs[dj]) }
    djArr.sort((a, b) => (b.dj_points - a.dj_points))
    const userRank = djArr.length && (djArr.indexOf(djs[user.uid]) + 1)
    return (
        <Row>
          <Col xs={12}>
            <Row>
              <Col xs={5}>
                <p>{djs[user.uid] && djs[user.uid].dj_name}</p>
                <p>DJ Rank: {userRank} of {djArr.length}</p>
              </Col>
              <Col xs={7}>
                <p>Change Name</p>
                  <form onSubmit={this.onSubmit}>
                    <TextField
                      id="text-field-default"
                      value={this.state.value || ''}
                      onChange={this.handleChange}
                    />
                    <RaisedButton
                      label="update"
                      type="submit"
                    />
                  </form>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <DjList user={user} djs={djArr}/>
              </Col>
            </Row>
          </Col>
        </Row>
    );
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase, user, djs, currentParty }) => ({ firebase, user, djs, currentParty });

export default connect(mapStateToProps)(DjsComponent);
