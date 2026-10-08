CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    total NUMERIC(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedido_productos (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INT NOT NULL
);

-- ==========================================
-- DATOS INICIALES DE PRUEBA
-- ==========================================

-- Usuarios (Contraseñas con hash bcrypt: admin123 y 123456)
INSERT INTO usuarios (nombre, email, password) VALUES
('Admin Sistema', 'admin@tienda.com', '$2a$10$iP9ic04xp1yfWKsiVmB9z.m6UJJPEB31wNTJRmVnDVMXqRWervZKy'),
('Juan Perez', 'juan@ejemplo.com', '$2a$10$4PT3TpEByk2kWU7IehP4u./0yWIv/jSNxLRC6Sev3TAbyalL5JstO'),
('Maria Lopez', 'maria@ejemplo.com', '$2a$10$4PT3TpEByk2kWU7IehP4u./0yWIv/jSNxLRC6Sev3TAbyalL5JstO')
ON CONFLICT (email) DO NOTHING;

-- Productos
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop Dell Inspiron', 'Laptop con procesador Intel i7 y 16GB RAM', 1299.99, 15),
('Smartphone Samsung Galaxy', 'Telefono movil 128GB pantalla AMOLED', 799.50, 25),
('Auriculares Inalambricos Sony', 'Cancelacion activa de ruido y Bluetooth', 149.99, 40),
('Teclado Mecanico RGB', 'Teclado para gaming con switches mecanicos', 89.90, 30),
('Monitor 27 Pulgadas 4K', 'Monitor IPS UHD para productividad y gaming', 349.00, 10),
('Mouse Inalambrico Ergonomico', 'Mouse optico recargable de alta precision', 35.50, 50);

-- Pedidos
INSERT INTO pedidos (usuario_id, total) VALUES
(1, 1449.98),
(2, 799.50);

-- Detalle de Pedidos
INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES
(1, 1, 1),
(1, 3, 1),
(2, 2, 1);