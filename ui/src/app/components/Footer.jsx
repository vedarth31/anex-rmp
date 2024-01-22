"use client";

import React from 'react';

const Footer = () => {
  const footerStyle = {
    padding: '10px',
    paddingTop: '100px',
    textAlign: 'center',
    position: 'fixed',
    bottom: '0',
    width: '100%',
  };

  const copyrightStyle = {
    fontSize: '20px',
    color: "gray",  
  };

  return (
    <footer style={footerStyle}>
      <p style={copyrightStyle}>&#169; 2024 Vedarth Atreya, Anirudh Nukala, Athul Suresh</p>
    </footer>
  );
}

export default Footer;
