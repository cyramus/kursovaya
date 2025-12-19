// Program Page JavaScript

// Встроенные данные мероприятий
const EVENTS_DATA = {
  "events": [
    {
      "id": 1,
      "title": "Встреча с Анной Петровой",
      "type": "author-meeting",
      "typeLabel": "Встреча с автором",
      "day": 1,
      "startTime": "10:00",
      "endTime": "11:30",
      "venue": "Городской культурный центр, Главный зал",
      "ageRestriction": "16+",
      "description": "Анна Петрова расскажет о своём творческом пути, поделится секретами писательского мастерства и ответит на вопросы читателей. Встреча будет посвящена её новому роману «Город и время».",
      "participants": [
        {
          "name": "Анна Петрова",
          "role": "Писательница, лауреат литературной премии"
        }
      ],
      "genre": "Современная проза",
      "capacity": 200,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 2,
      "title": "Презентация книги «Город и время»",
      "type": "book-presentation",
      "typeLabel": "Презентация книги",
      "day": 1,
      "startTime": "12:00",
      "endTime": "13:00",
      "venue": "Центральная библиотека, Читальный зал",
      "ageRestriction": "16+",
      "description": "Официальная презентация нового романа Анны Петровой «Город и время». Автор расскажет о процессе создания книги, её героях и идеях.",
      "participants": [
        {
          "name": "Анна Петрова",
          "role": "Автор книги"
        },
        {
          "name": "Иван Смирнов",
          "role": "Литературный критик"
        }
      ],
      "genre": "Современная проза",
      "capacity": 150,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 3,
      "title": "Мастер-класс «Как писать для детей»",
      "type": "workshop",
      "typeLabel": "Мастер-класс",
      "day": 1,
      "startTime": "14:00",
      "endTime": "16:00",
      "venue": "Центральная библиотека, Зал мастер-классов",
      "ageRestriction": "18+",
      "description": "Практический мастер-класс для начинающих детских писателей. Участники узнают о специфике детской литературы, работе с редакторами и издательствами.",
      "participants": [
        {
          "name": "Мария Волкова",
          "role": "Детский писатель и иллюстратор"
        }
      ],
      "genre": "Детская литература",
      "capacity": 50,
      "price": "500 руб.",
      "popularity": 0
    },
    {
      "id": 4,
      "title": "Дискуссия «Современная поэзия: традиции и новаторство»",
      "type": "discussion",
      "typeLabel": "Дискуссия",
      "day": 1,
      "startTime": "16:00",
      "endTime": "17:30",
      "venue": "Драматический театр, Большая сцена",
      "ageRestriction": "16+",
      "description": "Живая дискуссия о современной поэзии с участием известных поэтов и критиков. Обсуждение актуальных тенденций, влияния классики и новых форм выражения.",
      "participants": [
        {
          "name": "Дмитрий Соколов",
          "role": "Поэт и переводчик"
        },
        {
          "name": "Елена Кузнецова",
          "role": "Литературный критик"
        },
        {
          "name": "Алексей Морозов",
          "role": "Поэт"
        }
      ],
      "genre": "Поэзия",
      "capacity": 300,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 5,
      "title": "Детская программа «Сказки на ночь»",
      "type": "children",
      "typeLabel": "Детская программа",
      "day": 1,
      "startTime": "18:00",
      "endTime": "19:00",
      "venue": "Парк \"Литературный\", Детская площадка",
      "ageRestriction": "3+",
      "description": "Интерактивное чтение сказок для детей. Мария Волкова прочитает отрывки из своих книг, проведёт викторину и раздаст автографы.",
      "participants": [
        {
          "name": "Мария Волкова",
          "role": "Детский писатель"
        }
      ],
      "genre": "Детская литература",
      "capacity": 100,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 6,
      "title": "Встреча с Иваном Смирновым",
      "type": "author-meeting",
      "typeLabel": "Встреча с автором",
      "day": 2,
      "startTime": "10:00",
      "endTime": "11:30",
      "venue": "Драматический театр, Большая сцена",
      "ageRestriction": "16+",
      "description": "Встреча с автором исторических романов. Иван Смирнов расскажет о работе с историческими источниками и создании достоверных персонажей.",
      "participants": [
        {
          "name": "Иван Смирнов",
          "role": "Писатель, историческая проза"
        }
      ],
      "genre": "Историческая проза",
      "capacity": 250,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 7,
      "title": "Презентация детективной серии",
      "type": "book-presentation",
      "typeLabel": "Презентация книги",
      "day": 2,
      "startTime": "12:00",
      "endTime": "13:00",
      "venue": "Центральная библиотека, Конференц-зал",
      "ageRestriction": "18+",
      "description": "Презентация новой детективной серии Елены Кузнецовой. Автор расскажет о создании интригующих сюжетов и работе над характерами героев.",
      "participants": [
        {
          "name": "Елена Кузнецова",
          "role": "Автор детективов"
        }
      ],
      "genre": "Детективная литература",
      "capacity": 120,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 8,
      "title": "Мастер-класс «Создание фантастических миров»",
      "type": "workshop",
      "typeLabel": "Мастер-класс",
      "day": 2,
      "startTime": "14:00",
      "endTime": "16:00",
      "venue": "Драматический театр, Малый зал",
      "ageRestriction": "16+",
      "description": "Практический мастер-класс по созданию фантастических вселенных. Участники научатся строить логичные миры, разрабатывать магические системы и создавать убедительных персонажей.",
      "participants": [
        {
          "name": "Алексей Морозов",
          "role": "Писатель-фантаст"
        }
      ],
      "genre": "Фантастика",
      "capacity": 40,
      "price": "600 руб.",
      "popularity": 0
    },
    {
      "id": 9,
      "title": "Дискуссия «Женская проза в современной литературе»",
      "type": "discussion",
      "typeLabel": "Дискуссия",
      "day": 2,
      "startTime": "16:00",
      "endTime": "17:30",
      "venue": "Центральная библиотека, Читальный зал",
      "ageRestriction": "16+",
      "description": "Обсуждение места женской прозы в современной литературе. Участники поговорят о темах, стилях и влиянии женского взгляда на литературный процесс.",
      "participants": [
        {
          "name": "Анна Петрова",
          "role": "Писательница"
        },
        {
          "name": "Елена Кузнецова",
          "role": "Писательница"
        },
        {
          "name": "Ольга Новикова",
          "role": "Писательница, критик"
        }
      ],
      "genre": "Современная проза",
      "capacity": 180,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 10,
      "title": "Детская программа «Рисуем сказку»",
      "type": "children",
      "typeLabel": "Детская программа",
      "day": 2,
      "startTime": "18:00",
      "endTime": "19:30",
      "venue": "Парк \"Литературный\", Детская площадка",
      "ageRestriction": "5+",
      "description": "Мастер-класс по иллюстрации для детей. Мария Волкова научит детей создавать иллюстрации к сказкам и расскажет о работе иллюстратора.",
      "participants": [
        {
          "name": "Мария Волкова",
          "role": "Иллюстратор и писатель"
        }
      ],
      "genre": "Детская литература",
      "capacity": 80,
      "price": "300 руб.",
      "popularity": 0
    },
    {
      "id": 11,
      "title": "Встреча с Ольгой Новиковой",
      "type": "author-meeting",
      "typeLabel": "Встреча с автором",
      "day": 3,
      "startTime": "10:00",
      "endTime": "11:30",
      "venue": "Центральная библиотека, Читальный зал",
      "ageRestriction": "16+",
      "description": "Встреча с автором современной прозы. Ольга Новикова расскажет о своих произведениях, работе над стилем и влиянии современности на литературу.",
      "participants": [
        {
          "name": "Ольга Новикова",
          "role": "Писательница, современная проза"
        }
      ],
      "genre": "Современная проза",
      "capacity": 150,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 12,
      "title": "Презентация фантастической трилогии",
      "type": "book-presentation",
      "typeLabel": "Презентация книги",
      "day": 3,
      "startTime": "12:00",
      "endTime": "13:00",
      "venue": "Драматический театр, Большая сцена",
      "ageRestriction": "16+",
      "description": "Презентация завершающей книги фантастической трилогии Алексея Морозова. Автор расскажет о создании масштабного произведения и планах на будущее.",
      "participants": [
        {
          "name": "Алексей Морозов",
          "role": "Автор фантастики"
        }
      ],
      "genre": "Фантастика",
      "capacity": 300,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 13,
      "title": "Мастер-класс «Секреты детективного сюжета»",
      "type": "workshop",
      "typeLabel": "Мастер-класс",
      "day": 3,
      "startTime": "14:00",
      "endTime": "16:00",
      "venue": "Центральная библиотека, Зал мастер-классов",
      "ageRestriction": "18+",
      "description": "Практический мастер-класс по созданию детективных сюжетов. Участники научатся строить интригу, создавать подозреваемых и раскрывать тайны.",
      "participants": [
        {
          "name": "Елена Кузнецова",
          "role": "Автор детективов"
        }
      ],
      "genre": "Детективная литература",
      "capacity": 45,
      "price": "700 руб.",
      "popularity": 0
    },
    {
      "id": 14,
      "title": "Дискуссия «Историческая проза: факт и вымысел»",
      "type": "discussion",
      "typeLabel": "Дискуссия",
      "day": 3,
      "startTime": "16:00",
      "endTime": "17:30",
      "venue": "Драматический театр, Большая сцена",
      "ageRestriction": "16+",
      "description": "Обсуждение баланса между исторической достоверностью и художественным вымыслом в исторической прозе. Участники поделятся опытом работы с источниками.",
      "participants": [
        {
          "name": "Иван Смирнов",
          "role": "Автор исторической прозы"
        },
        {
          "name": "Анна Петрова",
          "role": "Писательница"
        }
      ],
      "genre": "Историческая проза",
      "capacity": 250,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 15,
      "title": "Детская программа «Читаем вместе»",
      "type": "children",
      "typeLabel": "Детская программа",
      "day": 3,
      "startTime": "18:00",
      "endTime": "19:00",
      "venue": "Парк \"Литературный\", Детская площадка",
      "ageRestriction": "4+",
      "description": "Семейное чтение с участием родителей и детей. Мария Волкова проведёт интерактивное чтение и обсуждение детских книг.",
      "participants": [
        {
          "name": "Мария Волкова",
          "role": "Детский писатель"
        }
      ],
      "genre": "Детская литература",
      "capacity": 120,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 16,
      "title": "Автограф-сессия с популярными авторами",
      "type": "author-meeting",
      "typeLabel": "Встреча с автором",
      "day": 3,
      "startTime": "19:00",
      "endTime": "20:00",
      "venue": "Парк \"Литературный\", Книжная ярмарка",
      "ageRestriction": "0+",
      "description": "Большая автограф-сессия с участием всех авторов фестиваля. Возможность получить автограф и пообщаться с любимыми писателями.",
      "participants": [
        {
          "name": "Анна Петрова",
          "role": "Писательница"
        },
        {
          "name": "Дмитрий Соколов",
          "role": "Поэт"
        },
        {
          "name": "Мария Волкова",
          "role": "Детский писатель"
        }
      ],
      "genre": "Разное",
      "capacity": 500,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 17,
      "title": "Камерная встреча с Дмитрием Соколовым",
      "type": "author-meeting",
      "typeLabel": "Встреча с автором",
      "day": 1,
      "startTime": "19:30",
      "endTime": "20:30",
      "venue": "Книжный магазин \"Чаша\"",
      "ageRestriction": "16+",
      "description": "Интимная встреча с поэтом Дмитрием Соколовым в уютной атмосфере книжного магазина. Чтение стихов, обсуждение творчества и возможность задать вопросы.",
      "participants": [
        {
          "name": "Дмитрий Соколов",
          "role": "Поэт и переводчик"
        }
      ],
      "genre": "Поэзия",
      "capacity": 25,
      "price": "Бесплатно",
      "popularity": 0
    },
    {
      "id": 18,
      "title": "Камерная встреча с Ольгой Новиковой",
      "type": "author-meeting",
      "typeLabel": "Встреча с автором",
      "day": 2,
      "startTime": "19:30",
      "endTime": "20:30",
      "venue": "Книжный магазин \"Чаша\"",
      "ageRestriction": "18+",
      "description": "Неформальная встреча с писательницей Ольгой Новиковой. Обсуждение современной прозы, творческого процесса и литературных тенденций.",
      "participants": [
        {
          "name": "Ольга Новикова",
          "role": "Писательница, современная проза"
        }
      ],
      "genre": "Современная проза",
      "capacity": 25,
      "price": "Бесплатно",
      "popularity": 0
    }
  ]
};

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

    init() {
        console.log('Инициализация ProgramPage...');
        console.log('EVENTS_DATA доступна:', typeof EVENTS_DATA !== 'undefined');
        
        // Загружаем события
        this.loadEvents();
        
        // Проверяем, что данные загружены
        if (this.events.length === 0) {
            console.error('События не загружены! Проверьте EVENTS_DATA.');
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
    }

    loadEvents() {
        try {
            // Используем встроенные данные вместо fetch
            if (!EVENTS_DATA || !EVENTS_DATA.events) {
                console.error('EVENTS_DATA не определена или пуста!');
                this.events = [];
                this.filteredEvents = [];
                return;
            }
            
            console.log('EVENTS_DATA.events:', EVENTS_DATA.events);
            console.log('Количество событий в EVENTS_DATA:', EVENTS_DATA.events.length);
            
            this.events = EVENTS_DATA.events;
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
        const saved = localStorage.getItem('eventPopularity');
        if (saved) {
            const popularity = JSON.parse(saved);
            this.events.forEach(event => {
                if (popularity[event.id]) {
                    event.popularity = popularity[event.id];
                }
            });
        }
    }

    savePopularity() {
        const popularity = {};
        this.events.forEach(event => {
            if (event.popularity > 0) {
                popularity[event.id] = event.popularity;
            }
        });
        localStorage.setItem('eventPopularity', JSON.stringify(popularity));
    }

    incrementPopularity(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.popularity = (event.popularity || 0) + 1;
            this.savePopularity();
            this.renderEvents();
        }
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
                    <time datetime="2025-09-${14 + event.day}T${event.startTime}" itemprop="startDate">
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
                    <time class="modal__info-value" datetime="2025-09-${14 + event.day}T${event.startTime}" itemprop="startDate">
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
        
        // Check if event already in schedule
        if (schedule.some(e => e.id === eventId)) {
            alert('Это мероприятие уже добавлено в ваше расписание!');
            return;
        }

        // Add event to schedule
        schedule.push(event);
        localStorage.setItem('personalSchedule', JSON.stringify(schedule));

        // Increment popularity
        this.incrementPopularity(eventId);

        // Show success message
        alert(`"${event.title}" добавлено в ваше расписание!`);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM готов, инициализируем ProgramPage...');
    console.log('EVENTS_DATA доступна:', typeof EVENTS_DATA !== 'undefined');
    
    // Проверяем наличие элемента events-grid
    const grid = document.getElementById('events-grid');
    if (!grid) {
        console.error('КРИТИЧЕСКАЯ ОШИБКА: Элемент events-grid не найден в DOM!');
        console.log('Проверьте, что HTML содержит элемент с id="events-grid"');
    } else {
        console.log('Элемент events-grid найден:', grid);
    }
    
    if (typeof EVENTS_DATA !== 'undefined' && EVENTS_DATA.events) {
        console.log('Количество событий в EVENTS_DATA:', EVENTS_DATA.events.length);
        console.log('Первое событие:', EVENTS_DATA.events[0]);
    } else {
        console.error('EVENTS_DATA не определена или пуста!');
    }
    
    try {
        const programPage = new ProgramPage();
        console.log('ProgramPage создан:', programPage);
        console.log('События в ProgramPage:', programPage.events.length);
        console.log('Отфильтрованные события:', programPage.filteredEvents.length);
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

