// Map Page JavaScript with Leaflet

// Данные о площадках с координатами для Тирасполя
const VENUES_DATA = {
    library: {
        id: 'library',
        name: 'Центральная библиотека',
        address: 'ул. Свердлова, 78, Тирасполь',
        lat: 46.8350,
        lng: 29.6283,
        capacity: 150,
        features: ['Читальный зал', 'Конференц-зал', 'Зал мастер-классов', 'Книжный магазин'],
        eventsCount: 8,
        color: '#1A237E',
        events: [
          { title: 'Презентация нового романа Людмилы Улицкой', time: '12:00–13:00' },
          { title: 'Мастер-класс «Как написать свой первый рассказ»', time: '14:00–16:00' },
          { title: 'Презентация сборника молодых поэтов', time: '19:30–20:30' },
          { title: 'Презентация книги Владимира Сорокина', time: '12:00–13:00' },
          { title: 'Мастер-класс «Создание литературного персонажа»', time: '16:00–18:00' },
          { title: 'Дискуссия «Эссеистика и современный мир»', time: '14:30–16:00' },
          { title: 'Презентация сборника детских рассказов', time: '12:00–13:00' },
          { title: 'Мастер-класс «Техника написания эссе»', time: '16:00–17:30' }
        ]
      },
    
      'cultural-center': {
        id: 'cultural-center',
        name: 'Городской культурный центр',
        address: 'ул. 25 октября, 54, Тирасполь',
        lat: 46.8372,
        lng: 29.6130,
        capacity: 200,
        features: ['Главный зал', 'Гардероб', 'Кафе'],
        eventsCount: 4,
        color: '#6A1B4D',
        events: [
          { title: 'Встреча с Людмилой Улицкой', time: '10:00–11:30' },
          { title: 'Встреча с Людмилой Улицкой и Майей Кучерской', time: '18:00–19:30' },
          { title: 'Презентация романа «Новые горизонты»', time: '18:00–19:00' },
          { title: 'Встреча с Владимиром Сорокиным и Дмитрием Соколовым', time: '18:00–19:30' }
        ]
      },
    
      theater: {
        id: 'theater',
        name: 'Драматический театр',
        address: 'ул. 25 октября, 130, Тирасполь',
        lat: 46.8376,
        lng: 29.6331,
        capacity: 300,
        features: ['Большая сцена', 'Малый зал', 'Гардероб'],
        eventsCount: 8,
        color: '#D4AF37',
        events: [
          { title: 'Дискуссия «Современная проза: тренды и вызовы»', time: '16:00–17:30' },
          { title: 'Встреча с Владимиром Сорокиным', time: '10:00–11:30' },
          { title: 'Дискуссия «Границы допустимого в литературе»', time: '14:00–15:30' },
          { title: 'Презентация сборника современной поэзии', time: '12:30–13:30' },
          { title: 'Мастер-класс «Создание литературной вселенной»', time: '16:30–18:00' },
          { title: 'Встреча с Дмитрием Соколовым', time: '10:00–11:30' },
          { title: 'Дискуссия «Современные литературные эксперименты»', time: '14:00–15:30' }
        ]
      },
    
      park: {
        id: 'park',
        name: 'Парк «Литературный»',
        address: 'Центральный парк, Тирасполь',
        lat: 46.8350,
        lng: 29.6120,
        capacity: 500,
        features: ['Детская площадка', 'Книжная ярмарка', 'Летняя сцена'],
        eventsCount: 4,
        color: '#4CAF50',
        events: [
          { title: 'Детская программа «Сказки на ночь»', time: '18:00–19:00' },
          { title: 'Детская программа «Рисуем сказку»', time: '18:30–19:30' },
          { title: 'Детская программа «Читаем вместе с Марией Волковой»', time: '10:00–11:00' },
          { title: 'Автограф-сессия с популярными авторами', time: '19:30–20:30' }
        ]
      },
    
      bookstore: {
        id: 'bookstore',
        name: 'Книжный магазин «Чаша»',
        address: 'ул. 25 Октября, 15, Тирасполь',
        lat: 46.8410,
        lng: 29.6160,
        capacity: 25,
        features: ['Камерный зал', 'Книжный магазин', 'Кафе'],
        eventsCount: 1,
        color: '#9C27B0',
        events: [
          { title: 'Встреча с Майей Кучерской', time: '18:00–19:00' }
        ]
      }
    };

class MapPage {
    constructor() {
        this.map = null;
        this.markers = {};
        this.distancesData = [];
        this.init();
    }

    async init() {
        await this.loadDistances();
        this.initMap();
        this.addMarkers();
        this.addLegend();
        this.setupEventListeners();
    }

    async loadDistances() {
        try {
            const response = await fetch('distances.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.distancesData = data.distances || [];
        } catch (error) {
            console.error('Ошибка загрузки данных о расстояниях:', error);
            // Fallback данные
            this.distancesData = [
                { from: 'library', fromName: 'Центральная библиотека', to: 'cultural-center', toName: 'Городской культурный центр', time: 5 },
                { from: 'library', fromName: 'Центральная библиотека', to: 'theater', toName: 'Драматический театр', time: 10 },
                { from: 'cultural-center', fromName: 'Городской культурный центр', to: 'park', toName: 'Парк «Литературный»', time: 7 },
                { from: 'theater', fromName: 'Драматический театр', to: 'bookstore', toName: 'Книжный магазин «Чаша»', time: 5 },
                { from: 'library', fromName: 'Центральная библиотека', to: 'park', toName: 'Парк «Литературный»', time: 8 },
                { from: 'cultural-center', fromName: 'Городской культурный центр', to: 'theater', toName: 'Драматический театр', time: 12 },
                { from: 'park', fromName: 'Парк «Литературный»', to: 'bookstore', toName: 'Книжный магазин «Чаша»', time: 15 }
            ];
        }
    }

    initMap() {
        const container = document.getElementById('map-container');
        if (!container) {
            console.error('Контейнер карты не найден!');
            return;
        }

        // Проверка видимости и высоты контейнера
        const containerHeight = container.offsetHeight || container.clientHeight || parseInt(getComputedStyle(container).height);
        if (containerHeight === 0) {
            console.error('Контейнер карты не имеет высоты!', {
                offsetHeight: container.offsetHeight,
                clientHeight: container.clientHeight,
                computedHeight: getComputedStyle(container).height
            });
            // Принудительно устанавливаем минимальную высоту
            container.style.height = '500px';
            container.style.minHeight = '500px';
        }

        if (typeof L === 'undefined') {
            console.error('Leaflet не загружен!');
            return;
        }

        try {
            // Инициализация карты с центром в Тирасполе
            this.map = L.map('map-container', {
                center: [46.84, 29.614],
                zoom: 14,
                zoomControl: true,
                attributionControl: true
            });

            // Добавление тайлов OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(this.map);

            // Обновление размеров карты после загрузки
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                }
            }, 100);

            // Кастомные стили для карты
            const style = document.createElement('style');
            style.textContent = `
                .leaflet-container {
                    font-family: var(--font-body);
                }
                .leaflet-popup-content-wrapper {
                    border-radius: var(--border-radius);
                    border: 2px solid var(--color-accent);
                }
            `;
            document.head.appendChild(style);
        } catch (error) {
            console.error('Ошибка инициализации Leaflet карты:', error);
        }
    }

    addMarkers() {
        if (!this.map) {
            console.error('Карта не инициализирована!');
            return;
        }

        Object.values(VENUES_DATA).forEach(venue => {
            // Создание кастомной иконки
            const customIcon = L.divIcon({
                className: 'custom-venue-icon',
                html: `
                    <div style="
                        width: 40px;
                        height: 40px;
                        background-color: ${venue.color};
                        border: 3px solid white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        font-size: 18px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        cursor: pointer;
                    ">${venue.name.charAt(0)}</div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20]
            });

            // Создание маркера
            const marker = L.marker([venue.lat, venue.lng], {
                icon: customIcon
            }).addTo(this.map);

            // Добавление popup с краткой информацией
            marker.bindPopup(`
                <div style="text-align: center;">
                    <strong style="color: ${venue.color}; font-size: 1.1em;">${venue.name}</strong><br>
                    <small>${venue.address}</small><br>
                    <small>${venue.eventsCount} мероприятий</small>
                </div>
            `);

            // Обработчик клика
            marker.on('click', () => {
                this.openVenueModal(venue.id);
            });

            this.markers[venue.id] = marker;
        });

        // Подгонка границ карты под все маркеры
        const group = new L.featureGroup(Object.values(this.markers));
        this.map.fitBounds(group.getBounds().pad(0.1));
    }

    addLegend() {
        if (!this.map) {
            console.error('Карта не инициализирована!');
            return;
        }

        // Создание кастомной легенды
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'map-legend-leaflet');
            div.style.cssText = `
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                border: 2px solid var(--color-accent);
                font-family: var(--font-body);
            `;
            
            div.innerHTML = '<h3 style="margin: 0 0 10px 0; color: var(--color-primary); font-size: 1em;">Легенда</h3>';
            
            Object.values(VENUES_DATA).forEach(venue => {
                const item = document.createElement('div');
                item.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                `;
                item.onmouseover = () => {
                    item.style.backgroundColor = 'var(--color-background)';
                };
                item.onmouseout = () => {
                    item.style.backgroundColor = 'transparent';
                };
                item.onclick = () => {
                    this.openVenueModal(venue.id);
                    this.map.setView([venue.lat, venue.lng], 16);
                };
                
                item.innerHTML = `
                    <span style="
                        width: 20px;
                        height: 20px;
                        background-color: ${venue.color};
                        border-radius: 50%;
                        display: inline-block;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    "></span>
                    <span style="font-size: 0.9em; color: var(--color-text);">${venue.name}</span>
                `;
                
                div.appendChild(item);
            });

            L.DomEvent.disableClickPropagation(div);
            return div;
        };

        legend.addTo(this.map);
    }

    setupEventListeners() {
        // Click on map container to zoom (but not on markers, popups, or controls)
        const mapContainer = document.getElementById('map-container');
        if (mapContainer && this.map) {
            // Используем событие Leaflet для клика на карту
            this.map.on('click', (e) => {
                // Проверяем, что клик не по маркеру или popup
                const clickedElement = e.originalEvent.target;
                if (!clickedElement.closest('.leaflet-marker-icon') && 
                    !clickedElement.closest('.leaflet-popup') &&
                    !clickedElement.closest('.leaflet-control') &&
                    !clickedElement.closest('.map-legend-leaflet') &&
                    !clickedElement.closest('.custom-venue-icon')) {
                    this.openFullscreenMap();
                }
            });
            
            // Добавляем визуальную подсказку
            mapContainer.style.cursor = 'pointer';
            mapContainer.setAttribute('title', 'Кликните на карту, чтобы увеличить');
        }

        // Venue modal
        const venueModal = document.getElementById('venue-modal');
        const venueModalOverlay = document.getElementById('venue-modal-overlay');
        const venueModalClose = document.getElementById('venue-modal-close');

        if (venueModalOverlay) {
            venueModalOverlay.addEventListener('click', () => {
                this.closeVenueModal();
            });
        }

        if (venueModalClose) {
            venueModalClose.addEventListener('click', () => {
                this.closeVenueModal();
            });
        }

        // Fullscreen map modal
        const fullscreenModal = document.getElementById('fullscreen-map-modal');
        const fullscreenOverlay = document.getElementById('fullscreen-map-overlay');
        const fullscreenClose = document.getElementById('fullscreen-map-close');

        if (fullscreenOverlay) {
            fullscreenOverlay.addEventListener('click', () => {
                this.closeFullscreenMap();
            });
        }

        if (fullscreenClose) {
            fullscreenClose.addEventListener('click', () => {
                this.closeFullscreenMap();
            });
        }

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const venueModal = document.getElementById('venue-modal');
                const fullscreenModal = document.getElementById('fullscreen-map-modal');
                
                if (venueModal && venueModal.getAttribute('aria-hidden') === 'false') {
                    this.closeVenueModal();
                }
                if (fullscreenModal && fullscreenModal.getAttribute('aria-hidden') === 'false') {
                    this.closeFullscreenMap();
                }
            }
        });

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav__toggle');
        const navList = document.querySelector('.nav__list');

        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                const isOpen = navList.classList.toggle('nav__list--open');
                navToggle.setAttribute('aria-expanded', isOpen);
            });
        }
    }

    openVenueModal(venueId) {
        const venue = VENUES_DATA[venueId];
        if (!venue) return;

        const modal = document.getElementById('venue-modal');
        const modalBody = document.getElementById('venue-modal-body');

        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <h2 class="venue-details__title" id="venue-modal-title">${venue.name}</h2>
            <div class="venue-details__info">
                <div class="venue-details__item">
                    <span class="venue-details__label">Адрес</span>
                    <span class="venue-details__value">${venue.address}</span>
                </div>
                <div class="venue-details__item">
                    <span class="venue-details__label">Вместимость</span>
                    <span class="venue-details__value">${venue.capacity} мест</span>
                </div>
                <div class="venue-details__item">
                    <span class="venue-details__label">Количество мероприятий</span>
                    <span class="venue-details__value">${venue.eventsCount}</span>
                </div>
            </div>
            ${venue.features.length > 0 ? `
                <div class="venue-details__features">
                    <h3 class="venue-details__features-title">Особенности</h3>
                    <ul class="venue-details__features-list">
                        ${venue.features.map(feature => `
                            <li class="venue-details__feature">${feature}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            ${venue.events.length > 0 ? `
                <div class="venue-details__events">
                    <h3 class="venue-details__events-title">Мероприятия на площадке</h3>
                    <ul class="venue-details__events-list">
                        ${venue.events.map(event => `
                            <li class="venue-details__event-item">
                                <span class="venue-details__event-name">${event.title}</span>
                                <span class="venue-details__event-time">${event.time}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        `;

        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    closeVenueModal() {
        const modal = document.getElementById('venue-modal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    openFullscreenMap() {
        const modal = document.getElementById('fullscreen-map-modal');
        const container = document.getElementById('fullscreen-map-container');

        if (!modal || !container) return;

        // Создание новой карты для полноэкранного режима
        // Центр на Тирасполе с большим масштабом для детального просмотра
        const fullscreenMap = L.map('fullscreen-map-container', {
            center: [46.84, 29.614], // Центр Тирасполя
            zoom: 17, // Увеличенный масштаб для детального просмотра
            zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(fullscreenMap);

        // Добавление маркеров
        Object.values(VENUES_DATA).forEach(venue => {
            const customIcon = L.divIcon({
                className: 'custom-venue-icon',
                html: `
                    <div style="
                        width: 40px;
                        height: 40px;
                        background-color: ${venue.color};
                        border: 3px solid white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        font-size: 18px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        cursor: pointer;
                    ">${venue.name.charAt(0)}</div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20]
            });

            const marker = L.marker([venue.lat, venue.lng], {
                icon: customIcon
            }).addTo(fullscreenMap);

            marker.bindPopup(`
                <div style="text-align: center;">
                    <strong style="color: ${venue.color}; font-size: 1.1em;">${venue.name}</strong><br>
                    <small>${venue.address}</small>
                </div>
            `);

            marker.on('click', () => {
                this.closeFullscreenMap();
                setTimeout(() => {
                    this.openVenueModal(venue.id);
                }, 300);
            });
        });

        // Добавление легенды
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'map-legend-leaflet');
            div.style.cssText = `
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                border: 2px solid var(--color-accent);
                font-family: var(--font-body);
            `;
            div.innerHTML = '<h3 style="margin: 0 0 10px 0; color: var(--color-primary); font-size: 1em;">Легенда</h3>';
            Object.values(VENUES_DATA).forEach(venue => {
                const item = document.createElement('div');
                item.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px;';
                item.innerHTML = `
                    <span style="width: 20px; height: 20px; background-color: ${venue.color}; border-radius: 50%; display: inline-block; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                    <span style="font-size: 0.9em; color: var(--color-text);">${venue.name}</span>
                `;
                div.appendChild(item);
            });
            L.DomEvent.disableClickPropagation(div);
            return div;
        };
        legend.addTo(fullscreenMap);

        // Обновление размеров карты после загрузки
        setTimeout(() => {
            if (fullscreenMap) {
                fullscreenMap.invalidateSize();
            }
        }, 100);

        // Сохранение ссылки на карту для очистки при закрытии
        container._fullscreenMap = fullscreenMap;

        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    closeFullscreenMap() {
        const modal = document.getElementById('fullscreen-map-modal');
        const container = document.getElementById('fullscreen-map-container');
        
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        // Удаление карты при закрытии
        if (container && container._fullscreenMap) {
            container._fullscreenMap.remove();
            container._fullscreenMap = null;
            container.innerHTML = '';
        }
    }

}

// Initialize when DOM and Leaflet are ready
function initMapPage() {
    if (typeof L === 'undefined') {
        console.error('Leaflet не загружен!');
        setTimeout(initMapPage, 100);
        return;
    }
    
    try {
        new MapPage();
    } catch (error) {
        console.error('Ошибка инициализации карты:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMapPage);
} else {
    initMapPage();
}
