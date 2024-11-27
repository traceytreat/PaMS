import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const DiscardedItems = () => {
  const [discardedItems, setDiscardedItems] = useState([]);
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  // Fetch discarded items from the API
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
        setSku("");
        setQuantity("");
        setReason("");
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Discarded Items List
      </Typography>
      <List>
        {discardedItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`SKU: ${item.sku} - Quantity: ${item.quantity}`}
              secondary={`Reason: ${item.reason} | Date: ${item.discarddate}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Log Discarded Item
      </Typography>
      <Box
        component="form"
        onSubmit={addDiscardedItems}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Quantity"
          value={quantity}
          type="number"
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Log Discarded Item
        </Button>
      </Box>
    </Box>
  );
};

export default DiscardedItems;
