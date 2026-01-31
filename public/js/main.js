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

    issueForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = issueForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const formData = {
            issue_type: selectedIssue,
            full_name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            description: document.getElementById('issueDescription').value,
            wallet_address: document.getElementById('walletAddress').value,
            transaction_hash: document.getElementById('transactionHash').value,
            amount: document.getElementById('amountInvolved').value
        };

        try {
            const response = await fetch('/api/submit-issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                alert('Your issue report has been submitted successfully. Our support team will contact you within 24 hours.');
                issueModal.classList.remove('active');
                issueForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            } else {
                throw new Error(result.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting issue:', error);
            alert('An error occurred while submitting your report. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            issueModal.classList.remove('active');
            languageModal.classList.remove('active');
        }
    });
});
