// Datos de ejemplo para el demo
const datosDemo = {
    usuarios: [
        {
            id: 1,
            nombre: "Ana García",
            email: "ana@ejemplo.com",
            ciudad: "Madrid",
            avatar: "👩‍💼"
        },
        {
            id: 2,
            nombre: "Carlos López",
            email: "carlos@ejemplo.com",
            ciudad: "Barcelona",
            avatar: "👨‍💻"
        },
        {
            id: 3,
            nombre: "María Rodríguez",
            email: "maria@ejemplo.com",
            ciudad: "Valencia",
            avatar: "👩‍🎨"
        },
        {
            id: 4,
            nombre: "David Martínez",
            email: "david@ejemplo.com",
            ciudad: "Sevilla",
            avatar: "👨‍🔬"
        }
    ],
    posts: [
        {
            id: 1,
            titulo: "Introducción a AJAX",
            contenido: "AJAX revolucionó la forma en que interactúan las aplicaciones web...",
            autor: "Ana García",
            fecha: "2023-10-01",
            likes: 42
        },
        {
            id: 2,
            titulo: "Fetch API vs XMLHttpRequest",
            contenido: "Comparación entre las dos formas principales de hacer solicitudes AJAX...",
            autor: "Carlos López",
            fecha: "2023-10-02",
            likes: 28
        },
        {
            id: 3,
            titulo: "Manejo de Errores en AJAX",
            contenido: "Cómo implementar un manejo robusto de errores en tus solicitudes...",
            autor: "María Rodríguez",
            fecha: "2023-10-03",
            likes: 35
        }
    ]
};

// Clase para manejar las solicitudes AJAX del demo
class AjaxDemo {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('cargarUsuarios').addEventListener('click', () => {
            this.cargarUsuarios();
        });

        document.getElementById('cargarPosts').addEventListener('click', () => {
            this.cargarPosts();
        });

        document.getElementById('cargarError').addEventListener('click', () => {
            this.simularError();
        });
    }

    // Mostrar estado de carga
    mostrarCargando() {
        const estado = document.getElementById('estadoCarga');
        estado.classList.remove('oculto');
    }

    // Ocultar estado de carga
    ocultarCargando() {
        const estado = document.getElementById('estadoCarga');
        estado.classList.add('oculto');
    }

    // Mostrar error
    mostrarError(mensaje) {
        const resultado = document.getElementById('resultadoDemo');
        resultado.innerHTML = `
            <div class="error-message" style="
                background: #e74c3c;
                color: white;
                padding: 1rem;
                border-radius: 5px;
                border-left: 4px solid #c0392b;
            ">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Error:</strong> ${mensaje}
            </div>
        `;
    }

    // Simular una solicitud con delay
    simularSolicitud(datos, delay = 1000, deberiaFallar = false) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (deberiaFallar) {
                    reject(new Error('Error simulado: No se pudo conectar al servidor'));
                } else {
                    resolve(datos);
                }
            }, delay);
        });
    }

    // Cargar usuarios usando Fetch API
    async cargarUsuarios() {
        this.mostrarCargando();
        
        try {
            // Simular solicitud a una API
            const usuarios = await this.simularSolicitud(datosDemo.usuarios, 1500);
            this.mostrarUsuarios(usuarios);
        } catch (error) {
            this.mostrarError(error.message);
        } finally {
            this.ocultarCargando();
        }
    }

    // Cargar posts usando XMLHttpRequest (método tradicional)
    cargarPosts() {
        this.mostrarCargando();
        
        return new Promise((resolve) => {
            // Simular XMLHttpRequest
            setTimeout(() => {
                try {
                    this.mostrarPosts(datosDemo.posts);
                    resolve(datosDemo.posts);
                } catch (error) {
                    this.mostrarError('Error al procesar los posts');
                } finally {
                    this.ocultarCargando();
                }
            }, 1200);
        });
    }

    // Simular un error de red
    async simularError() {
        this.mostrarCargando();
        
        try {
            await this.simularSolicitud(null, 1000, true);
        } catch (error) {
            this.mostrarError(error.message);
        } finally {
            this.ocultarCargando();
        }
    }

    // Mostrar usuarios en la interfaz
    mostrarUsuarios(usuarios) {
        const resultado = document.getElementById('resultadoDemo');
        
        const usuariosHTML = usuarios.map(usuario => `
            <div class="usuario-item">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.5rem;">${usuario.avatar}</span>
                    <div>
                        <h5 style="margin: 0; color: var(--primary-color);">${usuario.nombre}</h5>
                        <p style="margin: 0; font-size: 0.9rem; color: #666;">${usuario.email}</p>
                    </div>
                </div>
                <p style="margin: 0; font-size: 0.9rem;">
                    <i class="fas fa-map-marker-alt"></i> ${usuario.ciudad}
                </p>
            </div>
        `).join('');

        resultado.innerHTML = `
            <h5 style="margin-bottom: 1rem; color: var(--primary-color);">
                <i class="fas fa-users"></i> Usuarios Cargados (${usuarios.length})
            </h5>
            ${usuariosHTML}
        `;
    }

    // Mostrar posts en la interfaz
    mostrarPosts(posts) {
        const resultado = document.getElementById('resultadoDemo');
        
        const postsHTML = posts.map(post => `
            <div class="post-item">
                <h5 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">${post.titulo}</h5>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">${post.contenido}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #666;">
                    <span>
                        <i class="fas fa-user"></i> ${post.autor}
                    </span>
                    <span>
                        <i class="fas fa-calendar"></i> ${post.fecha}
                    </span>
                    <span>
                        <i class="fas fa-heart"></i> ${post.likes} likes
                    </span>
                </div>
            </div>
        `).join('');

        resultado.innerHTML = `
            <h5 style="margin-bottom: 1rem; color: var(--primary-color);">
                <i class="fas fa-file-alt"></i> Posts Cargados (${posts.length})
            </h5>
            ${postsHTML}
        `;
    }
}

// Inicializar el demo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new AjaxDemo();
    
    // Ejemplo adicional: Cargar datos desde un archivo JSON local
    console.log('Demo AJAX inicializado correctamente');
    
    // Mostrar mensaje de bienvenida en la consola
    console.log(`
    🚀 Bienvenido al Proyecto AJAX
    
    Puedes usar las siguientes funciones en la consola:
    
    - demo.cargarUsuarios()   - Cargar lista de usuarios
    - demo.cargarPosts()      - Cargar posts del blog
    - demo.simularError()     - Simular un error de red
    
    ¡Explora el poder de AJAX!
    `);
});