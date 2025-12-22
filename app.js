document.addEventListener('DOMContentLoaded', function() {
    // Configurar la semana actual (22-27 Diciembre 2025)
    setupCurrentWeek();
    
    // Configurar navegación de semanas
    setupWeekNavigation();
    
    // Resaltar día actual
    highlightCurrentDay();
});

// Configurar la semana actual
function setupCurrentWeek() {
    // Fecha forzada: Lunes 22 de Diciembre 2025
    const forcedDate = new Date(2025, 11, 22); // Meses: 0=enero, 11=diciembre
    
    // Actualizar todas las fechas de la semana
    updateWeekDates(forcedDate);
    
    // Actualizar el encabezado de la semana
    updateWeekHeader(forcedDate);
}

// Actualizar las fechas en los días
function updateWeekDates(mondayDate) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const date = new Date(mondayDate);
    
    days.forEach(day => {
        const dateElement = document.getElementById(`date-${day}`);
        if (dateElement) {
            const dayNumber = date.getDate();
            const monthName = getMonthName(date.getMonth());
            
            dateElement.textContent = `${dayNumber} ${monthName}`;
            
            // Avanzar al siguiente día
            date.setDate(date.getDate() + 1);
        }
    });
}

// Actualizar el encabezado de la semana
function updateWeekHeader(mondayDate) {
    const weekRangeElement = document.getElementById('week-range');
    const weekNumberElement = document.getElementById('week-number');
    
    if (!weekRangeElement || !weekNumberElement) return;
    
    const startDate = new Date(mondayDate);
    const endDate = new Date(mondayDate);
    endDate.setDate(endDate.getDate() + 5); // Hasta el sábado
    
    const startDay = startDate.getDate();
    const startMonth = getMonthName(startDate.getMonth());
    const endDay = endDate.getDate();
    const endMonth = getMonthName(endDate.getMonth());
    const year = startDate.getFullYear();
    
    // Formatear rango de fechas
    let dateRange;
    if (startMonth === endMonth) {
        dateRange = `${startDay} - ${endDay} ${startMonth} ${year}`;
    } else {
        dateRange = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    }
    
    weekRangeElement.textContent = dateRange;
    
    // Calcular número de semana
    const weekNumber = getWeekNumber(startDate);
    weekNumberElement.textContent = `Semana ${weekNumber}`;
}

// Obtener nombre del mes
function getMonthName(monthIndex) {
    const months = [
        'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
        'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
    ];
    return months[monthIndex];
}

// Calcular número de semana ISO
function getWeekNumber(date) {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

// Configurar navegación de semanas
function setupWeekNavigation() {
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', function() {
            navigateWeek(-1);
        });
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', function() {
            navigateWeek(1);
        });
    }
    
    // Navegación con teclado
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            navigateWeek(-1);
        } else if (event.key === 'ArrowRight') {
            navigateWeek(1);
        }
    });
}

// Navegar entre semanas
function navigateWeek(direction) {
    // Obtener la fecha actual del encabezado
    const weekRangeText = document.getElementById('week-range').textContent;
    const dateMatch = weekRangeText.match(/(\d{1,2}).*?(\d{1,2})\s+(\w+)\s+(\d{4})/);
    
    if (dateMatch) {
        let startDay = parseInt(dateMatch[1]);
        const monthName = dateMatch[3];
        const year = parseInt(dateMatch[4]);
        
        // Convertir mes a número
        const monthIndex = getMonthIndex(monthName);
        
        // Crear fecha del lunes actual
        const currentMonday = new Date(year, monthIndex, startDay);
        
        // Ajustar según dirección
        currentMonday.setDate(currentMonday.getDate() + (direction * 7));
        
        // Actualizar la vista
        updateWeekDates(currentMonday);
        updateWeekHeader(currentMonday);
        
        // Añadir efecto visual
        addNavigationEffect(direction > 0 ? 'next' : 'prev');
    }
}

// Obtener índice del mes
function getMonthIndex(monthName) {
    const months = {
        'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
        'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11
    };
    return months[monthName] || 0;
}

// Añadir efecto de navegación
function addNavigationEffect(direction) {
    const weekContainer = document.querySelector('.week-container');
    
    // Añadir clase de animación
    weekContainer.classList.add(`slide-${direction}`);
    
    // Remover clase después de la animación
    setTimeout(() => {
        weekContainer.classList.remove(`slide-${direction}`);
    }, 300);
}

// Resaltar día actual
function highlightCurrentDay() {
    const today = new Date();
    const todayString = `${today.getDate()} ${getMonthName(today.getMonth())}`;
    
    // Buscar el elemento con la fecha de hoy
    const dateElements = document.querySelectorAll('.date');
    dateElements.forEach(element => {
        if (element.textContent === todayString) {
            // Resaltar la tarjeta
            const dayCard = element.closest('.day-card');
            if (dayCard) {
                dayCard.style.boxShadow = '0 0 0 2px rgba(255, 94, 58, 0.3), 0 8px 25px rgba(0, 0, 0, 0.4)';
                dayCard.style.borderColor = 'rgba(255, 94, 58, 0.3)';
                
                // Añadir indicador "HOY"
                const dayHeader = dayCard.querySelector('.day-header');
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
                    dayHeader.querySelector('h3').appendChild(todayIndicator);
                }
            }
        }
    });
}

// Añadir estilos CSS para animaciones
const additionalStyles = `
    /* Animaciones de navegación */
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .slide-prev {
        animation: slideInFromRight 0.3s ease-out;
    }
    
    .slide-next {
        animation: slideInFromLeft 0.3s ease-out;
    }
`;

// Inyectar estilos adicionales
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);
