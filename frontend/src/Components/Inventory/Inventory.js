import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Quagga from "quagga";
import Logo from "../../img/Logo.png";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [sku, Setsku] = useState("");
  const [name, Setname] = useState("");
  const [barcode, setBarcode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users from Flask API
  useEffect(() => {
    fetchInventory();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Quagga.decodeSingle(
          {
            src: e.target.result,
            numOfWorkers: 0,
            inputStream: {
              size: 800,
            },
            decoder: {
              readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
            },
          },
          async (result) => {
            if (result && result.codeResult) {
              setBarcode(result.codeResult.code);
              Setsku(result.codeResult.code);
              fetchProductName(result.codeResult.code);
            } else {
              console.error("no barcode found");
            }
          }
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProductName = async (sku) => {
    setLoading(true);
    try {
      const cleanSku = sku.replace(/\s/g, "").trim();
      const response = await axios.get(
        `https://api.allorigins.win/raw?url=https://api.upcitemdb.com/prod/trial/lookup?upc=${cleanSku}`
      );
      console.log(response.data);
      if (response.data.items && response.data.items.length > 0) {
        const productName = response.data.items[0].title; // Extract product name
        Setname(productName);
      } else {
        console.log("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product name from API:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = () => {
    axios
      .get("http://localhost:5000/api/inventory")
      .then((response) => setInventory(response.data))
      .catch((error) => console.error("Error fetching inventory:", error));
  };
  const deleteitem = (id, quantity) => {
    console.log("in deleteitem");
    const confirm = window.confirm("Delete item " + id + "?");
    if (confirm) {
      axios
        .delete(`http://localhost:5000/api/inventory/${id}`)
        .then(() => {
          fetchInventory();
          alert("Deleted item with ID " + id);
        })
        .catch((error) => console.error("Error deleting item:", error));
    } else {
      console.log("Deletion canceled");
    }
  };

  const additem = (e) => {
    e.preventDefault();
    const newItem = { sku, name };
    axios
      .post("http://localhost:5000/api/inventory", newItem)
      .then((response) => {
        fetchInventory(); // fetch updated inventory after adding item
        alert("Added item " + name + " with sku " + sku);
        Setsku("");
        Setname("");
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "sku", headerName: "SKU", width: 150 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <IconButtonStyled onClick={() => deleteitem(params.row.id)}>
          <DeleteIcon />
        </IconButtonStyled>
      ),
    },
  ];

  const rows = inventory.map((item, index) => ({
    id: index + 1,
    ...item,
  }));
  return (
    <InventoryStyled>
      <h1>Inventory</h1>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      <h2>Add Item</h2>
      <form onSubmit={additem}>
        <input
          type="text"
          value={sku}
          onChange={(e) => Setsku(e.target.value)}
          placeholder="SKU"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => Setname(e.target.value)}
          placeholder="Name"
          required
        />
        <button className="add-item-button" type="submit">Add Item</button>
      </form>
    </InventoryStyled>
  );
};

const InventoryStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  width: 100%;

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    width: 300px;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 0.5rem;
    font-size: 1rem;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .add-item-button {
    background-color: #007bff;
  }

  .add-item-button:hover {
    background-color: #0056b3;
  }

  .delete-btn {
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
  }
`;

const IconButtonStyled = styled(IconButton)`
  background-color: red !important;
  color: white !important;
  padding: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: darkred !important;
  }
`;


export default Inventory;
