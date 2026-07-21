import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    supplier_id: ""
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  const fetchSuppliers = async () => {
    const res = await axios.get("http://localhost:5000/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Fill required fields");
    await axios.post("http://localhost:5000/products", newProduct);
    setNewProduct({ name: "", category: "", price: "", stock: "", supplier_id: "" });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/products/${id}`);
    fetchProducts();
  };

  const updateProduct = async (product) => {
    await axios.put(`http://localhost:5000/products/${product.product_id}`, product);
    setEditingId(null);
    fetchProducts();
  };

  const getStockColor = (stock) => {
    if (stock < 5) return "bg-red-100 text-red-600";
    if (stock < 15) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        🛒 Grocery Inventory Dashboard
      </h1>

      {/* Add Product */}
      <div className="backdrop-blur-md bg-white/70 p-6 rounded-2xl shadow-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Add Product</h2>

        <div className="grid grid-cols-2 gap-4">
          <input className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-400" placeholder="Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />

          <input className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-400" placeholder="Category"
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />

          <input className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-400" placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />

          <input className="p-2 rounded-lg border focus:ring-2 focus:ring-purple-400" placeholder="Stock"
            value={newProduct.stock}
            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />

          <select className="p-2 rounded-lg border col-span-2 focus:ring-2 focus:ring-purple-400"
            value={newProduct.supplier_id}
            onChange={(e) => setNewProduct({ ...newProduct, supplier_id: e.target.value })}>
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.supplier_id} value={s.supplier_id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={addProduct}
          className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition">
          ➕ Add
        </button>
      </div>

      {/* Product Table */}
      <div className="backdrop-blur-md bg-white/70 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Products</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.product_id} className="hover:bg-white/60 transition">
                {editingId === p.product_id ? (
                  <>
                    <td>
                      <input defaultValue={p.name}
                        onChange={(e) => p.name = e.target.value}
                        className="border p-1 rounded" />
                    </td>
                    <td>
                      <input defaultValue={p.price}
                        onChange={(e) => p.price = e.target.value}
                        className="border p-1 rounded" />
                    </td>
                    <td>{p.stock}</td>
                    <td>{p.supplier_name}</td>
                    <td>
                      <button
                        onClick={() => updateProduct(p)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg">
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStockColor(p.stock)}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3">{p.supplier_name}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => setEditingId(p.product_id)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:scale-105 transition">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.product_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:scale-105 transition">
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
