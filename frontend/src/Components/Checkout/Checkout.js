import React from 'react';
import styled from 'styled-components';
import Logo from '../../img/Logo.png';

function Checkout() {
    return (
        <CheckoutStyled>
            <header>
                <img src={Logo} alt="Logo" className="logo" />
                <h1 className="title">Pantry Management System (PaMS)</h1>
            </header>

            {/* Main Checkout Box */}
            <div className="Checkoutbox" />

            {/* SKU Box with Submit Button */}
            <div className="SKU-container">
                <input className="SKUbox" type="text" placeholder="Enter SKU" />
                <button className="submit-btn">Checkout</button>
            </div>
        </CheckoutStyled>
    );
}

const CheckoutStyled = styled.div`
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

    .Checkoutbox {
        width: 95%;
        height: 550px;
        background-color: #f4f4f9;
        border: 2px solid #222260;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 1.5rem;
    }

    .SKU-container {
        display: flex;
        width: 95%;
        gap: 1rem;
    }

    .SKUbox {
        width: 90%;
        height: 75px;
        background-color: #f4f4f9;
        border: 2px solid #222260;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-size: 2rem;
    }

    .submit-btn {
        width: 25%;
        height: 75px;
        padding: 0.5rem 1rem;
        background-color: #AFD275;
        color: rgba(34, 34, 96, 1);
        font-weight: bold;
        border-radius: 8px;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .submit-btn:hover {
        background-color: #D0E5A0;
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
`;

export default Checkout;
