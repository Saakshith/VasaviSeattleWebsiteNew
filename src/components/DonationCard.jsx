import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faPaypal, faCreditCard, faUniversity, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faPaypal as faPaypalBrand, faApplePay } from '@fortawesome/free-brands-svg-icons';
import "../styles/DonationCard.css";

const DonationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [donationType, setDonationType] = useState('once');
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [donationStatus, setDonationStatus] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const presetAmounts = [50, 100, 150, 200];
  const totalSteps = 3;

  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      setAmount(parseFloat(value));
    } else {
      setAmount(0);
    }
  };

  const handleDonorInfoChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    console.log('Payment method selected:', method);
    setPaymentMethod(method);
    if (method === 'bank') {
      setShowBankDetails(true);
      console.log('Bank details should be visible now');
    } else {
      setShowBankDetails(false);
    }
  };

  // PayPal Integration
  useEffect(() => {
    console.log('PayPal useEffect triggered:', { paymentMethod, currentStep });
    if (paymentMethod === 'paypal' && currentStep === 3) {
      const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
      if (!paypalClientId || paypalClientId === 'your_paypal_client_id_here') {
        console.error('PayPal Client ID not configured');
        return;
      }
      
      console.log('Loading PayPal script...');
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
      script.onload = () => {
        console.log('PayPal script loaded successfully');
        if (window.paypal) {
          console.log('Creating PayPal buttons...');
          window.paypal.Buttons({
            createOrder: (data, actions) => {
              // For monthly donations, we'll need to create a subscription plan first
              // For now, handle as one-time payment but mark it as monthly
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: amount.toString()
                  },
                  description: `Donation to Vasavi Seattle - ${donorInfo.name || 'Anonymous'} - ${donationType === 'monthly' ? 'Monthly' : 'One-time'}`
                }]
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then((details) => {
                setDonationStatus('success');
                // Don't reset donationType - preserve the user's choice
                setTimeout(() => {
                  setCurrentStep(1);
                  setAmount(100);
                  setCustomAmount('');
                  setDonorInfo({ name: '', email: '', message: '' });
                  setPaymentMethod('');
                  setDonationStatus(null);
                }, 3000);
              });
            },
            onError: (err) => {
              setDonationStatus('error');
              console.error('PayPal error:', err);
            }
          }).render('#paypal-button-container');
        }
      };
      document.body.appendChild(script);
    }
  }, [paymentMethod, currentStep, amount, donorInfo]);

  const handleVenmoPayment = () => {
    const venmoUsername = process.env.REACT_APP_VENMO_USERNAME;
    if (!venmoUsername || venmoUsername === 'your-venmo-username') {
      alert('Venmo username not configured. Please contact the administrator.');
      return;
    }
    const venmoUrl = `https://venmo.com/${venmoUsername}?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=Donation to Vasavi Seattle`;
    window.open(venmoUrl, '_blank');
  };

  const handleCashAppPayment = () => {
    const cashAppUsername = process.env.REACT_APP_CASHAPP_USERNAME;
    if (!cashAppUsername || cashAppUsername === 'your-cashapp-username') {
      alert('Cash App username not configured. Please contact the administrator.');
      return;
    }
    const cashAppUrl = `https://cash.app/$${cashAppUsername}/${amount}`;
    window.open(cashAppUrl, '_blank');
  };

  const handleApplePayPayment = () => {
    // Apple Pay integration would go here
    // For now, show a message
    alert('Apple Pay integration coming soon!');
  };



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            {/* Toggle Buttons */}
            <div className="donation-toggle">
              <button
                type="button"
                className={`toggle-btn ${donationType === 'once' ? 'active' : ''}`}
                onClick={() => setDonationType('once')}
              >
                GIVE ONCE
              </button>
              <button
                type="button"
                className={`toggle-btn ${donationType === 'monthly' ? 'active' : ''}`}
                onClick={() => setDonationType('monthly')}
              >
                MONTHLY
              </button>
            </div>

            {/* Amount Selection */}
            <h2 className="amount-heading">Choose An Amount To Give</h2>
            
            {/* Preset Amounts */}
            <div className="preset-amounts">
              {presetAmounts.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  className={`preset-btn ${amount === presetAmount && !customAmount ? 'active' : ''}`}
                  onClick={() => handleAmountChange(presetAmount)}
                >
                  ${presetAmount} USD
                </button>
              ))}
                      {customAmount === '' ? (
          <button
            type="button"
            className="preset-btn custom-amount-btn"
            onClick={() => setCustomAmount(' ')}
          >
            Other Amount
          </button>
        ) : (
          <div className="amount-input-container">
            <div className="amount-input">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                value={customAmount === ' ' ? '' : customAmount}
                onChange={handleCustomAmountChange}
                className="amount-field"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                autoFocus
              />
              <span className="currency-code">USD</span>
              <button
                type="button"
                className="clear-amount-btn"
                onClick={() => setCustomAmount('')}
                title="Clear custom amount"
              >
                ×
              </button>
            </div>
          </div>
        )}
            </div>



            {/* Next Button */}
            <button
              type="button"
              onClick={nextStep}
              className="step-btn next-btn"
              disabled={amount <= 0}
            >
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2 className="step-heading">Your Information</h2>
            
            <form className="donor-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={donorInfo.name}
                  onChange={handleDonorInfoChange}
                  placeholder="Enter your full name"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={donorInfo.email}
                  onChange={handleDonorInfoChange}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={donorInfo.message}
                  onChange={handleDonorInfoChange}
                  placeholder="Leave a message with your donation"
                  className="form-textarea"
                  rows="3"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="step-navigation">
                <button
                  type="button"
                  onClick={prevStep}
                  className="step-btn prev-btn"
                >
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={nextStep}
                  className="step-btn next-btn"
                  disabled={!donorInfo.name.trim() || !donorInfo.email.trim()}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2 className="step-heading">Payment Method</h2>
            
            {/* Payment Method Selection */}
            <div className="payment-methods">
              {donationType === 'monthly' ? (
                // Monthly donations: PayPal only
                <div className="monthly-payment-notice">
                  <div className="monthly-notice-icon">
                    <FontAwesomeIcon icon={faPaypalBrand} />
                  </div>
                  <h4>Monthly Donations</h4>
                  <p>Monthly recurring donations require PayPal for automatic billing and subscription management.</p>
                  <button
                    type="button"
                    className="payment-method-btn paypal-monthly-btn"
                    onClick={() => handlePaymentMethodSelect('paypal')}
                  >
                    <FontAwesomeIcon icon={faPaypalBrand} />
                    <span>Continue with PayPal</span>
                  </button>
                </div>
              ) : (
                // One-time donations: All payment methods
                <>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodSelect('paypal')}
                  >
                    <FontAwesomeIcon icon={faPaypalBrand} />
                    <span>PayPal</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'venmo' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodSelect('venmo')}
                  >
                    <FontAwesomeIcon icon={faMobileAlt} />
                    <span>Venmo</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'cashapp' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodSelect('cashapp')}
                  >
                    <FontAwesomeIcon icon={faCreditCard} />
                    <span>Cash App</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'apple' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodSelect('apple')}
                  >
                    <FontAwesomeIcon icon={faApplePay} />
                    <span>Apple Pay</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodSelect('bank')}
                  >
                    <FontAwesomeIcon icon={faUniversity} />
                    <span>Bank Transfer</span>
                  </button>
                </>
              )}
            </div>

            {/* Payment Forms */}
            {paymentMethod === 'paypal' && (
              <div className="payment-form">
                {process.env.REACT_APP_PAYPAL_CLIENT_ID && process.env.REACT_APP_PAYPAL_CLIENT_ID !== 'your_paypal_client_id_here' ? (
                  <>
                    <div id="paypal-button-container"></div>
                    <p className="payment-note">Click the PayPal button above to complete your donation securely.</p>
                  </>
                ) : (
                  <div className="payment-setup-message">
                    <h4>PayPal Not Configured</h4>
                    <p>PayPal integration requires setup. Please add your PayPal Client ID to the .env file:</p>
                    <code>REACT_APP_PAYPAL_CLIENT_ID=your_actual_client_id</code>
                    <p><em>Contact the administrator to complete PayPal setup.</em></p>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'venmo' && (
              <div className="payment-form">
                <div className="payment-action">
                  <h4>Complete Donation via Venmo</h4>
                  <p>Click the button below to open Venmo and send your donation.</p>
                  <button
                    type="button"
                    onClick={handleVenmoPayment}
                    className="payment-action-btn venmo-btn"
                  >
                    <FontAwesomeIcon icon={faMobileAlt} />
                    Send ${amount} via Venmo
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'cashapp' && (
              <div className="payment-form">
                <div className="payment-action">
                  <h4>Complete Donation via Cash App</h4>
                  <p>Click the button below to open Cash App and send your donation.</p>
                  <button
                    type="button"
                    onClick={handleCashAppPayment}
                    className="payment-action-btn cashapp-btn"
                  >
                    <FontAwesomeIcon icon={faCreditCard} />
                    Send ${amount} via Cash App
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'apple' && (
              <div className="payment-form">
                <div className="payment-action">
                  <h4>Apple Pay Integration</h4>
                  <p>Apple Pay integration is coming soon! For now, please use another payment method.</p>
                  <button
                    type="button"
                    onClick={handleApplePayPayment}
                    className="payment-action-btn apple-btn"
                    disabled
                  >
                    <FontAwesomeIcon icon={faApplePay} />
                    Apple Pay (Coming Soon)
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="payment-form">
                <div className="payment-action">
                  <h4>Bank Transfer Details</h4>
                  <p>Use the following details to transfer your donation directly to our account:</p>
                  <div className="bank-details">
                    <div className="bank-detail-item">
                      <strong>Bank:</strong> Chase Bank
                    </div>
                    <div className="bank-detail-item">
                      <strong>Account Name:</strong> Vasavi Seattle
                    </div>
                    <div className="bank-detail-item">
                      <strong>Account Number:</strong> ****-****-1234
                    </div>
                    <div className="bank-detail-item">
                      <strong>Routing Number:</strong> 021000021
                    </div>
                    <div className="bank-detail-item">
                      <strong>Reference:</strong> Donation - {donorInfo.name || 'Anonymous'}
                    </div>
                  </div>
                  <p className="payment-note">
                    Please include your name in the reference field so we can thank you properly.
                  </p>
                </div>
              </div>
            )}

            {/* Donation Summary */}
            <div className="donation-summary">
              <h3>Donation Summary</h3>
              <div className="summary-item">
                <span>Type:</span>
                <span>{donationType === 'once' ? 'One-time' : 'Monthly'} Donation</span>
              </div>
              <div className="summary-item">
                <span>Amount:</span>
                <span>${amount}</span>
              </div>
              <div className="summary-item">
                <span>Name:</span>
                <span>{donorInfo.name}</span>
              </div>
              {donationType === 'monthly' && (
                <div className="summary-item monthly-note">
                  <span>Note:</span>
                  <span>Monthly donations will be processed via PayPal for recurring billing</span>
                </div>
              )}
            </div>

            {/* Navigation and Submit */}
            <div className="step-navigation">
              <button
                type="button"
                onClick={prevStep}
                className="step-btn prev-btn"
              >
                Back
              </button>
              

            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="donation-form">
      {/* Step Content */}
      {renderStepContent()}


    
    </div>
  );
};

const DonationCard = () => {
  return (
    <div className='donation-card'>
      <DonationForm />
    </div>
  );
};

export default DonationCard;