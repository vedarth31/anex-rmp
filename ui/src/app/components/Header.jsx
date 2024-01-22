import React from 'react'
import Info from './Info'

function Header() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center", marginTop: "30px" }}>
            <img
                src={'/tamu_logo.png'}
                alt="A&M"
                style={{ height: '48px', width: '48px' }}
            />
            <h1 style={{ marginLeft: '10px' }}>Aggie ProfRec</h1>
        </div>
    )
}

export default Header
