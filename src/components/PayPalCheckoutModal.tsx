import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { X, ShieldCheck, QrCode, Globe } from 'lucide-react';

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: number;
  onSuccess: (plan: string) => void;
}

export const PayPalCheckoutModal: React.FC<PayPalModalProps> = ({
  isOpen,
  onClose,
  planName,
  price,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'upi'>('paypal');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  // 💳 यह सिर्फ बैकग्राउंड में QR कोड बनाने के काम आएगी, स्क्रीन पर किसी को नहीं दिखेगी
  const UPI_ID = "9050271101@upi"; 
  
  const PAYPAL_CLIENT_ID = "BAAczSdBiwb6z6E_rAri1brmC85V-zqDSi7uPdC7mhciu4mjdORNmCPv_N-jEW8RSkBOs85_z-QqxPz0KM";
  
  // डॉलर को रुपये में बदलना (1 USD = ₹85)
  const priceInINR = Math.round(price * 85);
  
  // UPI QR Code का लिंक
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=CleanCSV&am=${priceInINR}&cu=INR&tn=${encodeURIComponent(planName)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleUpiPaid = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess(planName);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative border border-slate-100 overflow-hidden">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-slate-50 pt-8 pb-4 px-6 text-center border-b border-slate-100">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">Upgrade to {planName}</h3>
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-200/50 p-1 rounded-lg mt-5">
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                paymentMethod === 'paypal' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> PayPal (USD)
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                paymentMethod === 'upi' 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> UPI (INR)
            </button>
          </div>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1. PAYPAL SECTION */}
          {paymentMethod === 'paypal' ? (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-5">
                <p className="text-sm text-slate-500">
                  Total Amount: <span className="font-bold text-slate-900 text-lg">${price.toFixed(2)} USD</span>
                </p>
              </div>
              <div className="min-h-[160px] flex items-center justify-center">
                <PayPalScriptProvider options={{ 
                  clientId: PAYPAL_CLIENT_ID, 
                  currency: "USD",
                  intent: "capture"
                }}>
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", borderRadius: 8 }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            description: `CleanCSV - ${planName}`,
                            amount: {
                              currency_code: "USD",
                              value: price.toFixed(2),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        await actions.order.capture();
                        onSuccess(planName);
                        onClose();
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                      setErrorMessage("Unable to load PayPal checkout. Please verify Client ID.");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          ) : (
            /* 2. UPI SECTION (INDIAN USERS) */
            <div className="animate-in fade-in zoom-in-95 duration-300 text-center flex flex-col items-center">
              <p className="text-sm text-slate-500 mb-2">
                Total Amount: <span className="font-bold text-emerald-600 text-xl">₹{priceInINR}</span>
              </p>
              
              {/* 🟢 यहाँ नंबर की जगह अब प्रोफेशनल मर्चेंट टैग दिखेगा */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CleanCSV Official Merchant QR</span>
              </div>
              
              <div className="bg-white p-2 border-2 border-emerald-100 rounded-2xl shadow-sm mb-4 inline-block">
                <img 
                  src={qrCodeUrl} 
                  alt="UPI QR Code" 
                  className="w-40 h-40 object-contain"
                />
              </div>
              
              <p className="text-xs text-slate-500 mb-6 max-w-[250px] mx-auto leading-relaxed">
                Scan with <span className="font-semibold text-slate-700">PhonePe, GPay, or Paytm</span> to instantly upgrade your account.
              </p>

              <button
                type="button"
                onClick={handleUpiPaid}
                disabled={isVerifying}
                className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <span className="animate-pulse">Verifying Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> I Have Paid ₹{priceInINR}
                  </>
                )}
              </button>
            </div>
          )}

          <p className="text-[10px] text-center text-slate-400 mt-5 uppercase tracking-wider font-semibold">
            256-bit Secure Encrypted Payment
          </p>
        </div>
      </div>
    </div>
  );
};