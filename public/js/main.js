// main.js - JavaScript principal para NexoO&M

document.addEventListener('DOMContentLoaded', function() {
    // Auto-cerrar los mensajes de alerta después de 5 segundos
    const alertMessages = document.querySelectorAll('.alert');
    alertMessages.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Activar todos los tooltips de Bootstrap
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Activar todos los popovers de Bootstrap
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    // Animar elementos al hacer scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length) {
        const checkIfInView = () => {
            const windowHeight = window.innerHeight;
            const windowTopPosition = window.scrollY;
            const windowBottomPosition = windowTopPosition + windowHeight;
            
            animateElements.forEach(element => {
                const elementHeight = element.offsetHeight;
                const elementTopPosition = element.offsetTop;
                const elementBottomPosition = elementTopPosition + elementHeight;
                
                // Verificar si el elemento está visible
                if (
                    (elementBottomPosition >= windowTopPosition) &&
                    (elementTopPosition <= windowBottomPosition)
                ) {
                    element.classList.add('fade-in');
                }
            });
        };
        
        window.addEventListener('scroll', checkIfInView);
        // Verificar también al cargar la página
        checkIfInView();
    }

    // Confirmar eliminación de recursos
    const deleteButtons = document.querySelectorAll('.delete-resource');
    if (deleteButtons.length) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.')) {
                    e.preventDefault();
                }
            });
        });
    }

    // Filtrar materias según la carrera seleccionada en formularios
    const carreraSelect = document.getElementById('carrera_id');
    const materiaSelect = document.getElementById('materia_id');
    
    if (carreraSelect && materiaSelect) {
        carreraSelect.addEventListener('change', function() {
            const selectedCarrera = this.value;
            const materiaOptions = materiaSelect.querySelectorAll('option');
            
            materiaOptions.forEach(option => {
                if (option.dataset.carrera === selectedCarrera || option.value === '') {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            });
            
            materiaSelect.value = '';
        });
    }

    // Toggle para tipo de recurso (archivo/enlace)
    const tipoArchivo = document.getElementById('tipoArchivo');
    const tipoEnlace = document.getElementById('tipoEnlace');
    
    if (tipoArchivo && tipoEnlace) {
        const archivoContainer = document.getElementById('archivoContainer');
        const urlContainer = document.getElementById('urlContainer');
        
        function toggleResourceType() {
            if (tipoArchivo.checked) {
                archivoContainer.style.display = 'block';
                urlContainer.style.display = 'none';
            } else {
                archivoContainer.style.display = 'none';
                urlContainer.style.display = 'block';
            }
        }
        
        tipoArchivo.addEventListener('change', toggleResourceType);
        tipoEnlace.addEventListener('change', toggleResourceType);
        
        // Inicializar según el valor seleccionado
        toggleResourceType();
    }
});