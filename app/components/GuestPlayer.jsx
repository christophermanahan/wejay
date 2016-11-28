import React, {Component} from 'react';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import { Row, Col } from 'react-flexbox-grid/lib/index';


import LinearProgress from 'material-ui/LinearProgress';


/* -----------------    DUMB COMPONENT     ------------------ */

class GuestPlayer extends React.Component {
    constructor(props) {
        super(props);
        // this.triggerFirebase = this.triggerFirebase.bind(this);
        // this.mapDurationSecsToMins = this.mapDurationSecsToMins.bind(this)

        // POSSIBLE TO TRIGGER ON PLAY/PAUSE?????
        // const { soundCloudAudio } = this.props;
        // soundCloudAudio.audio.addEventListener('ended', () => {
        //     console.log('SONG ENDED!!!');
        //     this.triggerFirebase();
        // });
    }



    render() {
        console.log('props in GUEST player', this.props)
        let { currentSong } = this.props
        console.log("CURRENT SONG: ", currentSong);
        // let { track, playing, currentTime, } = this.props;
        //
        // duration = Math.floor(duration)
        // currentTime = Math.floor(currentTime)
        // // console.log("BEFORE: ", duration);
        // duration = this.mapDurationSecsToMins(duration)
        // // console.log("After: ", duration);


        // if (!track) {
        //     return <div><i className="zmdi zmdi-soundcloud zmdi-hc-5x"></i></div>;
        // }

        let progBarStyle = {
          backgroundColor: "#EC4616",
          height: ".3em"
        }
        let songInfoColStyle = {
          fontFamily: "Roboto",
          fontSize: "0.5em"
        }

        let titleStyle = {
          fontFamily: "Carme",
          marginTop: "0.8em",
          marginBottom: "0.2em"
        }
        let artistStyle = {
          fontFamily: "Carme",
          marginTop: "0.3em",
          marginBottom: "0.1em"
        }
        let playerIconStyle = {
          marginTop: "0.4em"
        }
        let hearingIconStyle = {
          marginTop: "0.2em",
          fontSize: "2.3em"
        }



        return (
            <div>
                <LinearProgress
                  mode="determinate"
                  style={progBarStyle}
                  />
                <Row>
                <Col style={playerIconStyle} xsOffset={1} xs={2}>
                  {(currentSong && !currentSong.artwork_url) ? <i className="zmdi zmdi-playlist-audio zmdi-hc-3x mdc-text-grey"></i> : <img id="playerImgStyle" src={currentSong.artwork_url} /> }
                </Col>
                <Col xs={6} style={songInfoColStyle}>

                  <h2 style={titleStyle}>{currentSong.title}</h2>
                  <h3 style={artistStyle}>by: {currentSong.artist }</h3>
                  <h4 style={artistStyle}>Chosen by: { currentSong.dj_name } </h4>

                </Col>

                <Col xs={2} style={playerIconStyle}>

                  <Row between="xs">
                    <Col xs={2}>
                      <FontIcon style={hearingIconStyle} className="zmdi zmdi-hearing animated infinite wobble zmdi-hc-fw" />
                    </Col>

                  </Row>
                </Col>
              </Row>
            </div>
        );
    }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentSong }) => ({ currentSong });

export default connect(mapStateToProps)(GuestPlayer);
