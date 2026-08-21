import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/PageHero.jsx";
import Reveal from "../../components/Reveal.jsx";

export default function GiftCards({ onAddToCart, onBack, onRequireSignUp }) {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState(100);

  const presets = [50, 100, 200];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
  };

  const currentAmount = selectedPreset || 0;
  const isValidAmount = currentAmount > 0;

  const handlePayNow = (e) => {
    if (e) e.preventDefault();
    if (!isValidAmount) return;

    const giftCardItem = {
      name: `SipNow Digital Gift Card ($${currentAmount})`,
      price: `$${currentAmount.toFixed(2)}`,
      category: "Gift Card",
      categoryGroup: "offers",
      section: "gift-cards",
      image:
        "https://media.sipnow.com.au/sipnow/products/gift-card-example.webp",
      rating: 5.0,
      reviewCount: 1,
    };

    if (onAddToCart) {
      onAddToCart(giftCardItem, 1);
    }

    if (onRequireSignUp) {
      onRequireSignUp();
    } else {
      navigate("/signup");
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen pt-32 lg:pt-36 pb-16">
      <PageHero
        description="Select or enter a gift card amount to share curated cellar excellence instantly."
        onBack={onBack || (() => navigate("/"))}
        tag="Offers & Services"
        title="Gift Card"
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center">
        <div className="w-full max-w-xl flex flex-col items-center">
          {/* CENTERED AMOUNT SELECTION BOX */}
          <div className="glass-panel glow-border border border-primary/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 bg-surface-container-high/60 backdrop-blur-xl w-full">
            {/* LARGE INPUT FIELD */}
            <div className="space-y-2 text-left">
              <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-semibold text-center">
                Gift Card Amount
              </label>

              <div className="relative flex items-center">
                <span className="absolute left-6 text-xl font-bold text-primary pointer-events-none">
                  $
                </span>

                <input
                  type="text"
                  readOnly
                  value={selectedPreset}
                  className="w-full bg-surface-container-lowest/80 border border-primary/30 rounded-2xl py-4 pl-11 pr-6 text-center text-2xl font-bold text-on-surface focus:outline-none cursor-default select-none transition-all"
                />
              </div>
            </div>

            {/* THREE PRESET BUTTONS ($50, $100, $200) */}
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant/80 font-medium">
                Select Preset
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {presets.map((amount) => {
                  const isSelected = selectedPreset === amount;

                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handlePresetSelect(amount)}
                      className={`rounded-2xl py-3.5 px-3 text-base font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "primary-gradient text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                          : "bg-surface-container-lowest/60 border-primary/20 text-on-surface hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      ${amount}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LARGE ROUNDED PAY NOW BUTTON */}
            <div className="pt-4">
              <button
                type="button"
                disabled={!isValidAmount}
                onClick={handlePayNow}
                className="w-full primary-gradient py-4 rounded-full font-label-md text-white text-base shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">
                  payments
                </span>

                <span>
                  {isValidAmount
                    ? `Pay Now — $${currentAmount.toFixed(2)}`
                    : "Pay Now"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
