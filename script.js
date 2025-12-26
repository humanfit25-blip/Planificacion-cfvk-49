// CONFIGURACIÓN
const JSON_URL = 'entrenamientos.json';
let datosProgramacion = null;

// FUNCIÓN PRINCIPAL - CARGAR PROGRAMACIÓN
async function cargarProgramacion() {
    try {
        const response = await fetch(JSON_URL);
        datosProgramacion = await response.json();
        
        // Actualizar header
        document.getElementById('week-dates').textContent = datosProgramacion.rango_fechas;
        document.getElementById('current-week-text').textContent = `Semana ${datosProgramacion.semana} - ${datosProgramacion.año}`;
        document.getElementById('last-update').textContent = datosProgramacion.ultima_actualizacion || 'Hoy';
        
        // Generar días
        const container = document.getElementById('week-container');
        container.innerHTML = '';
        
        datosProgramacion.dias.forEach((dia, index) => {
            const dayCard = crearDiaCard(dia, index);
            container.appendChild(dayCard);
        });
        
        // Inicializar efectos 3D
        inicializarEfectos3D();
        
        // Crear partículas
        crearParticulas();
        
    } catch (error) {
        console.error('Error cargando JSON:', error);
        mostrarError();
    }
}

// FUNCIÓN PARA CREAR TARJETA DE DÍA
function crearDiaCard(dia, index) {
    const esFestivo = dia.festivo || false;
    
    const dayCard = document.createElement('div');
    dayCard.className = `day-card ${esFestivo ? 'festivo' : ''}`;
    dayCard.style.animationDelay = `${index * 0.1}s`;
    
    // Header del día
    let headerHTML = `
        <div class="day-header ${esFestivo ? 'festivo' : ''}">
            <div class="day-name">${dia.nombre}</div>
            <div class="day-date">${dia.fecha}</div>
    `;
    
    if (esFestivo && dia.festivo_badge) {
        headerHTML += `<div class="festivo-badge">${dia.festivo_badge}</div>`;
    }
    
    headerHTML += '</div>';
    dayCard.innerHTML = headerHTML;
    
    // Programas del día
    if (dia.programas && dia.programas.length > 0) {
        dia.programas.forEach(programa => {
            const programSection = crearProgramaSection(programa, esFestivo);
            dayCard.appendChild(programSection);
        });
    } else {
        // Si no hay programas, mostrar mensaje
        const emptySection = document.createElement('div');
        emptySection.className = 'program-section';
        emptySection.innerHTML = '<p style="text-align: center; padding: 30px;">No hay programación para este día</p>';
        dayCard.appendChild(emptySection);
    }
    
    return dayCard;
}

// FUNCIÓN PARA CREAR SECCIÓN DE PROGRAMA
function crearProgramaSection(programa, esFestivo) {
    const section = document.createElement('div');
    const tipo = programa.tipo || 'crossfit';
    
    section.className = `program-section ${tipo} ${esFestivo ? 'festivo' : ''}`;
    
    if (esFestivo && programa.rest_text) {
        // Día festivo
        section.innerHTML = `
            <div class="festivo-icon">${programa.icono || '🎆'}</div>
            <div class="program-title">${programa.titulo}</div>
            <div class="festivo-text">${programa.rest_text}</div>
            
            ${programa.feedback ? `
                <button class="feedback-btn" onclick="toggleFeedback(this)">
                    <span>FEEDBACK PARA COACHES</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                
                <div class="feedback-content">
                    <strong>📋 FEEDBACK PARA COACHES:</strong>
                    ${programa.feedback}
                </div>
            ` : ''}
        `;
    } else {
        // Día normal con entrenamiento
        let workoutsHTML = '';
        if (programa.workouts && programa.workouts.length > 0) {
            programa.workouts.forEach(workout => {
                if (workout.titulo) {
                    workoutsHTML += `<div class="workout-title">${workout.titulo}</div>`;
                }
                if (workout.detalles) {
                    workoutsHTML += `<div class="workout-details">${workout.detalles}</div>`;
                }
            });
        }
        
        section.innerHTML = `
            <div class="program-title">${programa.titulo}</div>
            <div class="workout-content">
                ${workoutsHTML}
                
                ${programa.feedback ? `
                    <button class="feedback-btn" onclick="toggleFeedback(this)">
                        <span>FEEDBACK PARA COACHES</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    
                    <div class="feedback-content">
                        <strong>📋 FEEDBACK PARA COACHES:</strong>
                        ${programa.feedback}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    return section;
}

// TOGGLE FEEDBACK
function toggleFeedback(button) {
    const feedbackContent = button.nextElementSibling;
    button.classList.toggle('active');
    
    if (feedbackContent.classList.contains('show')) {
        feedbackContent.classList.remove('show');
        setTimeout(() => {
            feedbackContent.style.display = 'none';
        }, 300);
    } else {
        feedbackContent.style.display = 'block';
        setTimeout(() => {
            feedbackContent.classList.add('show');
        }, 10);
    }
}

// INICIALIZAR EFECTOS 3D
function inicializarEfectos3D() {
    document.querySelectorAll('.day-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `translateY(-10px) translateZ(20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) translateZ(0) rotateX(0) rotateY(0)';
        });
    });
}

// CREAR PARTÍCULAS PARA HEADER
function crearParticulas() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const particulasAnteriores = header.querySelector('.particulas');
    if (particulasAnteriores) particulasAnteriores.remove();
    
    const particulas = document.createElement('div');
    particulas.className = 'particulas';
    particulas.style.position = 'absolute';
    particulas.style.top = '0';
    particulas.style.left = '0';
    particulas.style.width = '100%';
    particulas.style.height = '100%';
    particulas.style.pointerEvents = 'none';
    particulas.style.zIndex = '0';
    particulas.style.overflow = 'hidden';
    
    for (let i = 0; i < 15; i++) {
        const particula = document.createElement('div');
        particula.style.position = 'absolute';
        particula.style.width = Math.random() * 4 + 1 + 'px';
        particula.style.height = particula.style.width;
        particula.style.background = `rgba(255, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 0.4 + 0.1})`;
        particula.style.borderRadius = '50%';
        particula.style.top = Math.random() * 100 + '%';
        particula.style.left = Math.random() * 100 + '%';
        particula.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px currentColor`;
        
        const duration = Math.random() * 10 + 10;
        particula.style.animation = `flotarParticula ${duration}s linear infinite`;
        particula.style.animationDelay = Math.random() * 5 + 's';
        
        particulas.appendChild(particula);
    }
    
    if (!document.querySelector('#particulas-animacion')) {
        const estilo = document.createElement('style');
        estilo.id = 'particulas-animacion';
        estilo.textContent = `
            @keyframes flotarParticula {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translate(${Math.random() * 100 - 50}px, -100px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(estilo);
    }
    
    header.appendChild(particulas);
}

// MOSTRAR ERROR
function mostrarError() {
    const container = document.getElementById('week-container');
    container.innerHTML = `
        <div class="error">
            <h3><i class="fas fa-exclamation-triangle"></i> Error cargando la programación</h3>
            <p>No se pudo cargar el archivo <code>entrenamientos.json</code></p>
            <p>Verifica que el archivo exista y tenga formato JSON válido.</p>
            <button class="refresh-btn" onclick="cargarProgramacion()" style="margin-top: 20px;">
                <i class="fas fa-sync-alt"></i> Reintentar
            </button>
        </div>
    `;
}

// MOSTRAR MODAL DE AYUDA
function mostrarAyuda() {
    const modal = document.getElementById('help-modal');
    modal.style.display = 'flex';
}

// CERRAR MODAL
function cerrarModal() {
    const modal = document.getElementById('help-modal');
    modal.style.display = 'none';
}

// CERRAR MODAL AL HACER CLIC FUERA
window.onclick = function(event) {
    const modal = document.getElementById('help-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// CARGAR CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', () => {
    cargarProgramacion();
    
    // Recargar cada 5 minutos
    setInterval(() => {
        if (!document.hidden) {
            fetch(JSON_URL, { method: 'HEAD' })
                .then(response => {})
                .catch(() => {});
        }
    }, 300000);
});

// EXPORTAR PARA USO GLOBAL
window.cargarProgramacion = cargarProgramacion;
window.toggleFeedback = toggleFeedback;
window.mostrarAyuda = mostrarAyuda;
window.cerrarModal = cerrarModal;
