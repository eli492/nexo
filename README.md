# NexoO&M - Plataforma Colaborativa de Recursos Educativos

Una plataforma web donde usuarios de la Universidad O&M pueden compartir y acceder a diversos recursos educativos organizados por carreras y materias.

## Características Principales

- **Gestión de usuarios:** Registro e inicio de sesión
- **Gestión de recursos:** Subida de documentos (PDF, Word, etc.) y enlaces
- **Navegación y búsqueda:** Exploración por carreras y materias
- **Interacción con recursos:** Visualización, descarga y gestión de recursos propios

## Tecnologías Utilizadas

### Frontend
- HTML5/CSS3/JavaScript
- Bootstrap
- EJS (motor de plantillas)

### Backend
- Node.js
- Express.js
- MySQL
- mysql2 (cliente MySQL para Node.js)

### Seguridad
- bcrypt (cifrado de contraseñas)
- express-session (manejo de sesiones)
- express-validator (validación de datos)

### Almacenamiento
- multer (manejo de subida de archivos)

## Requisitos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- XAMPP o cualquier servidor MySQL

## Instalación y Configuración

1. Clonar el repositorio
   ```
   git clone https://github.com/usuario/nexo-o-m.git
   cd nexo-o-m
   ```

2. Instalar dependencias
   ```
   npm install
   ```

3. Configurar variables de entorno
   - Crear un archivo `.env` en la raíz del proyecto (usar `.env.example` como referencia)
   - Configurar las credenciales de la base de datos y otras variables

4. Crear la base de datos
   - Importar el archivo `database.sql` en MySQL/phpMyAdmin
   - O ejecutar el script SQL directamente en la consola de MySQL

5. Iniciar el servidor
   ```
   npm start
   ```
   O en modo desarrollo:
   ```
   npm run dev
   ```

6. Acceder a la aplicación
   - La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
nexo-o-m/
├── config/         # Configuración de conexión a la base de datos
├── controllers/    # Controladores de la aplicación
├── middleware/     # Middlewares personalizados
├── models/         # Modelos para interactuar con la base de datos
├── public/         # Archivos estáticos (CSS, JS, imágenes)
├── routes/         # Rutas de la aplicación
├── views/          # Vistas EJS
├── .env            # Variables de entorno
├── app.js          # Punto de entrada de la aplicación
├── database.sql    # Script SQL para crear la base de datos
└── package.json    # Dependencias y scripts
```

## Despliegue

### Vercel

1. Crear una cuenta en [Vercel](https://vercel.com) si aún no tienes una
2. Instalar la CLI de Vercel:
   ```
   npm install -g vercel
   ```
3. Iniciar sesión desde la terminal:
   ```
   vercel login
   ```
4. Desde la raíz del proyecto, ejecutar:
   ```
   vercel
   ```
5. Seguir las instrucciones de configuración

### Railway

1. Crear una cuenta en [Railway](https://railway.app) si aún no tienes una
2. Crear un nuevo proyecto desde el panel de Railway
3. Conectar con el repositorio de GitHub
4. Configurar las variables de entorno en el panel de Railway
5. Railway automáticamente desplegará la aplicación

## Autor

- **Elisanna María Martínez Sánchez** - Estudiante de la Universidad Dominicana O&M

## Licencia

Este proyecto está bajo la Licencia ISC.