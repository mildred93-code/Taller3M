import { useState, useEffect } from "react";

function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserCaptcha("");
  };

  useEffect(() => {
    generateCaptcha();
  }, [isRegistering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (userCaptcha.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMsg("El código CAPTCHA ingresado es incorrecto. Por favor, intenta de nuevo.");
      generateCaptcha();
      return;
    }

    const endpoint = isRegistering ? "http://localhost:3000/usuarios" : "http://localhost:3000/login";
    const bodyData = isRegistering ? { nombre, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Ocurrió un error");
      }

      if (isRegistering) {
        alert("¡Registro exitoso! Ahora inicia sesión.");
        setIsRegistering(false);
      } else {
        alert(`¡Bienvenido de nuevo, ${data.user.nombre}!`);
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message);
      generateCaptcha();
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div
        className="theme-card"
        style={{
          maxWidth: "440px",
          width: "100%",
          padding: "36px 30px",
          margin: "0 auto",
          boxShadow: "0 20px 40px rgba(74, 46, 43, 0.12), 0 4px 16px rgba(196, 109, 134, 0.15)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FDF0F3 0%, #F5E8E1 100%)",
              border: "1px solid rgba(196, 109, 134, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              boxShadow: "0 8px 16px rgba(196, 109, 134, 0.15)"
            }}
          >
            <span style={{ fontSize: "28px" }}></span>
          </div>
          <h2 style={{ color: "#4A2E2B", fontSize: "22px", fontWeight: "800", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            {isRegistering ? "Registro de Cuenta" : "Iniciar Sesión"}
          </h2>
          <p style={{ color: "#7A6966", fontSize: "14px", margin: 0 }}>
            {isRegistering ? "Crea tu cuenta en nuestra tienda virtual" : "Bienvenido a tu Tienda Virtual"}
          </p>
        </div>

        {errorMsg && (
          <div className="alert-box alert-error">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isRegistering && (
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
                Nombre completo
              </label>
              <input
                className="theme-input"
                type="text"
                placeholder="Ej. María García"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#4A2E2B", marginBottom: "6px" }}>
              Correo electrónico
            </label>
            <input
              className="theme-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ background: "#FDF9F7", padding: "14px", borderRadius: "12px", border: "1px solid rgba(184, 107, 123, 0.25)" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#4A2E2B", marginBottom: "8px" }}>
              Verificación CAPTCHA
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div
                style={{
                  flex: 1,
                  background: "linear-gradient(45deg, #4A2E2B, #6E443B, #C46D86)",
                  color: "#FFFFFF",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontSize: "22px",
                  fontWeight: "900",
                  letterSpacing: "6px",
                  textDecoration: "line-through",
                  fontStyle: "italic",
                  userSelect: "none",
                  textAlign: "center",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
                  border: "1px dashed rgba(255,255,255,0.4)"
                }}
              >
                {captchaCode}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                title="Generar nuevo código"
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #E8D9D1",
                  background: "#FFFFFF",
                  color: "#C46D86",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                🔄
              </button>
            </div>

            <input
              className="theme-input"
              type="text"
              placeholder="Ingresa el código CAPTCHA"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              required
              style={{ textAlign: "center", letterSpacing: "2px", fontWeight: "600" }}
            />
          </div>

          <button
            type="submit"
            className="theme-btn-primary"
            style={{ width: "100%", marginTop: "10px", padding: "14px" }}
          >
            {isRegistering ? "Registrarse" : "Entrar a la Tienda"} ➔
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed rgba(184, 107, 123, 0.2)", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#7A6966", margin: 0 }}>
            {isRegistering ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}{" "}
            <span
              onClick={() => setIsRegistering(!isRegistering)}
              style={{
                color: "#C46D86",
                fontWeight: "700",
                cursor: "pointer",
                textDecoration: "underline",
                transition: "color 0.2s"
              }}
            >
              {isRegistering ? "Inicia sesión aquí" : "Regístrate"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

