document.addEventListener('DOMContentLoaded', function() {
    // Configurar la semana actual
    setupCurrentWeek();
    
    // Configurar navegación de semanas
    setupWeekNavigation();
    
    // Configurar botones de acción
    setupActionButtons();
    
    // Configurar efectos visuales
    setupVisualEffects();
});

// Configurar la semana actual
function setupCurrentWeek() {
    const today = new Date();
    
    // Ajustar al lunes de la semana actual
    const currentWeekMonday = getMonday(today);
    
    // Actualizar todas las fechas de la semana
    updateWeekDates(currentWeekMonday);
    
    // Actualizar el encabezado de la semana
    updateWeekHeader(currentWeekMonday);
}

// Obtener el lunes de la semana de una fecha dada
function getMonday(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajustar cuando es domingo
    return new Date(date.setDate(diff));
}

// Actualizar las fechas en los días
function updateWeekDates(mondayDate) {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const date = new Date(mondayDate);
    
    days.forEach(day => {
        const dateElement = document.getElementById(`date-${day}`);
        if (dateElement) {
            const dayName = getDayName(date.getDay());
            const dayNumber = date.getDate();
            const monthName = getMonthName(date.getMonth());
            
            dateElement.textContent = `${dayNumber} ${monthName.toUpperCase()}`;
            
            // Añadir tooltip con fecha completa
            dateElement.title = `${dayName}, ${dayNumber} de ${monthName} ${date.getFullYear()}`;
            
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

// Obtener nombre del día
function getDayName(dayIndex) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayIndex];
}

// Obtener nombre del mes
function getMonthName(monthIndex) {
    const months = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
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
    
    // También permitir navegación con teclado
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey || event.metaKey) {
            if (event.key === 'ArrowLeft') {
                navigateWeek(-1);
                event.preventDefault();
            } else if (event.key === 'ArrowRight') {
                navigateWeek(1);
                event.preventDefault();
            }
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
        'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11
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
    }, 500);
}

// Configurar botones de acción
function setupActionButtons() {
    // Botón de imprimir
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            printWeekPlan();
        });
    }
    
    // Botón de compartir
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            shareWeekPlan();
        });
    }
    
    // Botón de acceso coaches
    const coachBtn = document.querySelector('.coach-access');
    if (coachBtn) {
        coachBtn.addEventListener('click', function() {
            alert('Acceso restringido a coaches autorizados. Contacta con el administrador.');
        });
    }
}

// Imprimir planificación semanal
function printWeekPlan() {
    // Guardar estilos originales
    const originalStyles = document.querySelector('link[href="styles.css"]');
    
    // Crear estilos para impresión
    const printStyles = `
        @media print {
            body * {
                visibility: hidden;
            }
            .week-container, .week-container * {
                visibility: visible;
            }
            .week-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                display: grid;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 15px;
                padding: 20px;
            }
            .day-card {
                break-inside: avoid;
                page-break-inside: avoid;
                box-shadow: none !important;
                border: 1px solid #ddd !important;
            }
            .main-header, .main-footer, .action-btn, .nav-btn {
                display: none !important;
            }
        }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);
    
    // Imprimir
    window.print();
    
    // Restaurar estilos
    setTimeout(() => {
        document.head.removeChild(styleSheet);
    }, 100);
}

// Compartir planificación semanal
function shareWeekPlan() {
    if (navigator.share) {
        // Usar Web Share API si está disponible
        navigator.share({
            title: 'Planificación Semanal - CrossFit Vallecas',
            text: 'Mira la planificación de entrenamientos de esta semana en CrossFit Vallecas',
            url: window.location.href,
        })
        .catch(console.error);
    } else {
        // Fallback: copiar al portapapeles
        const weekRange = document.getElementById('week-range').textContent;
        const textToCopy = `Planificación CrossFit Vallecas - ${weekRange}\n\n${window.location.href}`;
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('Enlace copiado al portapapeles');
            })
            .catch(err => {
                console.error('Error al copiar: ', err);
                alert('No se pudo copiar el enlace. Por favor, comparte manualmente.');
            });
    }
}

// Configurar efectos visuales
function setupVisualEffects() {
    // Efecto hover en tarjetas de día
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Resaltar día actual
    highlightCurrentDay();
    
    // Efecto de carga inicial
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// Resaltar día actual
function highlightCurrentDay() {
    const today = new Date();
    const todayString = `${today.getDate()} ${getMonthName(today.getMonth()).toUpperCase()}`;
    
    // Buscar el elemento con la fecha de hoy
    const dateElements = document.querySelectorAll('.date');
    dateElements.forEach(element => {
        if (element.textContent === todayString) {
            // Resaltar la tarjeta
            const dayCard = element.closest('.day-card');
            if (dayCard) {
                dayCard.style.boxShadow = '0 0 0 3px rgba(255, 94, 58, 0.3), 0 10px 30px rgba(0, 0, 0, 0.4)';
                dayCard.style.borderColor = 'rgba(255, 94, 58, 0.5)';
                
                // Añadir indicador "HOY"
                const dayHeader = dayCard.querySelector('.day-header');
                const todayIndicator = document.createElement('span');
                todayIndicator.className = 'today-indicator';
                todayIndicator.textContent = 'HOY';
                todayIndicator.style.cssText = `
                    background: linear-gradient(135deg, #ff5e3a 0%, #ff9500 100%);
                    color: white;
                    padding: 2px 10px;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    margin-left: 10px;
                `;
                dayHeader.appendChild(todayIndicator);
            }
        }
    });
}

// Añadir estilos CSS para animaciones
const additionalStyles = `
    /* Animaciones */
    @keyframes slideInFromLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .slide-prev {
        animation: slideInFromRight 0.5s ease-out;
    }
    
    .slide-next {
        animation: slideInFromLeft 0.5s ease-out;
    }
    
    body.loaded .day-card {
        animation: slideInFromLeft 0.6s ease-out backwards;
    }
    
    body.loaded .day-card:nth-child(2) { animation-delay: 0.1s; }
    body.loaded .day-card:nth-child(3) { animation-delay: 0.2s; }
    body.loaded .day-card:nth-child(4) { animation-delay: 0.3s; }
    body.loaded .day-card:nth-child(5) { animation-delay: 0.4s; }
    body.loaded .day-card:nth-child(6) { animation-delay: 0.5s; }
    
    /* Tooltip personalizado */
    .date:hover::after {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 1000;
        margin-bottom: 5px;
    }
    
    .date {
        position: relative;
        cursor: help;
    }
`;

// Inyectar estilos adicionales
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);
