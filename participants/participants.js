class ParticipantsPage {
    constructor() {
        this.participants = [];
        this.filteredParticipants = [];
        this.filters = {
            type: 'all',
            genre: 'all',
            sort: 'az',
            search: ''
        };
        this.eventsData = [];
        this.init();
    }

    async init() {
        await this.loadParticipants();
        await this.loadEvents();
        this.setupEventListeners();
        this.renderParticipants();
    }

    async loadParticipants() {
        try {
            const response = await fetch('../data/partisipants.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!data || !data.participants) {
                console.error('Данные участников не найдены!');
                this.participants = [];
                this.filteredParticipants = [];
                return;
            }
            this.participants = data.participants;
            this.filteredParticipants = [...this.participants];
            this.populateGenres();
            console.log('Участники загружены:', this.participants.length);
        } catch (error) {
            console.error('Ошибка загрузки участников:', error);
            this.participants = [];
            this.filteredParticipants = [];
        }
    }

    async loadEvents() {
        try {
            const response = await fetch('../data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.events) {
                this.eventsData = data.events;
            }
        } catch (error) {
            console.error('Ошибка загрузки мероприятий:', error);
            this.eventsData = [];
        }
    }

    populateGenres() {
        const genreFilter = document.getElementById('genre-filter');
        if (!genreFilter) return;

        const genres = new Set();
        this.participants.forEach(participant => {
            if (participant.type === 'writer' && participant.genres) {
                participant.genres.forEach(genre => genres.add(genre));
            }
        });

        const sortedGenres = Array.from(genres).sort();
        sortedGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }

    setupEventListeners() {
        // Type filter
        const typeFilters = document.querySelectorAll('input[name="type-filter"]');
        typeFilters.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.applyFilters();
            });
        });

        // Genre filter
        const genreFilter = document.getElementById('genre-filter');
        if (genreFilter) {
            genreFilter.addEventListener('change', (e) => {
                this.filters.genre = e.target.value;
                this.applyFilters();
            });
        }

        // Sort
        const sortFilter = document.getElementById('alphabet-sort');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase().trim();
                this.applyFilters();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Modal close handlers
        this.setupModalHandlers();
    }

    setupModalHandlers() {
        const modal = document.getElementById('participant-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeModal();
            });
        }

        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeModal();
            });
        }

        // Close modal on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
                this.closeModal();
            }
        });

        // Prevent modal content clicks from closing modal
        const modalContent = document.querySelector('.modal__content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    applyFilters() {
        this.filteredParticipants = this.participants.filter(participant => {
            // Type filter
            if (this.filters.type !== 'all' && participant.type !== this.filters.type) {
                return false;
            }

            // Genre filter (only for writers)
            if (this.filters.genre !== 'all' && participant.type === 'writer') {
                if (!participant.genres || !participant.genres.includes(this.filters.genre)) {
                    return false;
                }
            }

            // Search filter
            if (this.filters.search) {
                const searchLower = this.filters.search;
                const nameMatch = participant.fullName?.toLowerCase().includes(searchLower) ||
                                 participant.name?.toLowerCase().includes(searchLower);
                const genreMatch = participant.genres?.some(g => g.toLowerCase().includes(searchLower));
                const bookMatch = participant.books?.some(b => b.title.toLowerCase().includes(searchLower));
                
                if (!nameMatch && !genreMatch && !bookMatch) {
                    return false;
                }
            }

            return true;
        });

        this.sortParticipants();
        this.renderParticipants();
    }

    sortParticipants() {
        if (this.filters.sort === 'az') {
            this.filteredParticipants.sort((a, b) => {
                const nameA = (a.fullName || a.name || '').toLowerCase();
                const nameB = (b.fullName || b.name || '').toLowerCase();
                return nameA.localeCompare(nameB, 'ru');
            });
        } else if (this.filters.sort === 'za') {
            this.filteredParticipants.sort((a, b) => {
                const nameA = (a.fullName || a.name || '').toLowerCase();
                const nameB = (b.fullName || b.name || '').toLowerCase();
                return nameB.localeCompare(nameA, 'ru');
            });
        } else if (this.filters.sort === 'type') {
            this.filteredParticipants.sort((a, b) => {
                if (a.type === b.type) {
                    const nameA = (a.fullName || a.name || '').toLowerCase();
                    const nameB = (b.fullName || b.name || '').toLowerCase();
                    return nameA.localeCompare(nameB, 'ru');
                }
                return a.type === 'writer' ? -1 : 1;
            });
        }
    }

    resetFilters() {
        this.filters = {
            type: 'all',
            genre: 'all',
            sort: 'az',
            search: ''
        };

        const typeRadios = document.querySelectorAll('input[name="type-filter"]');
        typeRadios.forEach(radio => {
            if (radio.value === 'all') radio.checked = true;
        });

        const genreFilter = document.getElementById('genre-filter');
        if (genreFilter) genreFilter.value = 'all';

        const sortFilter = document.getElementById('alphabet-sort');
        if (sortFilter) sortFilter.value = 'az';

        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';

        this.applyFilters();
    }

    renderParticipants() {
        const grid = document.getElementById('participants-grid');
        const emptyMessage = document.getElementById('empty-message');

        if (!grid) return;

        grid.innerHTML = '';

        if (this.filteredParticipants.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            return;
        }

        if (emptyMessage) emptyMessage.style.display = 'none';

        this.filteredParticipants.forEach(participant => {
            const card = this.createParticipantCard(participant);
            grid.appendChild(card);
        });
    }

    createParticipantCard(participant) {
        const card = document.createElement('div');
        card.className = `participant-card participant-card--${participant.type}`;
        
        const handleCardClick = (e) => {
            // Don't open modal if clicking on button (button has its own handler)
            if (e.target.classList.contains('participant-card__btn')) {
                return;
            }
            this.openModal(participant);
        };
        
        card.addEventListener('click', handleCardClick);

        if (participant.type === 'writer') {
            card.innerHTML = `
                <img src="${participant.photo}" 
                     alt="${participant.fullName}" 
                     class="participant-card__photo"
                     loading="lazy">
                <div class="participant-card__type">Писатель</div>
                <h3 class="participant-card__name">${participant.fullName}</h3>
                <div class="participant-card__genres">
                    ${participant.genres?.map(g => `<span class="participant-card__genre">${g}</span>`).join('') || ''}
                </div>
                ${participant.awards && participant.awards.length > 0 ? `
                    <div class="participant-card__awards">
                        <div class="participant-card__award">${participant.awards[0]}</div>
                    </div>
                ` : ''}
                <button class="btn btn--primary participant-card__btn">Подробнее</button>
            `;
        } else {
            card.innerHTML = `
                <img src="${participant.logo}" 
                     alt="${participant.name}" 
                     class="participant-card__logo"
                     loading="lazy">
                <h3 class="participant-card__name">${participant.name}</h3>
                <div class="participant-card__founded">Основано: ${participant.foundedYear}</div>
                <div class="participant-card__stand">Стенд: ${participant.fairStandNumber}</div>
                <button class="btn btn--primary participant-card__btn">Подробнее</button>
            `;
        }

        // Add button click handler
        const btn = card.querySelector('.participant-card__btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal(participant);
            });
        }

        return card;
    }

    openModal(participant) {
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
        const events = this.getParticipantEvents(participant);

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

            ${events.length > 0 ? `
                <div class="modal__events">
                    <h3 class="modal__events-title">Мероприятия</h3>
                    <ul class="modal__events-list">
                        ${events.map(event => `
                            <li class="modal__event-item">
                                ${event.title} - ${event.startTime} (День ${event.day})
                            </li>
                        `).join('')}
                    </ul>
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
                            const author = this.participants.find(p => p.fullName === authorName);
                            if (author) {
                                return `<li class="modal__author-item" data-participant-id="${this.participants.indexOf(author)}">${authorName}</li>`;
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
        const authorItems = container.querySelectorAll('.modal__author-item[data-participant-id]');
        authorItems.forEach(item => {
            item.addEventListener('click', () => {
                const participantId = parseInt(item.getAttribute('data-participant-id'));
                const author = this.participants[participantId];
                if (author) {
                    this.closeModal();
                    setTimeout(() => this.openModal(author), 100);
                }
            });
        });
    }

    getParticipantEvents(participant) {
        if (!this.eventsData || !participant.events) return [];

        const events = [];
        participant.events.forEach(eventName => {
            const matchingEvents = this.eventsData.filter(event => {
                if (event.participants) {
                    return event.participants.some(p => p.name === participant.fullName);
                }
                return false;
            });
            events.push(...matchingEvents);
        });

        return events.slice(0, 5);
    }

    closeModal() {
        const modal = document.getElementById('participant-modal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticipantsPage();
    });
} else {
    new ParticipantsPage();
}

