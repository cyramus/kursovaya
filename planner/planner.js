class PlannerPage {
    constructor() {
        this.schedule = [];
        this.eventsData = [];
        this.distancesData = [];
        this.participantsData = [];
        this.currentDay = 'all';
        this.init();
    }

    async init() {
        await this.loadSchedule();
        await this.loadEvents();
        await this.loadDistances();
        await this.loadParticipants();
        this.setupEventListeners();
        this.renderSchedule();
        this.updateCalculators();
    }

    loadSchedule() {
        try {
            const saved = localStorage.getItem('personalSchedule');
            if (saved) {
                this.schedule = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Ошибка загрузки расписания:', error);
            this.schedule = [];
        }
    }

    saveSchedule() {
        try {
            localStorage.setItem('personalSchedule', JSON.stringify(this.schedule));
        } catch (error) {
            console.error('Ошибка сохранения расписания:', error);
        }
    }

    async loadEvents() {
        try {
            const response = await fetch('../data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.eventsData = data.events || [];
        } catch (error) {
            console.error('Ошибка загрузки мероприятий:', error);
            this.eventsData = [];
        }
    }

    async loadDistances() {
        try {
            const response = await fetch('../map/distances.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.distancesData = data.distances || [];
        } catch (error) {
            console.error('Ошибка загрузки расстояний:', error);
            this.distancesData = [];
        }
    }

    async loadParticipants() {
        try {
            const response = await fetch('../data/partisipants.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.participantsData = data.participants || [];
        } catch (error) {
            console.error('Ошибка загрузки участников:', error);
            this.participantsData = [];
        }
    }

    setupEventListeners() {
        // Day tabs
        const tabs = document.querySelectorAll('.planner-schedule__tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const day = tab.dataset.day;
                this.switchDay(day);
            });
        });

        // Calculator inputs
        const breakTime = document.getElementById('break-time');
        if (breakTime) {
            breakTime.addEventListener('change', () => this.updateCalculators());
        }

        const visitorCategory = document.getElementById('visitor-category');
        if (visitorCategory) {
            visitorCategory.addEventListener('change', () => this.updateCalculators());
        }

        const checkboxes = document.querySelectorAll('.planner-calculator__checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateCalculators());
        });

        // Export buttons
        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printSchedule());
        }

        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copySchedule());
        }

        // Modal close handlers
        const modal = document.getElementById('participant-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeParticipantModal());
        }

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeParticipantModal());
        }

        // Close modal on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
                this.closeParticipantModal();
            }
        });
    }

    switchDay(day) {
        this.currentDay = day;
        
        const tabs = document.querySelectorAll('.planner-schedule__tab');
        tabs.forEach(tab => {
            if (tab.dataset.day === day) {
                tab.classList.add('planner-schedule__tab--active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('planner-schedule__tab--active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        this.renderSchedule();
    }

    renderSchedule() {
        const content = document.getElementById('schedule-content');
        const emptyMessage = document.getElementById('empty-schedule');

        if (!content) return;

        if (this.schedule.length === 0) {
            content.innerHTML = '';
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }

        if (emptyMessage) emptyMessage.style.display = 'none';

        // Filter by day if needed
        let filteredSchedule = this.schedule;
        if (this.currentDay !== 'all') {
            filteredSchedule = this.schedule.filter(e => e.day === parseInt(this.currentDay));
        }

        if (filteredSchedule.length === 0) {
            content.innerHTML = '<p class="planner-schedule__empty">На этот день нет запланированных мероприятий.</p>';
            return;
        }

        // Group by day
        const scheduleByDay = {};
        filteredSchedule.forEach(event => {
            if (!scheduleByDay[event.day]) {
                scheduleByDay[event.day] = [];
            }
            scheduleByDay[event.day].push(event);
        });

        // Sort events by time
        Object.keys(scheduleByDay).forEach(day => {
            scheduleByDay[day].sort((a, b) => {
                return a.startTime.localeCompare(b.startTime);
            });
        });

        // Render
        if (this.currentDay === 'all') {
            content.innerHTML = Object.keys(scheduleByDay)
                .sort()
                .map(day => this.renderDay(parseInt(day), scheduleByDay[day]))
                .join('');
        } else {
            content.innerHTML = this.renderDay(parseInt(this.currentDay), scheduleByDay[this.currentDay] || []);
        }

        // Attach remove listeners
        const removeButtons = document.querySelectorAll('.planner-event__remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = parseInt(e.currentTarget.dataset.eventId);
                this.removeFromSchedule(eventId);
            });
        });

        // Attach participant click listeners
        const participantButtons = document.querySelectorAll('.planner-event__participant');
        participantButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const participantName = e.currentTarget.dataset.participantName;
                this.openParticipantModal(participantName);
            });
        });
    }

    renderDay(day, events) {
        const dayLabels = {
            1: 'День 1 (15 сентября)',
            2: 'День 2 (16 сентября)',
            3: 'День 3 (17 сентября)'
        };

        const eventsHtml = events.map((event, index) => {
            const nextEvent = events[index + 1];
            return this.renderEvent(event, nextEvent);
        }).join('');

        return `
            <div class="planner-day">
                <h2 class="planner-day__title">${dayLabels[day]}</h2>
                <div class="planner-day__events">
                    ${eventsHtml}
                </div>
            </div>
        `;
    }

    renderEvent(event, nextEvent) {
        const conflicts = this.checkConflicts(event);
        const duration = this.calculateDuration(event.startTime, event.endTime);
        const timeToNext = nextEvent ? this.calculateTimeToNext(event, nextEvent) : null;
        const hasTimeWarning = timeToNext !== null && timeToNext < 15; // Меньше 15 минут с учетом перемещения

        // Extract venue name (before comma)
        const venueName = event.venue.split(',')[0];

        return `
            <div class="planner-event ${conflicts.length > 0 ? 'planner-event--conflict' : ''}">
                <div class="planner-event__header">
                    <h3 class="planner-event__title">${event.title}</h3>
                    <div class="planner-event__header-actions">
                        ${conflicts.length > 0 || hasTimeWarning ? '<span class="planner-event__warning-icon" title="Пересечение по времени или мало времени между мероприятиями">⚠️</span>' : ''}
                        <button class="planner-event__remove" data-event-id="${event.id}" aria-label="Удалить из расписания">×</button>
                    </div>
                </div>
                <div class="planner-event__info">
                    <div class="planner-event__info-item">
                        <span class="planner-event__info-label">Время:</span>
                        <span>${event.startTime} – ${event.endTime}</span>
                    </div>
                    <div class="planner-event__info-item">
                        <span class="planner-event__info-label">Площадка:</span>
                        <span>${venueName}</span>
                    </div>
                    <div class="planner-event__info-item">
                        <span class="planner-event__info-label">Длительность:</span>
                        <span class="planner-event__duration">${duration} мин</span>
                    </div>
                </div>
                ${event.participants && event.participants.length > 0 ? `
                    <div class="planner-event__participants">
                        <div class="planner-event__participants-label">Участники:</div>
                        ${event.participants.map(p => `
                            <button class="planner-event__participant" data-participant-name="${p.name}">${p.name}</button>
                        `).join('')}
                    </div>
                ` : ''}
                ${conflicts.length > 0 ? `
                    <div class="planner-event__warning">
                        ⚠️ Пересечение по времени с: ${conflicts.map(c => c.title).join(', ')}
                    </div>
                ` : ''}
                ${timeToNext !== null ? `
                    <div class="planner-event__next ${hasTimeWarning ? 'planner-event__next--warning' : ''}">
                        ⏱️ До следующего мероприятия: ${timeToNext} мин ${hasTimeWarning ? '(мало времени!)' : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    checkConflicts(event) {
        return this.schedule.filter(e => {
            if (e.id === event.id || e.day !== event.day) return false;
            
            const eventStart = this.timeToMinutes(event.startTime);
            const eventEnd = this.timeToMinutes(event.endTime);
            const otherStart = this.timeToMinutes(e.startTime);
            const otherEnd = this.timeToMinutes(e.endTime);

            // Проверка пересечения: события пересекаются, если:
            // 1. Начало одного события внутри другого (eventStart >= otherStart && eventStart < otherEnd)
            // 2. Конец одного события внутри другого (eventEnd > otherStart && eventEnd <= otherEnd)
            // 3. Одно событие полностью содержит другое (eventStart <= otherStart && eventEnd >= otherEnd)
            // 4. Одно событие полностью внутри другого (eventStart >= otherStart && eventEnd <= otherEnd)
            // Все эти случаи покрываются условием: eventStart < otherEnd && eventEnd > otherStart
            
            const hasOverlap = (eventStart < otherEnd && eventEnd > otherStart);
            
            // Дополнительная проверка: если одно мероприятие заканчивается после того, как началось следующее
            // (eventEnd > otherStart && eventStart < otherStart) - текущее заканчивается после начала другого
            // (otherEnd > eventStart && otherStart < eventStart) - другое заканчивается после начала текущего
            
            return hasOverlap;
        });
    }

    calculateTimeToNext(currentEvent, nextEvent) {
        const currentEnd = this.timeToMinutes(currentEvent.endTime);
        const nextStart = this.timeToMinutes(nextEvent.startTime);
        
        const timeBetween = nextStart - currentEnd;
        
        if (timeBetween <= 0) return null;

        // Get travel time
        const currentVenue = currentEvent.venue.split(',')[0];
        const nextVenue = nextEvent.venue.split(',')[0];
        const travelTime = this.getTravelTime(currentVenue, nextVenue);

        return timeBetween - travelTime;
    }

    getTravelTime(fromVenue, toVenue) {
        if (fromVenue === toVenue) return 0;

        const venueMap = {
            'Центральная библиотека': 'library',
            'Городской культурный центр': 'cultural-center',
            'Драматический театр': 'theater',
            'Парк «Литературный»': 'park',
            'Книжный магазин «Чаша»': 'bookstore'
        };

        const fromId = venueMap[fromVenue];
        const toId = venueMap[toVenue];

        if (!fromId || !toId) return 0;

        const distance = this.distancesData.find(d => 
            (d.from === fromId && d.to === toId) || 
            (d.from === toId && d.to === fromId)
        );

        return distance ? distance.time : 0;
    }

    calculateDuration(startTime, endTime) {
        const start = this.timeToMinutes(startTime);
        const end = this.timeToMinutes(endTime);
        return end - start;
    }

    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    removeFromSchedule(eventId) {
        if (confirm('Удалить это мероприятие из расписания?')) {
            this.schedule = this.schedule.filter(e => e.id !== eventId);
            this.saveSchedule();
            this.renderSchedule();
            this.updateCalculators();
        }
    }

    updateCalculators() {
        this.updateTimeCalculator();
        this.updateCostCalculator();
    }

    updateTimeCalculator() {
        const resultEl = document.getElementById('time-result');
        if (!resultEl) return;

        if (this.schedule.length === 0) {
            resultEl.innerHTML = '<p class="planner-calculator__result-text">Добавьте мероприятия в расписание</p>';
            return;
        }

        const breakTime = parseInt(document.getElementById('break-time').value);
        let totalMinutes = 0;
        let travelTime = 0;

        // Sort by day and time
        const sortedSchedule = [...this.schedule].sort((a, b) => {
            if (a.day !== b.day) return a.day - b.day;
            return a.startTime.localeCompare(b.startTime);
        });

        sortedSchedule.forEach((event, index) => {
            const duration = this.calculateDuration(event.startTime, event.endTime);
            totalMinutes += duration;

            // Add travel time if not first event
            if (index > 0) {
                const prevEvent = sortedSchedule[index - 1];
                if (prevEvent.day === event.day) {
                    const travel = this.getTravelTime(
                        prevEvent.venue.split(',')[0],
                        event.venue.split(',')[0]
                    );
                    travelTime += travel;
                }
            }

            // Add break time if not last event
            if (index < sortedSchedule.length - 1) {
                const nextEvent = sortedSchedule[index + 1];
                if (nextEvent.day === event.day) {
                    totalMinutes += breakTime;
                }
            }
        });

        totalMinutes += travelTime;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        let resultHtml = `
            <p class="planner-calculator__result-value">${hours} ч ${minutes} мин</p>
            <p class="planner-calculator__result-text">Вам понадобится ${hours} ч ${minutes} мин</p>
        `;

        // Check if day is too loaded (check actual time between events)
        const eventsByDay = {};
        sortedSchedule.forEach(e => {
            if (!eventsByDay[e.day]) eventsByDay[e.day] = [];
            eventsByDay[e.day].push(e);
        });

        Object.keys(eventsByDay).forEach(day => {
            const dayEvents = eventsByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
            let hasLowTime = false;
            let hasConflicts = false;

            // Check for conflicts and low time between events
            for (let i = 0; i < dayEvents.length; i++) {
                const currentEvent = dayEvents[i];
                const conflicts = this.checkConflicts(currentEvent);
                if (conflicts.length > 0) {
                    hasConflicts = true;
                }

                if (i < dayEvents.length - 1) {
                    const nextEvent = dayEvents[i + 1];
                    const currentEnd = this.timeToMinutes(currentEvent.endTime);
                    const nextStart = this.timeToMinutes(nextEvent.startTime);
                    const timeBetween = nextStart - currentEnd;
                    
                    // Если есть время между мероприятиями (нет конфликта)
                    if (timeBetween > 0) {
                        // Получаем время перемещения
                        const currentVenue = currentEvent.venue.split(',')[0];
                        const nextVenue = nextEvent.venue.split(',')[0];
                        const travelTime = this.getTravelTime(currentVenue, nextVenue);
                        
                        // Время после перемещения
                        const timeAfterTravel = timeBetween - travelTime;
                        
                        // Если после перемещения остается меньше 15 минут - это проблема
                        if (timeAfterTravel < 15) {
                            hasLowTime = true;
                        }
                    } else {
                        // Если время между <= 0, это конфликт
                        hasConflicts = true;
                    }
                }
            }

            // Показываем предупреждение если есть проблемы или много мероприятий
            if (hasConflicts || hasLowTime || dayEvents.length >= 5) {
                let warningParts = [];
                
                if (hasConflicts) {
                    warningParts.push('Есть пересечения по времени');
                }
                if (hasLowTime) {
                    warningParts.push('Между мероприятиями останется мало времени');
                }
                if (dayEvents.length >= 5 && !hasConflicts && !hasLowTime) {
                    warningParts.push('Между мероприятиями останется мало времени');
                }
                
                if (warningParts.length > 0) {
                    const warningText = `Внимание! День ${day} слишком загружен. ${warningParts.join('. ')}.`;
                    resultHtml += `
                        <div class="planner-calculator__result-warning">
                            ${warningText}
                        </div>
                    `;
                }
            }
        });

        resultEl.innerHTML = resultHtml;
    }

    updateCostCalculator() {
        const resultEl = document.getElementById('cost-result');
        if (!resultEl) return;

        if (this.schedule.length === 0) {
            resultEl.innerHTML = '<p class="planner-calculator__result-text">Добавьте мероприятия в расписание</p>';
            return;
        }

        const category = document.getElementById('visitor-category').value;
        const categoryCoefficients = {
            adult: 1.0,
            student: 0.7,
            discount: 0.5
        };
        const coefficient = categoryCoefficients[category];

        // Calculate base cost (before category coefficient)
        let baseCostBeforeCoefficient = 0;
        const paidEvents = this.schedule.filter(e => {
            const price = e.price;
            return price && price !== 'Бесплатно' && !price.includes('Бесплатно');
        });

        paidEvents.forEach(event => {
            const priceMatch = event.price.match(/(\d+)/);
            if (priceMatch) {
                baseCostBeforeCoefficient += parseInt(priceMatch[1]);
            }
        });

        // Apply category coefficient
        let baseCost = baseCostBeforeCoefficient * coefficient;

        // Apply discounts (based on number of paid events)
        let discount = 0;
        let discountText = '';
        let discountPercent = 0;
        
        if (paidEvents.length >= 5) {
            discountPercent = 0.2;
            discount = baseCost * discountPercent;
            discountText = 'Скидка 20% (5+ мероприятий)';
        } else if (paidEvents.length >= 3) {
            discountPercent = 0.1;
            discount = baseCost * discountPercent;
            discountText = 'Скидка 10% (3+ мероприятий)';
        }

        const costAfterDiscount = baseCost - discount;

        // Add additional options
        let additionalCost = 0;
        const parking = document.getElementById('parking');
        const catalog = document.getElementById('catalog');
        const souvenirs = document.getElementById('souvenirs');

        if (parking && parking.checked) additionalCost += 200;
        if (catalog && catalog.checked) additionalCost += 300;
        if (souvenirs && souvenirs.checked) additionalCost += 500;

        const totalCost = costAfterDiscount + additionalCost;

        // Build result HTML
        let resultHtml = `
            <div class="planner-calculator__result-details">
                <p><strong>Платных мероприятий:</strong> ${paidEvents.length}</p>
        `;

        // Show original cost if category coefficient is not 1.0
        if (coefficient !== 1.0) {
            const categoryNames = {
                adult: 'Взрослый',
                student: 'Студент',
                discount: 'Льготный'
            };
            resultHtml += `<p><strong>Стоимость без скидки (${categoryNames[category]}):</strong> ${Math.round(baseCostBeforeCoefficient)}₽ × ${coefficient} = ${Math.round(baseCost)}₽</p>`;
        } else {
            resultHtml += `<p><strong>Базовая стоимость:</strong> ${Math.round(baseCost)}₽</p>`;
        }

        if (discount > 0) {
            resultHtml += `<p><strong>${discountText}:</strong> -${Math.round(discount)}₽</p>`;
            resultHtml += `<p><strong>Стоимость со скидкой:</strong> ${Math.round(costAfterDiscount)}₽</p>`;
        }

        if (additionalCost > 0) {
            resultHtml += `<p><strong>Дополнительные опции:</strong> ${additionalCost}₽</p>`;
        }

        resultHtml += `
            </div>
            <p class="planner-calculator__result-value">${Math.round(totalCost)}₽</p>
        `;

        resultEl.innerHTML = resultHtml;
    }

    openParticipantModal(participantName) {
        const participant = this.participantsData.find(p => 
            (p.fullName && p.fullName === participantName) || 
            (p.name === participantName)
        );

        if (!participant) {
            console.warn('Участник не найден:', participantName);
            return;
        }

        const modal = document.getElementById('participant-modal');
        const modalBody = document.getElementById('modal-body');

        if (!modal || !modalBody) return;

        modalBody.innerHTML = '';

        if (participant.type === 'writer') {
            this.renderWriterModal(participant, modalBody);
        } else {
            this.renderPublisherModal(participant, modalBody);
        }

        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    renderWriterModal(participant, container) {
        container.innerHTML = `
            <div class="modal__participant-header">
                <img src="${participant.photo}" 
                     alt="${participant.fullName}" 
                     class="modal__participant-photo"
                     loading="lazy">
                <div class="modal__participant-info">
                    <h2 class="modal__participant-name" id="modal-title">${participant.fullName}</h2>
                    <p class="modal__participant-bio">${participant.biography || ''}</p>
                </div>
            </div>

            <div class="modal__participant-details">
                <div class="modal__detail-item">
                    <div class="modal__detail-label">Жанр</div>
                    <div class="modal__detail-value">${participant.genres?.join(', ') || 'Не указано'}</div>
                </div>
                ${participant.awards && participant.awards.length > 0 ? `
                    <div class="modal__detail-item">
                        <div class="modal__detail-label">Награды</div>
                        <div class="modal__detail-value">${participant.awards.length} награда(ы)</div>
                    </div>
                ` : ''}
            </div>

            ${participant.books && participant.books.length > 0 ? `
                <div class="modal__books">
                    <h3 class="modal__books-title">Книги</h3>
                    <div class="modal__books-list">
                        ${participant.books.slice(0, 3).map(book => `
                            <div class="modal__book">
                                ${book.cover && book.cover !== 'null' ? `
                                    <img src="${book.cover}" 
                                         alt="${book.title}" 
                                         class="modal__book-cover"
                                         loading="lazy">
                                ` : ''}
                                <div class="modal__book-title">${book.title}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${participant.awards && participant.awards.length > 0 ? `
                <div class="modal__awards">
                    <h3 class="modal__awards-title">Награды</h3>
                    <ul class="modal__awards-list">
                        ${participant.awards.slice(0, 2).map(award => `
                            <li class="modal__award-item">${award}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            ${participant.officialLink ? `
                <div class="modal__links">
                    <a href="${participant.officialLink}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="modal__link">
                        Официальный сайт
                    </a>
                </div>
            ` : ''}
        `;
    }

    renderPublisherModal(participant, container) {
        container.innerHTML = `
            <div class="modal__participant-header">
                <img src="${participant.logo}" 
                     alt="${participant.name}" 
                     class="modal__participant-logo"
                     loading="lazy">
                <div class="modal__participant-info">
                    <h2 class="modal__participant-name" id="modal-title">${participant.name}</h2>
                    <p class="modal__participant-bio">${participant.description || ''}</p>
                </div>
            </div>

            <div class="modal__participant-details">
                <div class="modal__detail-item">
                    <div class="modal__detail-label">Год основания</div>
                    <div class="modal__detail-value">${participant.foundedYear}</div>
                </div>
                <div class="modal__detail-item">
                    <div class="modal__detail-label">Стенд</div>
                    <div class="modal__detail-value">${participant.fairStandNumber}</div>
                </div>
            </div>

            ${participant.authorsRepresented && participant.authorsRepresented.length > 0 ? `
                <div class="modal__authors">
                    <h3 class="modal__authors-title">Представленные авторы</h3>
                    <ul class="modal__authors-list">
                        ${participant.authorsRepresented.slice(0, 5).map(authorName => {
                            const author = this.participantsData.find(p => p.fullName === authorName);
                            if (author) {
                                return `<li class="modal__author-item" data-participant-name="${authorName}">${authorName}</li>`;
                            }
                            return `<li class="modal__author-item">${authorName}</li>`;
                        }).join('')}
                    </ul>
                </div>
            ` : ''}

            ${participant.contact ? `
                <div class="modal__contact">
                    <h3 class="modal__contact-title">Контакты</h3>
                    ${participant.contact.email ? `
                        <div class="modal__contact-item">
                            <span>Email:</span>
                            <a href="mailto:${participant.contact.email}" class="modal__contact-link">${participant.contact.email}</a>
                        </div>
                    ` : ''}
                    ${participant.contact.phone ? `
                        <div class="modal__contact-item">
                            <span>Телефон:</span>
                            <a href="tel:${participant.contact.phone}" class="modal__contact-link">${participant.contact.phone}</a>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;

        // Add click handlers for author links
        const authorItems = container.querySelectorAll('.modal__author-item[data-participant-name]');
        authorItems.forEach(item => {
            item.addEventListener('click', () => {
                const authorName = item.getAttribute('data-participant-name');
                this.closeParticipantModal();
                setTimeout(() => this.openParticipantModal(authorName), 100);
            });
        });
    }

    closeParticipantModal() {
        const modal = document.getElementById('participant-modal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    printSchedule() {
        window.print();
    }

    copySchedule() {
        if (this.schedule.length === 0) {
            alert('Расписание пусто');
            return;
        }

        const dayLabels = {
            1: 'День 1 (15 сентября)',
            2: 'День 2 (16 сентября)',
            3: 'День 3 (17 сентября)'
        };

        const scheduleByDay = {};
        this.schedule.forEach(event => {
            if (!scheduleByDay[event.day]) {
                scheduleByDay[event.day] = [];
            }
            scheduleByDay[event.day].push(event);
        });

        let text = 'МОЁ РАСПИСАНИЕ - ЧитайФест 2026\n\n';

        Object.keys(scheduleByDay)
            .sort()
            .forEach(day => {
                text += `${dayLabels[day]}\n`;
                text += '='.repeat(30) + '\n\n';
                
                scheduleByDay[day]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .forEach(event => {
                        text += `${event.startTime} - ${event.endTime} | ${event.title}\n`;
                        text += `Площадка: ${event.venue}\n`;
                        if (event.participants && event.participants.length > 0) {
                            text += `Участники: ${event.participants.map(p => p.name).join(', ')}\n`;
                        }
                        text += '\n';
                    });
                
                text += '\n';
            });

        navigator.clipboard.writeText(text).then(() => {
            alert('Расписание скопировано в буфер обмена!');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Расписание скопировано в буфер обмена!');
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PlannerPage();
    });
} else {
    new PlannerPage();
}

