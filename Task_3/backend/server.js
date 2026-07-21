const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// GET suppliers
app.get("/suppliers", (req, res) => {
  db.query("SELECT * FROM suppliers", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// GET products
app.get("/products", (req, res) => {
  const sql = `
    SELECT p.*, s.name AS supplier_name
    FROM products p
    JOIN suppliers s ON p.supplier_id = s.supplier_id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD product
app.post("/products", (req, res) => {
  const { name, category, price, stock, supplier_id } = req.body;

  const sql = `
    INSERT INTO products (name, category, price, stock, supplier_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, category, price, stock, supplier_id], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Product added ✅");
  });
});

// DELETE product
app.delete("/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE product_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Deleted ✅");
  });
});

// UPDATE product
app.put("/products/:id", (req, res) => {
  const { name, category, price, stock, supplier_id } = req.body;

  const sql = `
    UPDATE products
    SET name=?, category=?, price=?, stock=?, supplier_id=?
    WHERE product_id=?
  `;

  db.query(sql, [name, category, price, stock, supplier_id, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Updated ✅");
  });
});

// START server
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});