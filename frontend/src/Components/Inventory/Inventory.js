import React from 'react'
import styled from 'styled-components'
import Logo from '../../img/Logo.png'

function Inventory() {
    return (
        <InventoryStyled>
            <header>
                <img src={Logo} alt="Logo" className="logo" />
                <h1 className="title">Pantry Management System (PaMS)</h1>
            </header>
        </InventoryStyled>
    )
}

const InventoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;

    header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2rem;
        gap: 1rem;
    }

    .logo {
        width: 80px;
        height: auto;
    }

    .title {
        font-size: 2rem;
        font-weight: bold;
        color: #222260;
    }
`
export default Inventory