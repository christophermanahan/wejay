import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';

/* -----------------    DUMB COMPONENTS     ------------------ */

const SingleDj = props => {
  const { user, dj } = props;
  return (
    <Col xs={12}>
      <Row style={{border:"1px solid black"}}>
        <Col xs={3}>
        <img height="150" width="150" src="https://thumbnailer.mixcloud.com/unsafe/318x318/extaudio/0/9/b/f/ce50-0b29-40a3-a31b-95b1b9b38c5c" />
        </Col>
        <Col xs={9}>
        <p>Name: {dj.dj_name}</p>
        <p>Points: {dj.dj_points}</p>
        {dj.uid === user.uid ? <p>This is you!</p> : <div></div>}
        </Col>
      </Row>
    </Col>
  );
};


const DjsList = props => {
  const { djs, user } = props
  return (
    <Row>
      {djs && djs.map(dj => <SingleDj user={user} dj={dj} />)}
    </Row>
  );
};

export default DjsList;
