import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';

/* -----------------    DUMB COMPONENTS     ------------------ */

const SingleDj = props => {
  const { user, dj } = props;
  return (
    <Col className="single-dj" xs={12}>
      <Row>
        <Col xsOffset={1} xs={4}>
          <img height="75" width="75" src="https://thumbnailer.mixcloud.com/unsafe/318x318/extaudio/0/9/b/f/ce50-0b29-40a3-a31b-95b1b9b38c5c" />
        </Col>
        <Col xs={6}>
          <p>{dj.dj_name}</p>
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
