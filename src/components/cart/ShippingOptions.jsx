import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

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
  const subtextColor = darkMode
    ? 'rgba(224, 224, 224, 0.7)'
    : 'rgba(51, 51, 51, 0.7)';
  const accentColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const hoverBg = darkMode
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)';
  const selectedBg = darkMode
    ? 'rgba(96, 165, 250, 0.1)'
    : 'rgba(37, 99, 235, 0.05)';
  const borderColor = darkMode
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  return (
    <div className={className}>
      {/* Section Title */}
      <h3
        className={`font-medium mb-3 ${compact ? 'text-xs' : 'text-sm'}`}
        style={{ color: textColor }}
      >
        Shipping Method
      </h3>

      {/* Shipping Options List */}
      <div className="space-y-2">
        {shippingOptions.map((option) => {
          const isSelected = selectedShipping === option.id;

          return (
            <label
              key={option.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                compact ? 'p-2' : 'p-3'
              }`}
              style={{
                backgroundColor: isSelected ? selectedBg : 'transparent',
                border: `1px solid ${isSelected ? accentColor : borderColor}`,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {/* Radio Button */}
              <input
                id={`shipping-${option.id}`}
                name="shipping-method"
                type="radio"
                checked={isSelected}
                onChange={() => handleChange(option.id)}
                className="h-4 w-4 cursor-pointer flex-shrink-0"
                style={{
                  accentColor: accentColor,
                }}
              />

              {/* Option Details */}
              <div className="ml-3 flex-grow">
                <div className="flex justify-between items-start">
                  {/* Name and Delivery Time */}
                  <div>
                    <span
                      className={`block font-medium ${compact ? 'text-xs' : 'text-sm'}`}
                      style={{ color: textColor }}
                    >
                      {option.name}
                    </span>
                    <span
                      className={`block ${compact ? 'text-xs' : 'text-xs'}`}
                      style={{ color: subtextColor }}
                    >
                      {option.estimatedDelivery}
                    </span>
                  </div>

                  {/* Price */}
                  <span
                    className={`font-medium flex-shrink-0 ml-2 ${compact ? 'text-xs' : 'text-sm'}`}
                    style={{ color: textColor }}
                  >
                    {option.price === 0 ? (
                      <span
                        className="text-green-600 dark:text-green-400"
                        style={{
                          color: darkMode ? '#4ade80' : '#16a34a',
                        }}
                      >
                        Free
                      </span>
                    ) : (
                      `$${option.price.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Selected Option Summary (Optional) */}
      {selectedShipping && (
        <div
          className={`mt-3 pt-3 border-t ${compact ? 'text-xs' : 'text-xs'}`}
          style={{ borderColor }}
        >
          <p style={{ color: subtextColor }}>
            {(() => {
              const selected = shippingOptions.find(
                (opt) => opt.id === selectedShipping
              );
              if (selected) {
                return `Estimated delivery: ${selected.estimatedDelivery}`;
              }
              return '';
            })()}
          </p>
        </div>
      )}
    </div>
  );
}

export default ShippingOptions;
