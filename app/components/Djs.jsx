import React, {Component} from 'react';
import { connect } from 'react-redux';

import Create from 'material-ui/svg-icons/content/create';

import { TextField, RaisedButton, IconButton, FontIcon } from 'material-ui';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import DjList from './DjsList'

/* -----------------    STYLES     ------------------ */
const TextFieldStyle = {width: '60%'}
const RaisedButtonStyle = {width: '20%', marginLeft: '20px'}

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

export class DjsComponent extends Component {
  constructor(props) {
    super(props);
    const { djs, user } = this.props;
    let djName = djs[user.uid] && djs[user.uid].dj_name;

    this.state = { value: djName, showEditor: false }
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleEditor = this.toggleEditor.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { djs, user } = nextProps;
    let djName = djs[user.uid] && djs[user.uid].dj_name;
    this.setState({value: djName});
  }

  toggleEditor(evt) {
    evt.preventDefault();
    this.setState({showEditor: !this.state.showEditor})
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { fireboss, currentParty, user } = this.props
    this.setState({showEditor: false})
    fireboss.updateDjName(currentParty.id, user, this.state.value)
  }

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
        <Row className="dj-container dj-list-container">
          <Col xs={12}>
            <Row>
              <Col xs={1}>
                <p style={{marginLeft: '10px'}}>
                  <IconButton iconStyle={{padding: 0, height: 15, width: 15}} style={{padding: 0, height: 15, width: 15}} onTouchTap={this.toggleEditor}>
                    <Create />
                  </IconButton>
                </p>
              </Col>
              <Col xs={6}>
                <p>{djs[user.uid] && djs[user.uid].dj_name}</p>
              </Col>
              <Col xs={5}>
                <p>DJ Rank: {userRank} of {djArr.length}</p>
              </Col>
            </Row>
            {this.state.showEditor ?
              <Row className="dj-you">
                <Col xsOffset={1} xs={10}>
                    <form onSubmit={this.onSubmit}>
                      <TextField
                        style={TextFieldStyle}
                        id="text-field-default"
                        value={this.state.value || ''}
                        onChange={this.handleChange}
                      />
                      <RaisedButton
                        style={RaisedButtonStyle}
                        label="update"
                        type="submit"
                      />
                    </form>
                </Col>
              </Row>
              :
              <Row className="dj-you"></Row>
            }

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

const mapStateToProps = ({ fireboss, user, djs, currentParty }) => ({ fireboss, user, djs, currentParty });

export default connect(mapStateToProps)(DjsComponent);
