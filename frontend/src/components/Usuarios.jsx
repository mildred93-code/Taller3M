import React, { useState, useEffect } from "react";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  //POST
  const [mostrarFormCrear, setMostrarFormCrear] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");

  //PUT
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  //GET
  const fetchUsuarios = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("http://localhost:3000/usuarios");
      const data = await response.json();
      if (response.ok) {
        setUsuarios(data);
      } else {
        throw new Error(data.msg || "Error al obtener usuarios");
      }
    } catch (err) {
      setErrorMsg("No se pudo conectar con el servidor backend (http://localhost:3000/usuarios). Verifique que el servidor Node.js esté ejecutándose.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  //POST
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoNombre,
          email: nuevoEmail,
          password: nuevoPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al registrar el usuario");
      }

      setSuccessMsg(` ${data.msg || "Usuario registrado exitosamente"}`);
      setNuevoNombre("");
      setNuevoEmail("");
      setNuevoPassword("");
      setMostrarFormCrear(false);
      fetchUsuarios();
    } catch (err) {
      setErrorMsg(`Error: ${err.message}`);
    }
  };

  //PUT
  const handleActualizarUsuario = async (e) => {
    e.preventDefault();
    if (!usuarioEditar) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${usuarioEditar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editNombre,
          email: editEmail,
          password: editPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al actualizar usuario");
      }

      setSuccessMsg(`[PUT 200] ${data.msg || "Usuario actualizado exitosamente"}`);
      setUsuarioEditar(null);
      fetchUsuarios();
    } catch (err) {
      setErrorMsg(`Error (PUT): ${err.message}`);
    }
  };

  //DELETE
  const handleEliminarUsuario = async (id, nombreUser) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombreUser}" (ID: ${id})?`)) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "No se pudo eliminar el usuario");
      }

      setSuccessMsg(`[DELETE 200] ${data.msg || "Usuario eliminado exitosamente"}`);
      fetchUsuarios();
    } catch (err) {
      setErrorMsg(`Error (DELETE): ${err.message}`);
    }
  };

  const abrirEdicion = (user) => {
    setUsuarioEditar(user);
    setEditNombre(user.nombre || "");
    setEditEmail(user.email || "");
    setEditPassword("");
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const termino = filtroNombre.toLowerCase();
    const coincideNombre = u.nombre ? u.nombre.toLowerCase().includes(termino) : false;
    const coincideEmail = u.email ? u.email.toLowerCase().includes(termino) : false;
    return coincideNombre || coincideEmail;
  });

  return (
    <div style={{ padding: "30px 20px", maxWidth: "1050px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ color: "#4A2E2B", fontSize: "26px", fontWeight: "800", margin: "0 0 6px 0" }}>
              Gestión de Usuarios
            </h2>
            <p style={{ color: "#7A6966", fontSize: "14px", margin: 0 }}>
              Administra los usuarios registrados
            </p>
          </div>
          <button
            onClick={() => setMostrarFormCrear(!mostrarFormCrear)}
            className="theme-btn-primary"
            style={{ padding: "10px 18px", fontSize: "14px" }}
          >
            {mostrarFormCrear ? "Cancelar" : "+ Agregar Usuario"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          flexWrap: "wrap",
          background: "#FFFFFF",
          padding: "12px 18px",
          borderRadius: "12px",
          border: "1px solid rgba(184, 107, 123, 0.2)",
          alignItems: "center"
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#4A2E2B" }}>Métodos disponibles:</span>
        <span style={{ background: "#E3F2FD", color: "#1976D2", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Buscar usuarios</span>
        <span style={{ background: "#E8F5E9", color: "#2E7D32", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Crear usuarios</span>
        <span style={{ background: "#FFF3E0", color: "#E65100", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Editar/Actualizar usuarios</span>
        <span style={{ background: "#FFEBEE", color: "#C62828", padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Borrar usuarios</span>
      </div>

      {errorMsg && (
        <div className="alert-box alert-error" style={{ marginBottom: "16px" }}>
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert-box alert-success" style={{ marginBottom: "16px" }}>
          <span>{successMsg}</span>
        </div>
      )}

      {mostrarFormCrear && (
        <div className="theme-card" style={{ padding: "24px", marginBottom: "28px", borderLeft: "5px solid #2E7D32" }}>
          <h3 style={{ color: "#2E7D32", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            Registrar Nuevo Usuario
          </h3>
          <form onSubmit={handleCrearUsuario} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
                Nombre completo
              </label>
              <input
                className="theme-input"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
                Correo electrónico
              </label>
              <input
                className="theme-input"
                type="email"
                placeholder="juan@ejemplo.com"
                value={nuevoEmail}
                onChange={(e) => setNuevoEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
                Contraseña
              </label>
              <input
                className="theme-input"
                type="password"
                placeholder="••••••••"
                value={nuevoPassword}
                onChange={(e) => setNuevoPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ gridColumn: "span 3", display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => setMostrarFormCrear(false)}
                style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button type="submit" className="theme-btn-primary" style={{ padding: "10px 20px" }}>
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}

      {usuarioEditar && (
        <div className="theme-card" style={{ padding: "24px", marginBottom: "28px", borderLeft: "5px solid #E65100" }}>
          <h3 style={{ color: "#E65100", fontSize: "16px", fontWeight: "700", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            [{usuarioEditar.id}] Modificar Datos del Usuario
          </h3>
          <form onSubmit={handleActualizarUsuario} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
                Nombre completo
              </label>
              <input
                className="theme-input"
                type="text"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
                Correo electrónico
              </label>
              <input
                className="theme-input"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
                Nueva Contraseña
              </label>
              <input
                className="theme-input"
                type="password"
                placeholder="Ingresa la nueva contraseña"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ gridColumn: "span 3", display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => setUsuarioEditar(null)}
                style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #E65100, #F57C00)",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="theme-card" style={{ padding: "20px 24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#4A2E2B", marginBottom: "6px" }}>
              Buscar usuarios por nombre o correo
            </label>
            <input
              className="theme-input"
              type="text"
              placeholder="Escribe el nombre del usuario a buscar..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </div>
          <button
            onClick={fetchUsuarios}
            style={{
              padding: "12px 18px",
              marginTop: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(184, 107, 123, 0.3)",
              background: "#FDF0F3",
              color: "#C46D86",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            Recargar
          </button>
        </div>
      </div>

      <div className="theme-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: "#4A2E2B", fontSize: "16px", fontWeight: "700", margin: 0 }}>
            Lista de Usuarios ({usuariosFiltrados.length} encontrados)
          </h3>
          {loading && <span style={{ fontSize: "13px", color: "#C46D86" }}>Cargando datos...</span>}
        </div>

        <div className="theme-table-container">
          <table className="theme-table">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>ID</th>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th style={{ textAlign: "center", width: "180px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "#7A6966" }}>
                    {filtroNombre ? `No se encontraron usuarios con la búsqueda "${filtroNombre}".` : "No hay usuarios registrados."}
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: "700", color: "#7A6966" }}>#{user.id}</td>
                    <td style={{ fontWeight: "700", color: "#4A2E2B" }}>{user.nombre || "Sin nombre"}</td>
                    <td style={{ color: "#6E5C59" }}>{user.email}</td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button
                          onClick={() => abrirEdicion(user)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "700",
                            borderRadius: "6px",
                            border: "1px solid #FFE0B2",
                            background: "#FFF3E0",
                            color: "#E65100",
                            cursor: "pointer"
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarUsuario(user.id, user.nombre || user.email)}
                          className="theme-btn-danger"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          Eliminar
                        </button>
                      </div>
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

export default Usuarios;
