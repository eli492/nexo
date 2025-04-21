-- Crear la base de datos
-- Este comando se debe ejecutar separadamente como superusuario
-- CREATE DATABASE nexo_om_db WITH ENCODING 'UTF8';

-- Conectarse a la base de datos
\c nexo_om_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fecha_reg TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de carreras
CREATE TABLE IF NOT EXISTS carreras (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Tabla de materias
CREATE TABLE IF NOT EXISTS materias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  carrera_id INTEGER NOT NULL,
  FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE CASCADE
);

-- Tabla de recursos
CREATE TABLE IF NOT EXISTS recursos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(10) NOT NULL, -- PostgreSQL no usa ENUM como MySQL, usamos VARCHAR con CHECK
  url VARCHAR(255),
  archivo VARCHAR(255),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usuario_id INTEGER NOT NULL,
  materia_id INTEGER NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  CHECK (tipo IN ('archivo', 'enlace'))
);

-- Insertar algunas carreras de ejemplo
INSERT INTO carreras (nombre, descripcion) VALUES 
('Ingeniería de Software', 'Carrera enfocada en el desarrollo de software y soluciones tecnológicas'),
('Administración de Empresas', 'Carrera enfocada en la gestión empresarial'),
('Contabilidad', 'Carrera enfocada en la gestión financiera y contable'),
('Mercadeo', 'Carrera enfocada en estrategias de marketing');

-- Insertar algunas materias de ejemplo
INSERT INTO materias (nombre, descripcion, carrera_id) VALUES 
('Programación de Dispositivos Móviles', 'Desarrollo de aplicaciones para dispositivos móviles', 1),
('Bases de Datos', 'Diseño y gestión de bases de datos', 1),
('Ingeniería de Software', 'Metodologías y procesos de desarrollo', 1),
('Contabilidad Financiera', 'Principios contables y reportes financieros', 3),
('Marketing Digital', 'Estrategias de mercadeo en plataformas digitales', 4),
('Gestión de Proyectos', 'Planificación y ejecución de proyectos', 2);