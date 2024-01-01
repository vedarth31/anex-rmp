import React from 'react';
// import tamu_logo from '/tamu_logo.png'

export default function Home() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center", marginTop: "30px" }}>
      <img
        src={'/tamu_logo.png'}
        alt="A&M"
        style={{ height: '48px', width: '48px' }}
      />
      <h1 style={{ marginLeft: '10px' }}>Aggie Prof Rec</h1>
    </div>
  );
}
