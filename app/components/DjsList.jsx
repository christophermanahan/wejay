import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';

/* -----------------    DUMB COMPONENTS     ------------------ */

export const SingleDj = props => {
  const { user, dj } = props;

  return (
    <Col className="single-dj" xs={12}>
      {dj.uid === user.uid ?
            <Row >
              <Col xsOffset={1} xs={4}>
                <div>
                  <img className="dj-img" src={dj.photo} />
                </div>
              </Col>
              <Col xs={6}>
                <p><strong>{dj.dj_name} (You)</strong></p>
                <p><strong>Points: {dj.dj_points}</strong></p>
              </Col>
            </Row>
        :
            <Row>
              <Col xsOffset={1} xs={4}>
                <div>
                  <img className="dj-img" src={dj.photo} />
                </div>
              </Col>
              <Col xs={6}>
                <p>{dj.dj_name}</p>
                <p>Points: {dj.dj_points}</p>
              </Col>
            </Row>
      }
    </Col>

  );
};


const DjsList = props => {
  const { djs, user } = props
  return (
    <Row>
      {djs && djs.map(dj => <SingleDj key={dj.uid} user={user} dj={dj} />)}
    </Row>
  );
};

export default DjsList;
