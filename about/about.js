// About Page JavaScript

class AboutPage {
    constructor() {
        this.galleryImages = [
            'https://static.tildacdn.com/tild3239-3138-4238-b537-623835373264/IMG_0311_resized.jpg',
            'https://cdnstatic.rg.ru/uploads/images/2025/03/17/tass_33661755_7f9.jpg',
            'https://www.m24.ru/b/d/nAgWUB67nUJkzJ7jP6WK-5T1moDt-dvtg32Qhv2YqzbZJC3PU2mcy3ou4cNb8QfTuNGV_CeILNx_SL-4hSMhMXXfqDgJqgjJnSrxUBPiuy9YKH1Ypyom2ybiaByXQz5QEreaOfg=nSWc90QKYWDeO2b5qpEJ8w.jpg',
            'https://www.m24.ru/b/d/nAgWUB67nUJkzJ7jP6WK-5T1m4Dt-dvtg32Qhv2YqzbZJC3PU2mcy3ou4cNb8QfTuNGV_CeILNx_SL-4hSMhMXXfqDgJqgjJnSrxUBPiuy9YKH1Ypyom2ybiaByXQz5QEreaOfg=ETBPiqfQy6JLXe-gtTKUfQ.jpg',
            'https://www.timeout.ru/wp-content/uploads/2021/06/photo_2021-06-15-15.28.09.jpeg',
            'https://mcdn2.tvzvezda.ru/storage/default/2023/05/11/79510d46c1eb446fb6b9dfad98e5209f.jpg',
            'https://rgdb.ru/images/News_main/2022/06/06/01/knizhnyj-festival-krasnaya-ploshchad-2022-1.jpg',
            'https://lp-cms-production.imgix.net/2024-09/Moscow-Book-Fest-bb4c7191fe4c.jpg?auto=format,compress&q=72&fit=crop',
            'https://mediapravda.ru/wp-content/uploads/2025/06/krasnaja-i-knizhnaja-ploshhad-1d1ec50.jpg',
            'https://img.gazeta.ru/files3/418/21202418/upload-SSR54868-pic4_zoom-1500x1500-33174.jpg',
            'https://sdo-journal.ru/images/stories/news/festival_kr_pl2023_photo14.jpg',
            'https://static.mk.ru/upload/entities/2025/06/04/17/photoreportsImages/detailPicture/2b/e0/f2/db/60dfe24eac900dddf96f841db127e78f.jpg',
            'https://static.mk.ru/upload/entities/2025/06/04/17/photoreportsImages/detailPicture/c0/27/ed/35/9b31087c1d7d49518b494dd5d2417507.jpg',
            'https://www.svetlovka.ru/upload/iblock/e2d/a6pm7rxgmb8i9g3jkzvs8lw10p4px00g.JPG',
            'https://cdnstatic.rg.ru/uploads/photogallery/2025/06/05/4y5a4439m_cd0.jpg',
            "https://cdnstatic.rg.ru/uploads/photogallery/2025/06/04/3o7a4826jpg_3a0.jpg"
        ];
        
        this.init();
    }

    init() {
        this.setupFAQ();
        this.setupGallery();
        this.setupGalleryModal();
    }

    setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-item__question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-item__answer');
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQ items
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.setAttribute('aria-expanded', 'false');
                        const otherAnswer = q.closest('.faq-item').querySelector('.faq-item__answer');
                        otherAnswer.setAttribute('aria-hidden', 'true');
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.setAttribute('aria-hidden', 'true');
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.setAttribute('aria-hidden', 'false');
                }
            });
        });
    }

    setupGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid) return;

        this.galleryImages.forEach((imageUrl, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-index', index);
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `Фото с фестиваля ${index + 1}`;
            img.loading = 'lazy';
            img.decoding = 'async';
            
            galleryItem.appendChild(img);
            galleryItem.addEventListener('click', () => this.openGalleryModal(index));
            
            galleryGrid.appendChild(galleryItem);
        });
    }

    setupGalleryModal() {
        const modal = document.getElementById('gallery-modal');
        const modalImage = document.getElementById('gallery-modal-image');
        const modalClose = modal?.querySelector('.gallery-modal__close');
        const modalOverlay = modal?.querySelector('.gallery-modal__overlay');

        if (!modal || !modalImage) return;

        // Close modal handlers
        const closeModal = () => {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });
    }

    openGalleryModal(index) {
        const modal = document.getElementById('gallery-modal');
        const modalImage = document.getElementById('gallery-modal-image');
        
        if (!modal || !modalImage) return;

        const imageUrl = this.galleryImages[index];
        modalImage.src = imageUrl;
        modalImage.alt = `Фото с фестиваля ${index + 1}`;
        
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});

