import React, { useState, useEffect} from 'react';
import Popup from 'reactjs-popup';
import axios from 'axios'
import styled from 'styled-components';
import Logo from '../../img/Logo.png';


const Checkout = () => {
    const [member, setMember] = useState({});
    const [inventory, setInventory] = useState([]);
    const [visits, setVisits] = useState([]);
    const [techID, setID] = useState('');
    const [sku, setSKU] = useState('');
    const [weightTotal, setWeight] = useState('');

    const [cart, setCart] = useState([]);

    var poundsLeft = 50;

    useEffect(() => {
        axios.get('http://localhost:5000/api/inventory')
          .then(response => setInventory(response.data))
          .catch(error => console.error('Error fetching inventory:', error));
      }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/visits')
          .then(response => setVisits(response.data))
          .catch(error => console.error('Error fetching members:', error));
      }, []);


const checkIn = () => {
    axios
        .get('http://localhost:5000/api/member', {
            params: {memberid : techID},
        })
        .then(response => setMember(response.data))
        .catch(error => console.error('Error fetching members:', error));

    let date = new Date();
    if (member !== undefined) {
        visits.filter(data => (data.memberid === techID))
              .filter(data => (data.visitdate.month === date.getMonth))
        for(var i = 0; i<visits.length;i++) {
            poundsLeft -= visits[i].poundstaken;
        }
    } else {
        alert("No ID found in the system");
    }
 };

function total(data) {
    let sum = 0;
    sum += data.poundstaken;
    return sum;
}

// Take SKU -> find SKU in inventory -> add info to cart
const addToCart = (sku) => {
    const newItem = inventory.find(product => product.sku === sku);
    if (newItem !== undefined) {
        if (cart.includes(product => product.sku === sku)) {
            cart[cart.findIndex(product => product.sku === sku)].quantity++;
        } else {
            setCart([...cart, newItem]);
        }
        alert("Add " + newItem.name + " to the cart.");
    } else {
        alert("No product found in the system.");
    }
    setSKU('');
 };

 const decrement = (index) => {
    cart[index-1].quantity = cart[index-1].quantity-1;
 }
 const increment = (index) => {
    cart[index-1].quantity++;
 }

 const clearCart = () => {
    cart.length = 0;
 }

 const displayCart = cart.map((item, index) => 
    <li key = {index}>
        <div className="name">
            {item.name}
        </div>
        <div className="quantity">
            <span class="minus" onClick={() => decrement(index)}>-</span>
            <span>{item.quantity}</span>
            <span class="plus" onClick={() => increment(index)}>+</span>
            
        </div>
            
    </li>);

const handleCheckout = () => {
    let date = new Date();
    if (weightTotal <= poundsLeft){
        const newVisit = {
            memeberid : techID,
            poundstaken : weightTotal,
            visitdate : date.toISOString().slice(0, 19).replace('T', ' ')
        }
        axios
            .post("http://localhost:5000/api/visits", newVisit)
            .then((response) => {
            console.log(response.data);
            setVisits([...visits, newVisit]); 
        })
        .catch((error) => console.error("Error adding user:", error));

        var cartLength = cart.length;
        for (var i = 0; i < cartLength; i++) {
            const item = inventory.find(product => product.sku === sku);
            item.quantity = item.quantity-cart[i].quantity;
        }

    } else {
        alert("Exceeded total weight allowed per month.");
    }
};

//function Checkout() {
    return (
        <CheckoutStyled>
            <header>
                <img src={Logo} alt="Logo" className="logo" />
                <h1 className="title">Pantry Management System (PaMS)</h1>
            </header>

            {/* Main Checkout Box */}
            <div className="checkout-display" >
                <div className="visitor">
                    <form onSubmit={checkIn}>
                        <input 
                            name="techid" 
                            value={techID} 
                            onChange={(e) => setID(e.target.value)}
                            type ="text" 
                            placeholder="tech ID"
                            required
                        />
                        <div/>
                        <button class="checkin-btn" type="submit">Check In</button>
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
                        <Popup trigger= 
                            {<button className="btn" type="submit">Checkout</button>}
                            modal nested>
                            {
                                close => (
                                    <div className='modal'>
                                        <div className='content'>
                                            <form onSubmit={handleCheckout}>
                                                <input 
                                                    name="weight" 
                                                    value={weightTotal} 
                                                    onChange={(e) => setWeight(e.target.value)}
                                                    type ="text" 
                                                    placeholder="weight"
                                                    required
                                                />
                                            </form>
                                        </div>
                                        <div className='checkout-submit'>
                                            <button className="submit-btn" type="submit">
                                                    Complete Checkout
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                    </Popup>
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

    .modal {
        background-color: #222260;
        width: 500px;
        height: 500px;
    }

    .modal .checkout-submit .submit-btn {
        width: 200px;
        background-color: #AFD275;
        color: rgba(34, 34, 96, 1);
        font-weight: bold;
        border-radius: 8px;
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
