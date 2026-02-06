document.addEventListener('DOMContentLoaded', () => {
    const languageBtn = document.getElementById('languageBtn');
    const languageModal = document.getElementById('languageModal');
    const closeLanguageModal = document.getElementById('closeLanguageModal');
    const languageOptions = document.querySelectorAll('.language-option');
    const currentLangSpan = document.getElementById('currentLang');

    const issueCards = document.querySelectorAll('.issue-card');
    const issueModal = document.getElementById('issueModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const issueForm = document.getElementById('issueForm');
    const modalTitle = document.getElementById('modalTitle');
    const issueTypeInput = document.getElementById('issueTypeInput');

    let selectedIssue = '';

    languageBtn.addEventListener('click', () => {
        languageModal.classList.add('active');
    });

    closeLanguageModal.addEventListener('click', () => {
        languageModal.classList.remove('active');
    });

    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) {
            languageModal.classList.remove('active');
        }
    });

    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            const langName = option.querySelector('.lang-name').textContent;
            currentLangSpan.textContent = lang.toUpperCase();
            languageModal.classList.remove('active');
        });
    });

    issueCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedIssue = card.dataset.issue;
            modalTitle.textContent = `Submit Issue Report - ${selectedIssue}`;
            issueTypeInput.value = selectedIssue;
            issueModal.classList.add('active');
        });
    });

    closeModal.addEventListener('click', () => {
        issueModal.classList.remove('active');
        issueForm.reset();
    });

    cancelBtn.addEventListener('click', () => {
        issueModal.classList.remove('active');
        issueForm.reset();
    });

    issueModal.addEventListener('click', (e) => {
        if (e.target === issueModal) {
            issueModal.classList.remove('active');
            issueForm.reset();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            issueModal.classList.remove('active');
            languageModal.classList.remove('active');
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {

    const cardElements = document.querySelectorAll('.issue-card, .wallet-card');
    const buttons = document.querySelectorAll('.btn');
    const formInputs = document.querySelectorAll('input, textarea');
    const metrics = document.querySelectorAll('.metric-number');

    cardElements.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.willChange = 'transform';
        });

        card.addEventListener('mouseleave', function() {
            this.style.willChange = 'auto';
        });
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    if (metrics.length > 0) {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        metrics.forEach(metric => observer.observe(metric));
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = 2000;
        const start = Date.now();
        const suffix = element.getAttribute('data-suffix') || '';

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(target * progress);
            element.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .slide-in-left {
            animation: slideInLeft 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('[data-animate="slide-in"]').forEach((el, index) => {
        el.style.animation = `slideInLeft 0.5s ease-out ${index * 0.1}s backwards`;
    });

    const scrollElements = document.querySelectorAll('.hero-content, .section-header, .issues-grid');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    scrollElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        scrollObserver.observe(el);
    });

    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.issue-card, .wallet-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (!isDark) return;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            card.style.setProperty('--mouse-x', xPercent + '%');
            card.style.setProperty('--mouse-y', yPercent + '%');
        });
    });
});

window.addEventListener('load', () => {
    document.querySelectorAll('[data-src]').forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
    });
});
