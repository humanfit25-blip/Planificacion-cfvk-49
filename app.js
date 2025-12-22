document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos desde entrenamientos.json
    loadTrainingData();
    
    // Configurar navegación de semanas
    setupWeekNavigation();
    
    // Resaltar día actual
    highlightCurrentDay();
});

// Cargar datos de entrenamientos
async function loadTrainingData() {
    try {
        const response = await fetch('entrenamientos.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo');
        
        const data = await response.json();
        applyTrainingData(data);
    } catch (error) {
        console.log('Usando datos por defecto:', error.message);
        // Mantener datos por defecto si no hay JSON
    }
}

// Aplicar datos del JSON a la interfaz
function applyTrainingData(data) {
    // Actualizar encabezado de semana
    const weekRangeElement = document.getElementById('week-range');
    const weekNumberElement = document.getElementById('week-number');
    
    if (weekRangeElement && weekNumberElement) {
        weekRangeElement.textContent = `05 - 10 Enero 2025`;
        weekNumberElement.textContent = `Semana 1`;
    }
    
    // Actualizar cada día con datos del JSON
    const daysMapping = {
        'monday': 0, 'tuesday': 1, 'wednesday': 2,
        'thursday': 3, 'friday': 4, 'saturday': 5
    };
    
    // Para cada día en el JSON
    data.days.forEach((dayData, index) => {
        const dayKey = Object.keys(daysMapping).find(key => daysMapping[key] === index);
        if (!dayKey) return;
        
        // Actualizar fecha del día
        const dateElement = document.querySelector(`.${dayKey} .date`);
        if (dateElement && dayData.date) {
            dateElement.textContent = dayData.date;
        }
        
        // Actualizar sección CrossFit
        updateTrainingSection(dayKey, 'crossfit', dayData.crossfit);
        
        // Actualizar sección Halterofilia
        updateTrainingSection(dayKey, 'weightlifting', dayData.weightlifting);
        
        // Actualizar sección Endurance
        updateTrainingSection(dayKey, 'endurance', dayData.endurance);
    });
}

// Actualizar una sección específica de entrenamiento
function updateTrainingSection(dayClass, sectionType, sectionData) {
    const sectionElement = document.querySelector(`.${dayClass} .${sectionType} .training-content`);
    if (!sectionElement || !sectionData) return;
    
    // Limpiar contenido existente
    sectionElement.innerHTML = '';
    
    // Construir HTML según la estructura de datos
    let htmlContent = '';
    
    // Para CrossFit
    if (sectionType === 'crossfit') {
        if (sectionData.warmup) {
            htmlContent += `<div class="wod-part"><strong>Warm-up:</strong> ${sectionData.warmup}</div>`;
        }
        if (sectionData.part_a) {
            htmlContent += `<div class="wod-part"><strong>A:</strong> ${sectionData.part_a}</div>`;
        }
        if (sectionData.part_b) {
            htmlContent += `<div class="wod-part"><strong>B:</strong> ${sectionData.part_b}</div>`;
        }
        if (sectionData.part_c) {
            htmlContent += `<div class="wod-part"><strong>C:</strong> ${sectionData.part_c}</div>`;
        }
        if (sectionData.workout) {
            htmlContent += `<div class="wod-workout">${sectionData.workout}</div>`;
        }
    }
    
    // Para Halterofilia
    else if (sectionType === 'weightlifting') {
        if (sectionData.warmup) {
            htmlContent += `<div class="wod-part"><strong>Warm-up:</strong> ${sectionData.warmup}</div>`;
        }
        if (sectionData.part_a) {
            htmlContent += `<div class="wod-part"><strong>A:</strong> ${sectionData.part_a}</div>`;
            if (sectionData.sets_a) {
                htmlContent += `<div class="wod-sets">${sectionData.sets_a}</div>`;
            }
        }
        if (sectionData.part_b) {
            htmlContent += `<div class="wod-part"><strong>B:</strong> ${sectionData.part_b}</div>`;
            if (sectionData.sets_b) {
                htmlContent += `<div class="wod-sets">${sectionData.sets_b}</div>`;
            }
        }
        if (sectionData.accessories) {
            htmlContent += `<div class="wod-part"><strong>Accesorios:</strong> ${sectionData.accessories}</div>`;
        }
        if (sectionData.workout) {
            htmlContent += `<div class="wod-workout">${sectionData.workout}</div>`;
        }
    }
    
    // Para Endurance
    else if (sectionType === 'endurance') {
        if (sectionData.warmup) {
            htmlContent += `<div class="wod-part"><strong>Warm-up:</strong> ${sectionData.warmup}</div>`;
        }
        if (sectionData.workout) {
            htmlContent += `<div class="wod-workout">${sectionData.workout}</div>`;
        }
        if (sectionData.stations) {
            htmlContent += `<div class="wod-stations">${sectionData.stations}</div>`;
        }
        if (sectionData.sets) {
            htmlContent += `<div class="wod-sets">${sectionData.sets}</div>`;
        }
    }
    
    // Insertar el HTML
    sectionElement.innerHTML = htmlContent;
}

// Configurar navegación de semanas (simplificada)
function setupWeekNavigation() {
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', function() {
            // Aquí iría la lógica para cargar la semana anterior
            alert('Funcionalidad de semana anterior - En desarrollo');
        });
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', function() {
            // Aquí iría la lógica para cargar la semana siguiente
            alert('Funcionalidad de semana siguiente - En desarrollo');
        });
    }
}

// Resaltar día actual
function highlightCurrentDay() {
    const today = new Date();
    const todayString = `${today.getDate()} ${getMonthName(today.getMonth())}`;
    
    document.querySelectorAll('.date').forEach(element => {
        if (element.textContent === todayString) {
            const dayCard = element.closest('.day-card');
            if (dayCard) {
                dayCard.style.boxShadow = '0 0 0 2px rgba(255, 94, 58, 0.3)';
                
                // Añadir indicador "HOY"
                const dayHeader = dayCard.querySelector('.day-header h3');
                if (dayHeader && !dayHeader.querySelector('.today-indicator')) {
                    const todayIndicator = document.createElement('span');
                    todayIndicator.className = 'today-indicator';
                    todayIndicator.textContent = 'HOY';
                    todayIndicator.style.cssText = `
                        background: linear-gradient(135deg, #ff5e3a 0%, #ff9500 100%);
                        color: white;
                        padding: 2px 8px;
                        border-radius: 10px;
                        font-size: 0.7rem;
                        font-weight: 700;
                        letter-spacing: 1px;
                        margin-left: 8px;
                    `;
                    dayHeader.appendChild(todayIndicator);
                }
            }
        }
    });
}

// Función auxiliar para nombre del mes
function getMonthName(monthIndex) {
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 
                   'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return months[monthIndex];
}

// Añadir estilos CSS para las nuevas clases
const additionalStyles = `
    .wod-part {
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        border-left: 3px solid var(--accent-lava);
    }
    
    .wod-part strong {
        color: var(--text-light);
    }
    
    .wod-workout {
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-top: 10px;
        font-weight: 500;
    }
    
    .wod-sets, .wod-stations {
        padding: 8px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 4px;
        margin-top: 5px;
        font-size: 0.9rem;
        color: var(--text-gray);
    }
`;

// Inyectar estilos adicionales
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);
