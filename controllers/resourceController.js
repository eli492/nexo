const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const Resource = require('../models/Resource');
const Career = require('../models/Career');
const Subject = require('../models/Subject');

// Mostrar lista de recursos
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.findAll();
    const careers = await Career.findAll();
    const subjects = await Subject.findAll();
    
    res.render('resources/index', {
      title: 'Todos los Recursos - NexoO&M',
      resources,
      careers,
      subjects
    });
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar los recursos'
    });
  }
};

// Mostrar recursos por materia
exports.getResourcesBySubject = async (req, res) => {
  try {
    const materiaId = req.params.id;
    const resources = await Resource.findBySubject(materiaId);
    const subject = await Subject.findById(materiaId);
    const careers = await Career.findAll();
    const subjects = await Subject.findAll();
    
    res.render('resources/index', {
      title: `Recursos de ${subject.nombre} - NexoO&M`,
      resources,
      subject,
      careers,
      subjects
    });
  } catch (error) {
    console.error('Error al obtener recursos por materia:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar los recursos'
    });
  }
};

// Mostrar recursos por carrera
exports.getResourcesByCareer = async (req, res) => {
  try {
    const carreraId = req.params.id;
    const resources = await Resource.findByCareer(carreraId);
    const career = await Career.findById(carreraId);
    const careers = await Career.findAll();
    const subjects = await Subject.findAll();
    
    res.render('resources/index', {
      title: `Recursos de ${career.nombre} - NexoO&M`,
      resources,
      career,
      careers,
      subjects
    });
  } catch (error) {
    console.error('Error al obtener recursos por carrera:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar los recursos'
    });
  }
};

// Mostrar formulario para crear recurso
exports.getCreateResource = async (req, res) => {
  try {
    const careers = await Career.findAll();
    const subjects = await Subject.findAll();
    
    res.render('resources/create', {
      title: 'Subir Recurso - NexoO&M',
      careers,
      subjects,
      errors: [],
      formData: {}
    });
  } catch (error) {
    console.error('Error al cargar formulario de recurso:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el formulario'
    });
  }
};

// Procesar creación de recurso
exports.postCreateResource = async (req, res) => {
    // Verificar si hay error de validación de archivo
    if (req.fileValidationError) {
      try {
        const careers = await Career.findAll();
        const subjects = await Subject.findAll();
        
        return res.render('resources/create', {
          title: 'Subir Recurso - NexoO&M',
          careers,
          subjects,
          errors: [{ msg: req.fileValidationError }],
          formData: req.body
        });
      } catch (error) {
        console.error('Error al volver a cargar formulario:', error);
      }
    }
  
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      try {
        const careers = await Career.findAll();
        const subjects = await Subject.findAll();
        
        return res.render('resources/create', {
          title: 'Subir Recurso - NexoO&M',
          careers,
          subjects,
          errors: errors.array(),
          formData: req.body
        });
      } catch (error) {
        console.error('Error al volver a cargar formulario:', error);
      }
    }
  
    try {
      const { titulo, descripcion, tipo, url, materia_id } = req.body;
      const usuario_id = req.session.user.id;
      
      // Si el tipo es archivo pero no hay archivo, mostrar error
      if (tipo === 'archivo' && !req.file) {
        const careers = await Career.findAll();
        const subjects = await Subject.findAll();
        
        return res.render('resources/create', {
          title: 'Subir Recurso - NexoO&M',
          careers,
          subjects,
          errors: [{ msg: 'Se requiere un archivo para el tipo de recurso seleccionado.' }],
          formData: req.body
        });
      }
      
      // Datos del recurso
      const resourceData = {
        titulo,
        descripcion,
        tipo,
        url: tipo === 'enlace' ? url : null,
        archivo: tipo === 'archivo' && req.file ? req.file.filename : null,
        usuario_id,
        materia_id
      };
      
      // Crear recurso
      await Resource.create(resourceData);
      
      res.redirect('/users/dashboard');
    } catch (error) {
      console.error('Error al crear recurso:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Error al crear el recurso'
      });
    }
  };

// Mostrar detalles de un recurso
exports.getResourceDetails = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return res.status(404).render('error', {
        title: 'Recurso no encontrado',
        message: 'El recurso solicitado no existe'
      });
    }
    
    res.render('resources/detail', {
      title: `${resource.titulo} - NexoO&M`,
      resource
    });
  } catch (error) {
    console.error('Error al obtener detalles del recurso:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar los detalles del recurso'
    });
  }
};

// Mostrar formulario para editar recurso
exports.getEditResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return res.status(404).render('error', {
        title: 'Recurso no encontrado',
        message: 'El recurso solicitado no existe'
      });
    }
    
    // Verificar que el usuario sea el propietario
    if (resource.usuario_id !== req.session.user.id) {
      return res.status(403).render('error', {
        title: 'Acceso denegado',
        message: 'No tienes permiso para editar este recurso'
      });
    }
    
    const careers = await Career.findAll();
    const subjects = await Subject.findAll();
    
    res.render('resources/edit', {
      title: `Editar: ${resource.titulo} - NexoO&M`,
      resource,
      careers,
      subjects,
      errors: []
    });
  } catch (error) {
    console.error('Error al cargar formulario de edición:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar el formulario de edición'
    });
  }
};

// Procesar actualización de recurso
exports.postUpdateResource = async (req, res) => {
  // Verificar errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const resourceId = req.params.id;
      const resource = await Resource.findById(resourceId);
      const careers = await Career.findAll();
      const subjects = await Subject.findAll();
      
      return res.render('resources/edit', {
        title: `Editar: ${resource.titulo} - NexoO&M`,
        resource,
        careers,
        subjects,
        errors: errors.array()
      });
    } catch (error) {
      console.error('Error al volver a cargar formulario de edición:', error);
    }
  }

  try {
    const resourceId = req.params.id;
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return res.status(404).render('error', {
        title: 'Recurso no encontrado',
        message: 'El recurso solicitado no existe'
      });
    }
    
    // Verificar que el usuario sea el propietario
    if (resource.usuario_id !== req.session.user.id) {
      return res.status(403).render('error', {
        title: 'Acceso denegado',
        message: 'No tienes permiso para editar este recurso'
      });
    }
    
    // Actualizar recurso
    await Resource.update(resourceId, {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      materia_id: req.body.materia_id
    });
    
    res.redirect(`/resources/${resourceId}`);
  } catch (error) {
    console.error('Error al actualizar recurso:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al actualizar el recurso'
    });
  }
};

// Eliminar recurso
exports.deleteResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Recurso no encontrado' });
    }
    
    // Verificar que el usuario sea el propietario
    if (resource.usuario_id !== req.session.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este recurso' });
    }
    
    // Si es un archivo, eliminarlo del sistema
    if (resource.tipo === 'archivo' && resource.archivo) {
      const filePath = path.join(__dirname, '../public/uploads', resource.archivo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // Eliminar de la base de datos
    await Resource.delete(resourceId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el recurso' });
  }
};

// Buscar recursos
exports.searchResources = async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.redirect('/resources');
    }
    
    const resources = await Resource.search(query);
    const careers = await Career.findAll();
    const subjects = await Subject.findAll();
    
    res.render('resources/index', {
      title: `Resultados para: ${query} - NexoO&M`,
      resources,
      careers,
      subjects,
      searchQuery: query
    });
  } catch (error) {
    console.error('Error al buscar recursos:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al buscar recursos'
    });
  }
};