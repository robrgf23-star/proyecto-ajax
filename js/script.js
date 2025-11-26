// Funcionalidades principales del sitio web AJAX
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Proyecto AJAX inicializado correctamente');

    // Smooth scroll para navegación
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Resaltar código al hacer clic
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        block.addEventListener('click', function() {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(this);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Mostrar mensaje de copiado
            try {
                document.execCommand('copy');
                showNotification('Código copiado al portapapeles!', 'success');
            } catch (err) {
                showNotification('Error al copiar el código', 'error');
            }
            
            selection.removeAllRanges();
        });
    });

    // Navegación activa
    function updateActiveNav() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && 
                window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Efecto de aparición suave para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Efecto escalonado para elementos en grid
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('component-card') ||
                    entry.target.classList.contains('practice-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Aplicar efectos a las secciones y cards
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    document.querySelectorAll('.feature-card, .component-card, .practice-card, .workflow-step').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Animación para el loader del hero
    const heroLoader = document.querySelector('.hero .loader');
    if (heroLoader) {
        let rotation = 0;
        setInterval(() => {
            rotation += 2;
            heroLoader.style.transform = `rotate(${rotation}deg)`;
        }, 50);
    }

    // Efecto de typing para el título principal
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Iniciar el efecto después de un breve delay
        setTimeout(typeWriter, 500);
    }

    // Demo adicional: Solicitud AJAX real a una API pública
    const initAPIDemo = () => {
        const demoSection = document.createElement('div');
        demoSection.innerHTML = `
            <div class="section-info">
                <h3>Demo con API Real: JSONPlaceholder</h3>
                <div class="demo-container">
                    <div class="demo-controls">
                        <button id="cargarAPIPosts" class="btn btn-primary">
                            <i class="fas fa-download"></i> Cargar Posts Reales
                        </button>
                        <button id="cargarAPIUsers" class="btn btn-secondary">
                            <i class="fas fa-users"></i> Cargar Usuarios Reales
                        </button>
                    </div>
                    <div class="demo-status">
                        <div id="estadoAPI" class="estado oculto">
                            <div class="loader"></div>
                            <span>Conectando con API...</span>
                        </div>
                    </div>
                    <div class="demo-result">
                        <h4>Resultados de API Real:</h4>
                        <div id="resultadoAPI" class="resultado-container">
                            <p class="mensaje-vacio">Haz clic para cargar datos de una API real</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('#ejemplos').querySelector('article').appendChild(demoSection);

        // Event listeners para el demo de API real
        document.getElementById('cargarAPIPosts').addEventListener('click', cargarPostsReales);
        document.getElementById('cargarAPIUsers').addEventListener('click', cargarUsuariosReales);
    };

    // Función para cargar posts reales desde JSONPlaceholder
    async function cargarPostsReales() {
        const estado = document.getElementById('estadoAPI');
        const resultado = document.getElementById('resultadoAPI');
        
        estado.classList.remove('oculto');
        resultado.innerHTML = '';

        try {
            // Usando Fetch API para obtener datos reales
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const posts = await response.json();
            
            // Mostrar los resultados
            const postsHTML = posts.map(post => `
                <div class="post-item">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">${post.title}</h5>
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">${post.body}</p>
                    <div style="font-size: 0.8rem; color: #666;">
                        <i class="fas fa-hashtag"></i> ID: ${post.id} | 
                        <i class="fas fa-user"></i> User ID: ${post.userId}
                    </div>
                </div>
            `).join('');

            resultado.innerHTML = `
                <h5 style="margin-bottom: 1rem; color: var(--primary-color);">
                    <i class="fas fa-check-circle"></i> Posts cargados exitosamente (${posts.length})
                </h5>
                ${postsHTML}
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(52, 152, 219, 0.1); border-radius: 5px;">
                    <small>
                        <i class="fas fa-info-circle"></i> 
                        Datos cargados desde: <code>https://jsonplaceholder.typicode.com/posts</code>
                    </small>
                </div>
            `;

            showNotification('Posts cargados exitosamente desde la API', 'success');

        } catch (error) {
            resultado.innerHTML = `
                <div class="error-message" style="
                    background: #e74c3c;
                    color: white;
                    padding: 1rem;
                    border-radius: 5px;
                    border-left: 4px solid #c0392b;
                ">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Error:</strong> ${error.message}
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(231, 76, 60, 0.1); border-radius: 5px;">
                    <small>
                        <i class="fas fa-info-circle"></i> 
                        Posible causa: Problemas de conexión o CORS. 
                        Verifica tu conexión a internet.
                    </small>
                </div>
            `;
            showNotification('Error al cargar datos de la API', 'error');
        } finally {
            estado.classList.add('oculto');
        }
    }

    // Función para cargar usuarios reales desde JSONPlaceholder
    async function cargarUsuariosReales() {
        const estado = document.getElementById('estadoAPI');
        const resultado = document.getElementById('resultadoAPI');
        
        estado.classList.remove('oculto');
        resultado.innerHTML = '';

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=4');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const users = await response.json();
            
            const usersHTML = users.map(user => `
                <div class="usuario-item">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">👤</span>
                        <div>
                            <h5 style="margin: 0; color: var(--primary-color);">${user.name}</h5>
                            <p style="margin: 0; font-size: 0.9rem; color: #666;">${user.email}</p>
                        </div>
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">
                        <i class="fas fa-building"></i> ${user.company.name} | 
                        <i class="fas fa-globe"></i> ${user.website}
                    </div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">
                        <i class="fas fa-map-marker-alt"></i> ${user.address.city}, ${user.address.street}
                    </div>
                </div>
            `).join('');

            resultado.innerHTML = `
                <h5 style="margin-bottom: 1rem; color: var(--primary-color);">
                    <i class="fas fa-check-circle"></i> Usuarios cargados exitosamente (${users.length})
                </h5>
                ${usersHTML}
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(52, 152, 219, 0.1); border-radius: 5px;">
                    <small>
                        <i class="fas fa-info-circle"></i> 
                        Datos cargados desde: <code>https://jsonplaceholder.typicode.com/users</code>
                    </small>
                </div>
            `;

            showNotification('Usuarios cargados exitosamente desde la API', 'success');

        } catch (error) {
            resultado.innerHTML = `
                <div class="error-message" style="
                    background: #e74c3c;
                    color: white;
                    padding: 1rem;
                    border-radius: 5px;
                    border-left: 4px solid #c0392b;
                ">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
            showNotification('Error al cargar usuarios de la API', 'error');
        } finally {
            estado.classList.add('oculto');
        }
    }

    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Ejemplos de código interactivos
    const initCodeExamples = () => {
        // Ejemplo de XMLHttpRequest interactivo
        const xhrExample = document.querySelector('pre code');
        if (xhrExample) {
            xhrExample.addEventListener('dblclick', function() {
                const code = this.textContent;
                if (code.includes('XMLHttpRequest')) {
                    showNotification('Doble click detectado en ejemplo XMLHttpRequest', 'info');
                }
            });
        }
    };

    // Inicializar componentes adicionales
    initAPIDemo();
    initCodeExamples();

    // Mostrar información de diagnóstico en consola
    console.log(`
    🌟 Proyecto AJAX - Características Disponibles:
    
    ✅ Navegación suave entre secciones
    ✅ Efectos de aparición al hacer scroll
    ✅ Resaltado y copiado de código
    ✅ Demo con API real (JSONPlaceholder)
    ✅ Notificaciones del sistema
    ✅ Diseño completamente responsive
    ✅ Ejemplos con Fetch API y XMLHttpRequest
    
    💡 Tips:
    - Haz clic en cualquier código para copiarlo
    - Usa los botones del demo para probar AJAX en acción
    - Revisa la consola para más información
    `);

    // Detectar características del navegador
    const browserFeatures = {
        fetch: typeof fetch !== 'undefined',
        promise: typeof Promise !== 'undefined',
        intersectionObserver: typeof IntersectionObserver !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator
    };

    console.log('🔍 Características del navegador:', browserFeatures);

    // Agregar clase de soporte para características modernas
    if (browserFeatures.fetch && browserFeatures.promise) {
        document.documentElement.classList.add('modern-browser');
    } else {
        document.documentElement.classList.add('legacy-browser');
        showNotification('Tu navegador puede no soportar todas las características modernas', 'error');
    }
});

// Funciones globales para ser usadas desde la consola
window.proyectoAJAX = {
    // Probar una solicitud AJAX simple
    testRequest: function(url = 'https://jsonplaceholder.typicode.com/posts/1') {
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('✅ Solicitud exitosa:', data);
                return data;
            })
            .catch(error => {
                console.error('❌ Error en la solicitud:', error);
                throw error;
            });
    },

    // Simular diferentes tipos de solicitudes
    simularSolicitudes: function() {
        console.group('🔧 Simulador de Solicitudes AJAX');
        
        // GET request
        this.testRequest();
        
        // POST request simulado
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                title: 'Test AJAX',
                body: 'Este es un test desde la consola',
                userId: 1
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(response => response.json())
        .then(data => console.log('✅ POST exitoso:', data));
        
        console.groupEnd();
    },

    // Mostrar información del proyecto
    info: function() {
        console.log(`
        📖 Información del Proyecto AJAX:
        
        Nombre: Proyecto AJAX
        Descripción: Guía completa sobre tecnología AJAX
        Tecnologías: HTML5, CSS3, JavaScript (ES6+)
        Características:
          - Fetch API
          - XMLHttpRequest
          - Async/Await
          - Promises
          - Responsive Design
        
        Usa proyectoAJAX.simularSolicitudes() para probar AJAX
        `);
    }
};

// Polyfill para navegadores antiguos (si es necesario)
if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Manejar errores no capturados
window.addEventListener('error', function(e) {
    console.error('❌ Error no capturado:', e.error);
});

// Mostrar mensaje cuando la página está completamente cargada
window.addEventListener('load', function() {
    console.log('🎉 Página completamente cargada y lista');
    
    // Agregar efecto de confeti visual en consola
    setTimeout(() => {
        console.log(`
        ╔══════════════════════════════╗
        ║    🚀 PROYECTO AJAX LISTO    ║
        ║                              ║
        ║  ¡Explora y aprende AJAX!    ║
        ╚══════════════════════════════╝
        `);
    }, 1000);
});