# Vasavi Seattle Donation System Setup

This guide will help you set up a complete donation system with Stripe payment processing.

## 🚀 What's Been Built

### Frontend Components:
- **DonationCard.jsx** - Complete donation form with Stripe integration
- **Toggle buttons** for one-time vs monthly donations
- **Amount input** with preset options ($25, $50, $100, $250, $500)
- **Card input** using Stripe Elements
- **Form validation** and error handling
- **Success/error messages** with visual feedback

### Backend Server:
- **Express.js server** for payment processing
- **Stripe integration** for secure card processing
- **Webhook handling** for payment confirmations
- **CORS enabled** for frontend communication

## 📋 Setup Steps

### 1. Stripe Account Setup
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification (required for nonprofits)
3. Get your API keys from the Stripe Dashboard

### 2. Environment Variables
Create a `.env` file in your project root:

```bash
# Stripe Keys (get these from your Stripe Dashboard)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Server Configuration
PORT=5000
```

### 3. Install Server Dependencies
```bash
# Install server dependencies
npm install express cors stripe
npm install --save-dev nodemon

# Or use the provided server-package.json
cp server-package.json package.json
npm install
```

### 4. Start the Backend Server
```bash
# Start the donation server
npm run dev

# The server will run on http://localhost:5000
```

### 5. Update Frontend API URL
In `DonationCard.jsx`, update the API endpoint:

```javascript
// Change this line to match your server URL
const response = await fetch('http://localhost:5000/api/create-payment-intent', {
```

## 🔒 Security Features

- **PCI Compliance** - Stripe handles all card data
- **No card storage** - Only payment tokens are processed
- **Webhook verification** - Ensures payment authenticity
- **CORS protection** - Restricts API access

## 💳 Payment Processing

### How It Works:
1. **User fills form** and enters card details
2. **Frontend creates** payment intent via your server
3. **Stripe processes** the payment securely
4. **Webhook confirms** successful payment
5. **User sees** success message

### Supported Payment Methods:
- All major credit cards (Visa, Mastercard, Amex, Discover)
- Debit cards
- Digital wallets (Apple Pay, Google Pay)

## 📱 Features

### Donation Options:
- **One-time donations** - Single payment
- **Monthly recurring** - Subscription setup (future enhancement)
- **Custom amounts** - Users can enter any amount
- **Preset amounts** - Quick selection buttons

### User Experience:
- **Real-time validation** - Form checks before submission
- **Loading states** - Visual feedback during processing
- **Error handling** - Clear messages for issues
- **Success confirmation** - Thank you message after donation

## 🎨 Customization

### Colors:
- **Primary**: `#ffd700` (yellow) for buttons and highlights
- **Secondary**: `#333` for text and borders
- **Success**: `#28a745` for confirmation messages
- **Error**: `#dc3545` for error messages

### Styling:
- **Responsive design** - Works on all screen sizes
- **Consistent with your site** - Uses your CSS variables
- **Professional appearance** - Clean, modern interface

## 🚨 Important Notes

### For Production:
1. **Use live Stripe keys** (not test keys)
2. **Set up proper webhook endpoints** on your domain
3. **Enable HTTPS** for secure communication
4. **Set up database** for donation tracking
5. **Configure email notifications** for donors

### Testing:
- **Use Stripe test cards** during development
- **Test webhook endpoints** with Stripe CLI
- **Verify error handling** with invalid inputs

## 📊 Donation Tracking

### What Gets Stored:
- **Donation amount** and type
- **Donor information** (name, email, message)
- **Payment status** and confirmation
- **Transaction ID** from Stripe

### Future Enhancements:
- **Donor dashboard** for recurring donors
- **Donation history** and receipts
- **Admin panel** for donation management
- **Email campaigns** for donor engagement

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors** - Ensure server is running and CORS is enabled
2. **Stripe key errors** - Verify your API keys are correct
3. **Payment failures** - Check Stripe Dashboard for error details
4. **Webhook issues** - Verify webhook endpoint and secret

### Getting Help:
- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in your dashboard
- **React Stripe**: [github.com/stripe/stripe-react](https://github.com/stripe/stripe-react)

## 🎯 Next Steps

1. **Set up Stripe account** and get API keys
2. **Configure environment variables**
3. **Start the backend server**
4. **Test with Stripe test cards**
5. **Customize styling** to match your brand
6. **Deploy to production** when ready

Your donation system is now ready to accept real donations and help support Vasavi Seattle's mission! 🎉
