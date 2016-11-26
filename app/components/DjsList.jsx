import React, { Component } from 'react';

/* -----------------    DUMB COMPONENTS     ------------------ */

const SingleDj = props => {
  const { dj } = props;
  return (
    <div style={{border:"1px solid black"}}>
      <p>Name: {dj.dj_name}</p>
      <p>Points: {dj.dj_points}</p>
    </div>
  );
};


const DjsList = props => {
  const { djs } = props
  let djArr = []
  for (let dj in djs) { djArr.push(djs[dj]) }
  return (
    <div>
      {djArr && djArr.map(dj => <SingleDj dj={dj} />)}
    </div>
  );
};

export default DjsList;
