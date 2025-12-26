// Program Page JavaScript

class ProgramPage {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentDay = 'all';
        this.filters = {
            day: 'all',
            type: 'all',
            venue: 'all',
            age: 'all',
            search: '',
            sort: 'time'
        };
        
        this.init();
    }

    async init() {
        console.log('Инициализация ProgramPage...');
        
        // Загружаем события
        await this.loadEvents();
        
        // Проверяем, что данные загружены
        if (this.events.length === 0) {
            console.error('События не загружены! Проверьте ../data/events.json.');
            return;
        }
        
        console.log('События загружены:', this.events.length);
        console.log('Отфильтрованные события:', this.filteredEvents.length);
        
        // Настраиваем слушатели
        this.setupEventListeners();
        
        // Загружаем популярность
        this.loadPopularity();
        
        // Отображаем события после загрузки
        this.renderEvents();
        
        // Слушаем изменения в localStorage для обновления счетчика
        this.setupStorageListener();
    }

    async loadEvents() {
        try {
            const response = await fetch('../data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || !data.events) {
                console.error('Данные в ../data/events.json не найдены или пусты!');
                this.events = [];
                this.filteredEvents = [];
                return;
            }
            
            console.log('Данные загружены из ../data/events.json');
            console.log('Количество событий:', data.events.length);
            
            this.events = data.events;
            this.filteredEvents = [...this.events];
            
            console.log('Загружено событий:', this.events.length);
            console.log('Отфильтрованных событий:', this.filteredEvents.length);
            
            // Сортируем события
            if (this.filteredEvents.length > 0) {
                this.sortEvents();
                console.log('События отсортированы');
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            console.error('Стек ошибки:', error.stack);
            this.events = [];
            this.filteredEvents = [];
        }
    }

    loadPopularity() {
        // Счетчик теперь основан на реальном количестве добавлений в планировщике
        this.updatePopularityFromSchedule();
    }

    updatePopularityFromSchedule() {
        // Получаем расписание из localStorage
        const schedule = JSON.parse(localStorage.getItem('personalSchedule') || '[]');
        
        // Подсчитываем количество добавлений каждого мероприятия
        const popularityCount = {};
        schedule.forEach(event => {
            if (event.id) {
                popularityCount[event.id] = (popularityCount[event.id] || 0) + 1;
            }
        });
        
        // Обновляем популярность для каждого мероприятия
        this.events.forEach(event => {
            event.popularity = popularityCount[event.id] || 0;
        });
        
        // Обновляем отображение всех счетчиков
        this.updateAllPopularityDisplays();
    }

    updateAllPopularityDisplays() {
        this.events.forEach(event => {
            this.updatePopularityDisplay(event.id);
        });
    }

    updatePopularityDisplay(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const card = document.querySelector(`.event-card[data-id="${eventId}"]`);
        if (card) {
            const popularityEl = card.querySelector('.event-card__popularity');
            if (popularityEl) {
                const count = event.popularity || 0;
                popularityEl.innerHTML = `<span>❤️</span> ${count}`;
            }
        }
    }

    setupStorageListener() {
        // Слушаем изменения в localStorage (когда планировщик обновляется в другой вкладке)
        window.addEventListener('storage', (e) => {
            if (e.key === 'personalSchedule') {
                this.updatePopularityFromSchedule();
            }
        });

        // Обновляем счетчики при фокусе на странице (когда пользователь возвращается с планировщика)
        window.addEventListener('focus', () => {
            this.updatePopularityFromSchedule();
        });

        // Также обновляем при видимости страницы
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updatePopularityFromSchedule();
            }
        });
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Filter selects
        const dayFilter = document.getElementById('day-filter');
        const typeFilter = document.getElementById('type-filter');
        const venueFilter = document.getElementById('venue-filter');
        const ageFilter = document.getElementById('age-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (dayFilter) {
            dayFilter.addEventListener('change', (e) => {
                this.filters.day = e.target.value;
                this.currentDay = e.target.value;
                this.updateDayTabs();
                this.applyFilters();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.applyFilters();
            });
        }

        if (venueFilter) {
            venueFilter.addEventListener('change', (e) => {
                this.filters.venue = e.target.value;
                this.applyFilters();
            });
        }

        if (ageFilter) {
            ageFilter.addEventListener('change', (e) => {
                this.filters.age = e.target.value;
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Reset filters button
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Day tabs
        const dayTabs = document.querySelectorAll('.program-days__tab');
        dayTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const day = e.currentTarget.dataset.day;
                this.currentDay = day;
                this.filters.day = day === 'all' ? 'all' : day;
                this.updateDayTabs();
                this.applyFilters();
            });
        });

        // Modal
        const modal = document.getElementById('event-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
                this.closeModal();
            }
        });
    }

    updateDayTabs() {
        const tabs = document.querySelectorAll('.program-days__tab');
        tabs.forEach(tab => {
            const day = tab.dataset.day;
            if (day === this.currentDay) {
                tab.classList.add('program-days__tab--active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('program-days__tab--active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Update day filter select
        const dayFilter = document.getElementById('day-filter');
        if (dayFilter) {
            dayFilter.value = this.filters.day;
        }
    }

    resetFilters() {
        this.filters = {
            day: 'all',
            type: 'all',
            venue: 'all',
            age: 'all',
            search: '',
            sort: 'time'
        };
        this.currentDay = 'all';

        // Reset form elements
        document.getElementById('search-input').value = '';
        document.getElementById('day-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        document.getElementById('venue-filter').value = 'all';
        document.getElementById('age-filter').value = 'all';
        document.getElementById('sort-filter').value = 'time';

        this.updateDayTabs();
        this.applyFilters();
    }

    applyFilters() {
        this.filteredEvents = this.events.filter(event => {
            // Day filter
            if (this.filters.day !== 'all' && event.day.toString() !== this.filters.day) {
                return false;
            }

            // Type filter
            if (this.filters.type !== 'all' && event.type !== this.filters.type) {
                return false;
            }

            // Venue filter
            if (this.filters.venue !== 'all' && !event.venue.includes(this.filters.venue)) {
                return false;
            }

            // Age filter
            if (this.filters.age !== 'all' && event.ageRestriction !== this.filters.age) {
                return false;
            }

            // Search filter
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                const titleMatch = event.title.toLowerCase().includes(searchLower);
                const participantMatch = event.participants.some(p => 
                    p.name.toLowerCase().includes(searchLower)
                );
                const genreMatch = event.genre.toLowerCase().includes(searchLower);
                
                if (!titleMatch && !participantMatch && !genreMatch) {
                    return false;
                }
            }

            return true;
        });

        // Sort events
        this.sortEvents();
        this.renderEvents();
    }

    sortEvents() {
        if (this.filters.sort === 'popularity') {
            this.filteredEvents.sort((a, b) => {
                const popA = a.popularity || 0;
                const popB = b.popularity || 0;
                if (popA !== popB) {
                    return popB - popA;
                }
                // If popularity is equal, sort by time
                return this.compareTime(a, b);
            });
        } else {
            // Sort by time (default)
            this.filteredEvents.sort((a, b) => {
                if (a.day !== b.day) {
                    return a.day - b.day;
                }
                return this.compareTime(a, b);
            });
        }
    }

    compareTime(a, b) {
        const timeA = this.timeToMinutes(a.startTime);
        const timeB = this.timeToMinutes(b.startTime);
        return timeA - timeB;
    }

    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    renderEvents() {
        const grid = document.getElementById('events-grid');
        const emptyMessage = document.getElementById('empty-message');

        if (!grid) {
            console.error('Элемент events-grid не найден! Проверьте HTML.');
            return;
        }

        console.log('Рендеринг событий. Количество отфильтрованных:', this.filteredEvents.length);
        console.log('Всего событий:', this.events.length);

        if (this.filteredEvents.length === 0) {
            console.warn('Нет событий для отображения!');
            grid.innerHTML = '';
            if (emptyMessage) {
                emptyMessage.style.display = 'block';
            }
            return;
        }

        if (emptyMessage) {
            emptyMessage.style.display = 'none';
        }

        try {
            const cardsHTML = this.filteredEvents.map(event => {
                try {
                    const card = this.createEventCard(event);
                    if (!card || card.trim() === '') {
                        console.warn('Пустая карточка для события:', event.id);
                    }
                    return card;
                } catch (error) {
                    console.error('Ошибка создания карточки события:', error, event);
                    return '';
                }
            }).filter(card => card.trim() !== '').join('');
            
            console.log('Сгенерировано HTML карточек, длина:', cardsHTML.length);
            grid.innerHTML = cardsHTML;
            
            // Проверяем, что HTML действительно вставлен
            if (grid.children.length === 0) {
                console.error('HTML вставлен, но элементы не созданы!');
            } else {
                console.log('Успешно создано элементов:', grid.children.length);
            }
            
            // Обновляем счетчики популярности после рендеринга
            this.updateAllPopularityDisplays();
        } catch (error) {
            console.error('Ошибка рендеринга событий:', error);
        }

        // Add event listeners to buttons
        this.attachEventListeners();
    }

    createEventCard(event) {
        const dayLabels = {
            1: 'День 1 (15 сентября)',
            2: 'День 2 (16 сентября)',
            3: 'День 3 (17 сентября)'
        };

        return `
            <article class="event-card" data-type="${event.type}" data-id="${event.id}" itemscope itemtype="https://schema.org/Event">
                <div class="event-card__popularity" title="Добавлено в расписание">
                    <span>❤️</span> ${event.popularity || 0}
                </div>
                <span class="event-card__type">${event.typeLabel}</span>
                <h2 class="event-card__title" itemprop="name">${event.title}</h2>
                <div class="event-card__time">
                    <span class="event-card__day">${dayLabels[event.day]}</span>
                    <time datetime="2026-09-${14 + event.day}T${event.startTime}" itemprop="startDate">
                        ${event.startTime}–${event.endTime}
                    </time>
                </div>
                <div class="event-card__venue">
                    <span>📍</span>
                    <span itemprop="location">${event.venue}</span>
                </div>
                <div class="event-card__age">${event.ageRestriction}</div>
                <div class="event-card__actions">
                    <button class="btn btn--primary event-card__btn" data-action="details" data-id="${event.id}">
                        Подробнее
                    </button>
                    <button class="btn btn--secondary event-card__btn" data-action="add" data-id="${event.id}">
                        Добавить в расписание
                    </button>
                </div>
            </article>
        `;
    }

    attachEventListeners() {
        const buttons = document.querySelectorAll('.event-card__btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const eventId = parseInt(e.currentTarget.dataset.id);

                if (action === 'details') {
                    this.openModal(eventId);
                } else if (action === 'add') {
                    this.addToSchedule(eventId);
                }
            });
        });
    }

    openModal(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const modal = document.getElementById('event-modal');
        const modalBody = document.getElementById('modal-body');

        if (!modal || !modalBody) return;

        const dayLabels = {
            1: '15 сентября',
            2: '16 сентября',
            3: '17 сентября'
        };

        const typeColors = {
            'author-meeting': { bg: '#E3F2FD', color: '#1976D2' },
            'book-presentation': { bg: '#E8F5E9', color: '#388E3C' },
            'workshop': { bg: '#FFF9C4', color: '#F57C00' },
            'discussion': { bg: '#F3E5F5', color: '#7B1FA2' },
            'children': { bg: '#FFE0B2', color: '#E65100' }
        };

        const typeStyle = typeColors[event.type] || { bg: '#F5F5F5', color: '#666' };

        modalBody.innerHTML = `
            <h2 class="modal__title" id="modal-title" itemprop="name">${event.title}</h2>
            <span class="modal__type" style="background-color: ${typeStyle.bg}; color: ${typeStyle.color};">
                ${event.typeLabel}
            </span>
            <p class="modal__description" itemprop="description">${event.description}</p>
            <div class="modal__info">
                <div class="modal__info-item">
                    <span class="modal__info-label">День</span>
                    <span class="modal__info-value">${dayLabels[event.day]}</span>
                </div>
                <div class="modal__info-item">
                    <span class="modal__info-label">Время</span>
                    <time class="modal__info-value" datetime="2026-09-${14 + event.day}T${event.startTime}" itemprop="startDate">
                        ${event.startTime}–${event.endTime}
                    </time>
                </div>
                <div class="modal__info-item">
                    <span class="modal__info-label">Площадка</span>
                    <span class="modal__info-value" itemprop="location">${event.venue}</span>
                </div>
                <div class="modal__info-item">
                    <span class="modal__info-label">Возраст</span>
                    <span class="modal__info-value">${event.ageRestriction}</span>
                </div>
                <div class="modal__info-item">
                    <span class="modal__info-label">Жанр</span>
                    <span class="modal__info-value">${event.genre}</span>
                </div>
                <div class="modal__info-item">
                    <span class="modal__info-label">Вместимость</span>
                    <span class="modal__info-value">${event.capacity} мест</span>
                </div>
                <div class="modal__info-item">
                    <span class="modal__info-label">Стоимость</span>
                    <span class="modal__info-value">${event.price}</span>
                </div>
            </div>
            ${event.participants.length > 0 ? `
                <div class="modal__participants">
                    <h3 class="modal__participants-title">Участники</h3>
                    ${event.participants.map(participant => `
                        <div class="modal__participant">
                            <div class="modal__participant-name">${participant.name}</div>
                            <div class="modal__participant-role">${participant.role}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="modal__actions">
                <button class="btn btn--primary" data-action="add" data-id="${event.id}">
                    Добавить в расписание
                </button>
            </div>
        `;

        // Attach listener to modal add button
        const addBtn = modalBody.querySelector('[data-action="add"]');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.addToSchedule(eventId);
                this.closeModal();
            });
        }

        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    addToSchedule(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Get current schedule from localStorage
        let schedule = JSON.parse(localStorage.getItem('personalSchedule') || '[]');
        
        // Add event to schedule (разрешаем добавлять несколько раз)
        schedule.push(event);
        localStorage.setItem('personalSchedule', JSON.stringify(schedule));

        // Обновляем счетчик популярности на основе реального количества в расписании
        this.updatePopularityFromSchedule();

        // Show success message
        alert(`"${event.title}" добавлено в ваше расписание!`);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM готов, инициализируем ProgramPage...');
    
    // Проверяем наличие элемента events-grid
    const grid = document.getElementById('events-grid');
    if (!grid) {
        console.error('КРИТИЧЕСКАЯ ОШИБКА: Элемент events-grid не найден в DOM!');
        console.log('Проверьте, что HTML содержит элемент с id="events-grid"');
    } else {
        console.log('Элемент events-grid найден:', grid);
    }
    
    try {
        const programPage = new ProgramPage();
        console.log('ProgramPage создан:', programPage);
    } catch (error) {
        console.error('Ошибка при инициализации ProgramPage:', error);
        console.error('Стек ошибки:', error.stack);
    }
});

// Mobile navigation toggle (if needed)
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');

if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('nav__list--open');
        navToggle.setAttribute('aria-expanded', isOpen);
    });
}

