import { useTheme } from '../../context/ThemeContext';

/**
 * FormField - Reusable form field component
 *
 * A standardized form field with label, input, error display, and
 * character counter. Supports various input types and validation states.
 *
 * @param {Object} props
 * @param {string} props.label - Field label text
 * @param {string} props.name - Field name/id
 * @param {string} props.value - Current field value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.error - Error message to display
 * @param {boolean} props.touched - Whether field has been touched
 * @param {string} props.type - Input type (text, email, tel, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {number} props.maxLength - Maximum character length
 * @param {boolean} props.disabled - Whether field is disabled
 * @param {boolean} props.showCharCount - Show character counter
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.inputClassName - Additional input CSS classes
 *
 * @example
 * <FormField
 *   label="First Name"
 *   name="firstName"
 *   value={firstName}
 *   onChange={handleChange}
 *   onBlur={handleBlur}
 *   error={errors.firstName}
 *   touched={touched.firstName}
 *   required
 *   maxLength={50}
 * />
 */
function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched = false,
  type = 'text',
  placeholder,
  required = false,
  maxLength,
  disabled = false,
  showCharCount = false,
  className = '',
  inputClassName = '',
}) {
  const { darkMode, COLORS } = useTheme();

  // Show error only if field is touched and has error
  const showError = touched && error;
  const hasError = Boolean(showError);

  // Theme colors
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const inputBg = darkMode ? COLORS.dark.secondary : COLORS.light.background;
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const borderColor = hasError
    ? '#ef4444'
    : darkMode
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)';
  const errorColor = '#ef4444';
  const errorBgColor = darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)';
  const mutedTextColor = darkMode ? 'rgba(224, 224, 224, 0.6)' : 'rgba(51, 51, 51, 0.6)';

  // Character count
  const currentLength = value ? value.length : 0;
  const isNearLimit = maxLength && currentLength > maxLength * 0.8;

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      <label htmlFor={name} className="block text-sm font-medium mb-2" style={{ color: textColor }}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={`w-full px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
        style={{
          backgroundColor: inputBg,
          color: textColor,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor,
          '--tw-ring-color': primaryColor,
        }}
      />

      {/* Character counter and error row */}
      <div className="flex justify-between items-start mt-1">
        {/* Error message */}
        {showError && (
          <div
            id={`${name}-error`}
            className="text-xs px-2 py-1 rounded flex items-start gap-1"
            style={{
              color: errorColor,
              backgroundColor: errorBgColor,
            }}
            role="alert"
          >
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Character counter */}
        {showCharCount && maxLength && !showError && (
          <div
            className="text-xs ml-auto"
            style={{
              color: isNearLimit ? errorColor : mutedTextColor,
            }}
            aria-live="polite"
          >
            {currentLength} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormField;
