import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid/lib/index';

/* -----------------    DUMB COMPONENTS     ------------------ */

const SingleDj = props => {
  const { dj } = props;
  return (
    <Col xs={12}>
      <div style={{border:"1px solid black"}}>
        <p>Name: {dj.dj_name}</p>
        <p>Points: {dj.dj_points}</p>
      </div>
    </Col>
  );
};


const DjsList = props => {
  const { djs } = props
  let djArr = []
  for (let dj in djs) { djArr.push(djs[dj]) }
  return (
    <Row>
      {djArr && djArr.map(dj => <SingleDj dj={dj} />)}
    </Row>
  );
};

export default DjsList;
