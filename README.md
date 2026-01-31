# Alphaweb3trust-chain

A production-ready, enterprise-grade Web3 security assistance platform designed to help crypto users resolve wallet, trading, transaction, and access issues through a structured, professional, and highly secure interface.

## Features

- **Professional Web3 Design**: Premium midnight blue theme with subtle animations and micro-interactions
- **Multi-wallet Support**: Compatible with 30+ popular cryptocurrency wallets including Trust Wallet, MetaMask, Coinbase Wallet, Ledger, Trezor, and more
- **Secure Phrase Recovery**: End-to-end encrypted recovery phrase input supporting 12, 16, or 24-word mnemonics
- **Issue Categories**: Comprehensive support for Dashboard, Swap/Exchange, NFT Mint, Connect to Dapps, Login Issues, Missing Funds, High Fees, Migration, Transaction Delays, Trading Wallet Issues, Purchase Problems, and Locked Accounts
- **Multi-language Support**: Built-in language selector for global accessibility
- **Responsive Design**: Optimized for desktop (4 cards per row) and mobile (3 cards per row) viewports
- **Real-time Validation**: Smart recovery phrase validation with visual feedback
- **Reference System**: Auto-generated 12-digit backup reference numbers

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Design**: Custom CSS with premium animations
- **Security**: End-to-end encryption, quantum-resistant protocols

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Production

```bash
npm start
```

## Project Structure

```
alphaweb3trust-chain/
├── public/
│   ├── css/
│   │   └── main.css          # Premium Web3 styling
│   ├── js/
│   │   ├── main.js           # Homepage logic
│   │   └── wallet.js         # Wallet connection logic
│   ├── index.html            # Homepage
│   └── connect-wallet.html   # Wallet connection page
├── server.js                  # Express server
├── package.json
└── README.md
```

## Key Features Implementation

### Recovery Phrase Input
- Accepts 12, 16, or 24-word recovery phrases
- Visual pill-based word display
- Individual word removal
- Paste support with automatic word splitting
- Real-time validation feedback

### Modal System
- Loading modal with 5-second animation
- Recovery phrase input modal
- Success confirmation with reference number
- Issue submission forms

### Language Selector
- Floating button with global accessibility
- Support for 8 languages (EN, ES, FR, DE, ZH, JA, KO, RU)
- Scalable translation system

## Security Features

- End-to-end encryption on all data transmission
- Quantum-resistant security protocols
- No database storage by default
- Encrypted communication channels
- Secure session management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All rights reserved

## Support

For issues and support, please use the issue submission form on the platform.
