import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

/**
 * ShippingOptions - Shipping method selection component
 *
 * Displays available shipping options with radio buttons,
 * showing name, estimated delivery time, and price.
 *
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.compact - Whether to use compact layout
 * @param {Function} props.onSelect - Optional callback when shipping is selected
 */
function ShippingOptions({ className = '', compact = false, onSelect }) {
  const { darkMode, COLORS } = useTheme();
  const { shippingOptions, selectedShipping, setSelectedShipping } = useCart();

  // Handle shipping option change
  const handleChange = (optionId) => {
    setSelectedShipping(optionId);
    if (onSelect) {
      onSelect(optionId);
    }
  };

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const accentColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const selectedBg = darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.05)';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <div className={className}>
      {/* Section Title */}
      <h3 className="font-medium mb-2 text-xs" style={{ color: textColor }}>
        Shipping Method
      </h3>

      {/* Shipping Options - Horizontal on larger screens, stacked on mobile */}
      <div className={compact ? 'flex flex-wrap gap-2' : 'space-y-1.5'}>
        {shippingOptions.map((option) => {
          const isSelected = selectedShipping === option.id;

          return (
            <label
              key={option.id}
              className={`flex items-center rounded-md cursor-pointer transition-all ${
                compact ? 'flex-1 min-w-25 px-2 py-1.5' : 'px-3 py-2'
              }`}
              style={{
                backgroundColor: isSelected ? selectedBg : 'transparent',
                border: `1px solid ${isSelected ? accentColor : borderColor}`,
              }}
            >
              {/* Radio Button */}
              <input
                id={`shipping-${option.id}`}
                name="shipping-method"
                type="radio"
                checked={isSelected}
                onChange={() => handleChange(option.id)}
                className="h-3 w-3 cursor-pointer shrink-0"
                style={{
                  accentColor,
                }}
              />

              {/* Option Details */}
              <div className="ml-2 flex-1 min-w-0">
                <div className={compact ? 'flex flex-col' : 'flex justify-between items-center'}>
                  {/* Name */}
                  <span className="text-xs font-medium truncate" style={{ color: textColor }}>
                    {option.name.replace(' Shipping', '')}
                  </span>

                  {/* Price */}
                  <span
                    className="text-xs font-medium shrink-0"
                    style={{
                      color: option.price === 0 ? (darkMode ? '#4ade80' : '#16a34a') : textColor,
                    }}
                  >
                    {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                  </span>
                </div>
                {!compact && (
                  <span className="text-[10px] block" style={{ color: subtextColor }}>
                    {option.estimatedDelivery}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default ShippingOptions;
