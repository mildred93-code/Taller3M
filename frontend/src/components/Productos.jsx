import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      const data = await response.json();
      if (response.ok) {
        setProductos(data);
      }
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleCreateProducto = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: parseFloat(precio),
          stock: parseInt(stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al crear el producto");
      }

      alert("¡Producto agregado con éxito!");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");
      fetchProductos();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Producto eliminado");
        fetchProductos();
      } else {
        alert("No se pudo eliminar el producto");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <div style={{ padding: "30px 20px", maxWidth: "1000px", margin: "0 auto" }}>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ color: "#4A2E2B", fontSize: "26px", fontWeight: "800", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "10px" }}>
          Catálogo y Gestión de Productos
        </h2>
        <p style={{ color: "#7A6966", fontSize: "14px", margin: 0 }}>
          Agrega nuevos productos al inventario o administra la lista existente
        </p>
      </div>

      {errorMsg && (
        <div className="alert-box alert-error">
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="theme-card" style={{ padding: "26px", marginBottom: "32px" }}>
        <h3 style={{ color: "#4A2E2B", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
          Agregar Nuevo Producto
        </h3>

        <form onSubmit={handleCreateProducto} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
              Nombre del producto
            </label>
            <input
              className="theme-input"
              type="text"
              placeholder="Escribe el nombre del producto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
              Precio ($)
            </label>
            <input
              className="theme-input"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
              Stock disponible
            </label>
            <input
              className="theme-input"
              type="number"
              placeholder="Escribe la cantidad"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
              Descripción
            </label>
            <input
              className="theme-input"
              type="text"
              placeholder="Escribe una descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div style={{ gridColumn: "span 2", marginTop: "6px" }}>
            <button type="submit" className="theme-btn-primary" style={{ width: "100%", padding: "12px" }}>
              Agregar Producto al Catálogo
            </button>
          </div>
        </form>
      </div>

      <div className="theme-card" style={{ padding: "26px" }}>
        <h3 style={{ color: "#4A2E2B", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
          Productos Registrados ({productos.length})
        </h3>

        <div className="theme-table-container">
          <table className="theme-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "#7A6966" }}>
                    No hay productos registrados en el catálogo.
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.id}>
                    <td style={{ fontWeight: "700", color: "#4A2E2B" }}>{prod.nombre}</td>
                    <td style={{ color: "#6E5C59", maxWidth: "300px" }}>{prod.descripcion || "Sin descripción"}</td>
                    <td>
                      <span style={{
                        background: "#FDF0F3",
                        color: "#C46D86",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontWeight: "700",
                        fontSize: "13px",
                        border: "1px solid rgba(196, 109, 134, 0.2)"
                      }}>
                        ${prod.precio}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        background: prod.stock > 0 ? "#EAF5EE" : "#FDF0F3",
                        color: prod.stock > 0 ? "#366343" : "#C04359",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontWeight: "600",
                        fontSize: "12px"
                      }}>
                        {prod.stock > 0 ? `${prod.stock} en stock` : "Sin stock"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button onClick={() => handleDelete(prod.id)} className="theme-btn-danger">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Productos;
