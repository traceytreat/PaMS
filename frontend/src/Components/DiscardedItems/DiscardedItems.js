import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Logo from "../../img/Logo.png";

const DiscardedItems = () => {
  const [discardedItems, setDiscardedItems] = useState([]);
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/discardedItems")
      .then((response) => setDiscardedItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const addDiscardedItems = (e) => {
    e.preventDefault();
    const newDiscardedItems = { sku, quantity, reason };

    axios
      .post("http://localhost:5000/api/discardedItems", newDiscardedItems)
      .then((response) => {
        console.log(response.data);
        setDiscardedItems([...discardedItems, newDiscardedItems]);
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  return (
    <div>
      <h1>Discarded Items List</h1>
      <ul>
        {discardedItems.map((item, index) => (
          <li key={index}>
            {item.sku} - {item.quantity} - {item.reason} - {item.discarddate}
          </li>
        ))}
      </ul>

      <h2>Log Discarded Item</h2>
      <form onSubmit={addDiscardedItems}>
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="SKU"
          required
        />
        <input
          type="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quanitity"
          required
        />
        <input
          type="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
          required
        />
        <button type="submit">Log Discarded Item</button>
      </form>
    </div>
  );
};

const DiscardedItemsStyled = styled.div`
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
`;
export default DiscardedItems;
