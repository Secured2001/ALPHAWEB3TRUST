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
