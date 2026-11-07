import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { X, ShieldCheck } from 'lucide-react';

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
  if (!isOpen) return null;

  const PAYPAL_CLIENT_ID = "BAAczSdBiwb6z6E_rAri1brmC85V-zqDSi7uPdC7mhciu4mjdORNmCPv_N-jEW8RSkBOs85_z-QqxPz0KM";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-slate-100">
        
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Upgrade to {planName}</h3>
          <p className="text-sm text-slate-500 mt-1">
            Total Amount: <span className="font-bold text-slate-900">${price} USD</span>
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
            {errorMessage}
          </div>
        )}

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

        <p className="text-[11px] text-center text-slate-400 mt-4">
          Safe & Secure payment processed by PayPal.
        </p>
      </div>
    </div>
  );
};