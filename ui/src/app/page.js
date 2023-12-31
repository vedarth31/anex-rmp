import React from 'react';

export default function Home() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center", marginTop: "30px" }}>
      <img
        src="/tamu_logo.png"
        alt="Texas A&M Logo"
        style={{ height: '48px', width: '48px' }}
      />
      <h1 style={{ marginLeft: '10px' }}>Aggie Prof Rec</h1>
    </div>
  );
}
