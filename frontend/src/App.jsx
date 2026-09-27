import React, { useState } from 'react';
import Login from './components/Login';
import Productos from './components/Productos';
import Pedidos from './components/Pedidos';
import Usuarios from './components/Usuarios';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [vistaActual, setVistaActual] = useState('productos');

  if (!usuario) {
    return <Login onLoginSuccess={(user) => setUsuario(user)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav
        style={{
          background: 'linear-gradient(135deg, #38231F 0%, #4A2E2B 100%)',
          color: '#FFF0F3',
          padding: '14px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(56, 35, 31, 0.25)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}></span>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#FFF0F3', letterSpacing: '-0.3px' }}>
            Tienda Virtual
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setVistaActual('productos')}
            style={{
              background: vistaActual === 'productos' ? 'linear-gradient(135deg, #C46D86, #A64E67)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: vistaActual === 'productos' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 18px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: vistaActual === 'productos' ? '0 4px 12px rgba(196, 109, 134, 0.4)' : 'none'
            }}
          >
            Catálogo de Productos
          </button>

          <button
            onClick={() => setVistaActual('pedidos')}
            style={{
              background: vistaActual === 'pedidos' ? 'linear-gradient(135deg, #C46D86, #A64E67)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: vistaActual === 'pedidos' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 18px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: vistaActual === 'pedidos' ? '0 4px 12px rgba(196, 109, 134, 0.4)' : 'none'
            }}
          >
            Hacer Pedido
          </button>

          <button
            onClick={() => setVistaActual('usuarios')}
            style={{
              background: vistaActual === 'usuarios' ? 'linear-gradient(135deg, #C46D86, #A64E67)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: vistaActual === 'usuarios' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 18px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: vistaActual === 'usuarios' ? '0 4px 12px rgba(196, 109, 134, 0.4)' : 'none'
            }}
          >
            Gestión de Usuarios
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.12)',
              padding: '6px 14px',
              borderRadius: '20px',
              marginLeft: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#F8EBEF' }}>
              Hola, <strong>{usuario.nombre || usuario.email}</strong>
            </span>
            <button
              onClick={() => setUsuario(null)}
              style={{
                background: 'rgba(192, 67, 89, 0.85)',
                color: 'white',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {vistaActual === 'productos' && <Productos />}
        {vistaActual === 'pedidos' && <Pedidos usuarioId={usuario.id} />}
        {vistaActual === 'usuarios' && <Usuarios />}
      </main>
    </div>
  );
}