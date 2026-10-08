import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function Pedidos({ usuarioId }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState({});
  const [mensaje, setMensaje] = useState('');

  const cargarProductos = () => {
    fetch(`${API_BASE_URL}/productos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          setProductos([]);
        }
      })
      .catch(err => console.error('Error al cargar productos:', err));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const manejarCantidad = (productoId, cantidad) => {
    setCarrito({
      ...carrito,
      [productoId]: parseInt(cantidad) || 0
    });
  };

  const realizarPedido = async (e) => {
    e.preventDefault();
    setMensaje('');

    const itemsPedido = Object.entries(carrito)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([producto_id, cantidad]) => ({
        producto_id: parseInt(producto_id),
        cantidad
      }));

    if (itemsPedido.length === 0) {
      setMensaje('Agrega al menos un producto al pedido.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          productos: itemsPedido
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje('¡Pedido realizado con éxito!');
        setCarrito({});
        cargarProductos();
      } else {
        setMensaje(`Error: ${data.msg || data.error || 'No se pudo procesar'}`);
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    }
  };

  return (
    <div style={{ padding: '30px 20px', maxWidth: '950px', margin: '0 auto' }}>
      <div className="theme-card" style={{ padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ color: '#4A2E2B', margin: 0, fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Realizar un Nuevo Pedido
            </h2>
            <p style={{ color: '#7A6966', fontSize: '14px', margin: '4px 0 0 0' }}>
              Selecciona los productos y las cantidades que deseas ordenar
            </p>
          </div>
        </div>

        {mensaje && (
          <div className={`alert-box ${mensaje.includes('éxito') ? 'alert-success' : 'alert-error'}`}>
            <span>{mensaje}</span>
          </div>
        )}

        <form onSubmit={realizarPedido}>
          <div className="theme-table-container">
            <table className="theme-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th style={{ textAlign: 'center' }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#7A6966' }}>
                      Cargando catálogo de productos o no hay productos disponibles...
                    </td>
                  </tr>
                ) : (
                  productos.map(prod => (
                    <tr key={prod.id}>
                      <td style={{ fontWeight: '700', color: '#4A2E2B' }}>{prod.nombre}</td>
                      <td style={{ color: '#6E5C59', maxWidth: '280px' }}>{prod.descripcion}</td>
                      <td>
                        <span style={{
                          background: '#FDF0F3',
                          color: '#C46D86',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontWeight: '700',
                          fontSize: '13px',
                          border: '1px solid rgba(196, 109, 134, 0.2)'
                        }}>
                          ${prod.precio}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          background: prod.stock > 0 ? '#EAF5EE' : '#FDF0F3',
                          color: prod.stock > 0 ? '#366343' : '#C04359',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontWeight: '600',
                          fontSize: '12px'
                        }}>
                          {prod.stock > 0 ? `${prod.stock} disponibles` : 'Agotado'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          className="theme-input"
                          type="number"
                          min="0"
                          max={prod.stock}
                          value={carrito[prod.id] || ''}
                          onChange={(e) => manejarCantidad(prod.id, e.target.value)}
                          style={{ width: '80px', textAlign: 'center', padding: '8px' }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              type="submit"
              className="theme-btn-primary"
              style={{ padding: '14px 32px', fontSize: '16px' }}
            >
              Confirmar y Comprar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
