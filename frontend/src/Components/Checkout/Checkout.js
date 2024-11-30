import React, { useState, useEffect} from 'react';
import axios from 'axios'
import styled from 'styled-components';
import Logo from '../../img/Logo.png';


const Checkout = () => {
    const [member, setMember] = useState({});
    const [memberID, setID] = useState('');
    const [sku, setSKU] = useState('');
    const [weightTotal, setWeight] = useState('');
    const [poundsLeft, setPounds] = useState(50);
    const [cart, setCart] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [checkInStatus, setStatus] = useState(false);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/inventory')
            .then(response => setInventory(response.data))
            .catch(error => console.error('Error fetching inventory:', error));
    }, []);

    const checkIn = (e) => {
        e.preventDefault()
        axios
            .get('http://localhost:5000/api/member', {
                params: {memberid: memberID},
            })
            .then(response => {
                setMember(response.data);
                setStatus(true);
            })
            .catch(error => console.error('Error fetching members:', error));
        if (checkInStatus) {
            axios
                .get('http://localhost:5000/api/report/totaltaken', {
                    params: {member_id: memberID},
                })
                .then(response => setPounds(50 - response.data))
                .catch(error => {
                    console.error('Error fetching available pound by member id:', error)
                    alert("No ID found in the system");
                });
        }
    };

// Take SKU -> find SKU in inventory -> add info to cart
    const addToCart = (e) => {
        e.preventDefault();
        const addedItem = inventory.find(findProduct);
        if (addedItem !== undefined) {
            if (cart.find(findProduct)) {
                const cartUpdate = cart.map(product => product.sku === sku ? {
                        ...product, quantity: product.quantity + 1
                    } : product
                );
                setCart(cartUpdate);
            } else {
                setCart([...cart, {sku: addedItem.sku, name: addedItem.name, quantity: 1}]);
            }
        } else {
            alert("No product found in the system.");
        }
        setSKU('');
    };

    function findProduct(product) {
        return product.sku === sku;
    }

    const decrement = (i) => {
        const cartUpdate = cart.map((product, index) => index === i ? {
                ...product, quantity: product.quantity - 1
            } : product
        )
            .filter(product => product.quantity !== 0);
        setCart(cartUpdate);
    }
    const increment = (i) => {
        const cartUpdate = cart.map((product, index) => index === i ? {
                ...product, quantity: product.quantity + 1
            } : product
        );
        setCart(cartUpdate);
    }

    const deleteItem = (i) => {
        const cartUpdate = cart.filter((product, index) => index !== i);
        setCart((cartUpdate));
    }

    const clearCart = () => {
        setCart([]);
    }

    const displayCart = cart.map((item, index) =>
        <li key={index}>
            <div className="name">
                {item.name}
            </div>
            <div className="quantity">
                <span className="minus" onClick={() => decrement(index)}>-</span>
                <span>{item.quantity}</span>
                <span className="plus" onClick={() => increment(index)}>+</span>

            </div>

        </li>);

    const handleCheckout = (e) => {
        e.preventDefault();
        if (!checkInStatus) {
            alert("Check member in first!");
        } else if (cart.length === 0) {
            alert("Cart is empty.");
        } else
            if (parseFloat(weightTotal) <= poundsLeft) {
                const newVisit = {
                    memberid: memberID,
                    poundstaken: parseFloat(weightTotal)
                }
                axios
                    .post("http://localhost:5000/api/visits", newVisit)
                    .then((response) => {
                        console.log(response.data);
                    })
                    .catch((error) => console.error("Error adding user:", error));
                setCart([]);
                setID('');
                setMember({});
                setStatus(false);
            } else {
                alert("Exceeded total weight allowed per month.");
            }
        setWeight('');
        setOpenModal(!openModal);
    };

//function Checkout() {
    return (
        <CheckoutStyled>
            <header>
                <img src={Logo} alt="Logo" className="logo"/>
                <h1 className="title">Pantry Management System (PaMS)</h1>
            </header>

            {/* Main Checkout Box */}
            <div className="checkout-display">
                <div className="visitor">
                    <form onSubmit={checkIn}>
                        <input
                            name="memberid"
                            value={memberID}
                            onChange={(e) => setID(e.target.value)}
                            type="text"
                            placeholder="Member ID"
                            required
                        />
                        <div/>
                        <button className="checkin-btn" type="submit">Check In</button>
                    </form>
                    <div className="visitor-display">
                        <table>
                            <tr>
                                <th>Name</th>
                                <td>{member.firstname} {member.lastname}</td>
                            </tr>
                            <tr>
                                <th>Pounds available</th>
                                <td>{poundsLeft}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div></div>
                <div className="cart">
                    <h2>Cart</h2>
                    <ul>{displayCart}</ul>
                    <div className="button">
                    <button className="btn" type="submit" onClick={clearCart}>Clear</button>
                        <button className="btn" onClick={() => setOpenModal(!openModal)}>Checkout</button>
                        {openModal && (
                            <div className="modal">
                                <div className="modal-container">
                                    <div className="close-btn">
                                        <button onClick={() => setOpenModal(!openModal)}> X</button>
                                    </div>
                                    <div className="body">
                                        <h2>Checkout Form</h2>
                                        <p>Checking out {member.firstname} {member.lastname}</p>
                                        <p>Enter total amount of weight</p>
                                        <form onSubmit={handleCheckout}>
                                            <input
                                                name="weight"
                                                value={weightTotal}
                                                onChange={(e) => setWeight(e.target.value)}
                                                type="text"
                                                placeholder="weight"
                                                required
                                            />
                                            <div className='checkout-submit'>
                                                <button className="checkout-btn" type="submit">
                                                    Complete Checkout
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* SKU Box with Submit Button */}
            <form className="SKU-container" onSubmit={addToCart}>
                <input className="SKUbox"
                       name="sku"
                       value={sku}
                       onChange={(e) => setSKU(e.target.value)}
                       type="text"
                       placeholder="Enter SKU"
                />
                <button className="submit-btn" type="submit">Add to cart</button>
            </form>
        </CheckoutStyled>
    );
};

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

    .checkout-display {
        display: flex;
        flex-direction: row;
        width: 95%;
        height: 550px;
        background-color: #f4f4f9;
        border: 2px solid #222260;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 1.5rem;
    }
    
    .visitor {
        width: 40%;
    }

    .visitor form {
        margin: 10px 0;
    }

    .visitor input {
        width: 90%;
        height: 25px;
        background-color: #f4f4f9;
        border: 2px solid #222260;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .visitor .checkin-btn {
        width: 25%;
        height: 25px;
        background-color: #AFD275;
        margin : 15px 0;
        color: rgba(34, 34, 96, 1);
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .visitor table {
        border-collapse: collapse;
        border-radius: 50%;
        margin-top: 25%;
        margin-left: auto;
        margin-right: auto;
    }

    .visitor th, td{
        text-align: left;
        border : 1px solid black;
        border-radius: 50%;
        padding: 15px;
    }
    
    .visitor td {
        width: 200px;
    }

    .cart {
        display: flex;
        flex-direction: column;
        width: 60%;
    }
    
    .cart li {
        display:flex;
        flex-direction: row;
    }

    .cart .name {
        width: 70%;
        text-align: left;
    }

    .cart .quantity {
        margin-left: auto;
        margin-right: 20px;
    }
    
    .cart span{
        display: inline-block;
        background-color: #AFD275;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
    }

    .cart span:nth-child(2){
        background-color: transparent;
        margin : 0 5px;
        cursor : none;
    }

    .cart .button {
        display: flex;
        flex-direction: row;
        margin-top: auto;
        margin-left: auto;
        margin-right: auto;
    }

    .cart .btn {
        width: 150px;
        height: 50px;
        margin: 0 15px;
        background-color: #AFD275;
        color: rgba(34, 34, 96, 1);
        font-weight: bold;
        border-radius: 8px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    background-color: #afd275;
    color: rgba(34, 34, 96, 1);
    font-weight: bold;
    border-radius: 8px;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .submit-btn:hover {
    background-color: #d0e5a0;
  }
    
    .modal{
        width: 50vw;
        height: 45vh;
        top: 25%;
        left: 20%;
        right: 25%;
        bottom: 25%;
        position: fixed;
        background-color: #AFD275;
        border-radius: 12px;
    }
    
    .close-btn {
        height: 10px;
        margin-top: 8px;
        margin-right: 8px;
    }

    .close-btn  button{
        background-color: #DA4B13;
        float: right;
        color: white;
        padding: 5px 7px;
    }
    
    .modal .body {
        background-color: #D0E5A0;
        width: 95%;
        margin:30px auto;
        border-radius: 12px;
    }
    
    .modal .body h2 {
        padding-top: 15px;
    }
    
    .modal .body input {
        margin: 25px;
        width: 60%;
        height: 25px;
        background-color: #f4f4f9;
        border: 2px solid #222260;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .modal .checkout-btn {
        width: 250px;
        height: 50px;
        margin-top: auto;
        margin-bottom: 25px;
        background-color: #AFD275;
        color: rgba(34, 34, 96, 1);
        font-weight: bold;
        border-radius: 8px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
