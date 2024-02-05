import React from 'react';

function Info() {

    const containerStyle = {
        maxWidth: '600px',
        // margin: '0 auto',
        textAlign: 'center',
        border: '3px solid #500000',
        // padding: '20px',
        marginTop: '5rem',
    };

    const headingStyle = {
        // marginTop: '100px',
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    };

    const descriptionStyle = {
        fontSize: '16px',
        color: '#555',
        marginBottom: '10px',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Welcome to Aggie ProfRec!</h1>
            <p style={descriptionStyle}>Enter your department (4 letters) and class code (3 digits) to get data for an entire course.</p>
            <p style={descriptionStyle}>For information on a specific professor, enter the course and the professor&apos;s name.</p>
            <p style={descriptionStyle}>You will see stats including the three most recent GPAs for this professor, grade distribution, and data from RateMyProfessor.</p>
        </div>
    );
}

export default Info;
