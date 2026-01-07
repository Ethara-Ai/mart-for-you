import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useProfile } from "../../context/ProfileContext";

/**
 * ProfileForm - User profile editing form component
 *
 * A form for editing user profile information including name,
 * email, address, and phone. Uses controlled inputs with
 * profile context for state management. Includes comprehensive
 * input validation for all fields.
 *
 * @param {Object} props
 * @param {Function} props.onSave - Callback when save is clicked
 * @param {Function} props.onCancel - Callback when cancel is clicked
 * @param {boolean} props.compact - Whether to use compact layout
 * @param {string} props.className - Additional CSS classes
 */
function ProfileForm({ onSave, onCancel, compact = false, className = "" }) {
  const { darkMode, COLORS } = useTheme();
  const { userProfile, updateField, saveProfile, cancelEditing } = useProfile();

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Field character limits
  const fieldLimits = {
    firstName: 25,
    lastName: 25,
    email: 50,
    address: 100,
    city: 30,
    state: 30,
    zip: 10,
    country: 30,
    phone: 10,
  };

  // Validation rules
  const validators = {
    firstName: (value) => {
      if (!value || value.trim() === "") {
        return "First name is required";
      }
      if (value.trim().length < 2) {
        return "First name must be at least 2 characters";
      }
      if (value.length > fieldLimits.firstName) {
        return `First name must be ${fieldLimits.firstName} characters or less`;
      }
      if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return "First name can only contain letters, spaces, hyphens, and apostrophes";
      }
      return "";
    },
    lastName: (value) => {
      if (!value || value.trim() === "") {
        return "Last name is required";
      }
      if (value.trim().length < 2) {
        return "Last name must be at least 2 characters";
      }
      if (value.length > fieldLimits.lastName) {
        return `Last name must be ${fieldLimits.lastName} characters or less`;
      }
      if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return "Last name can only contain letters, spaces, hyphens, and apostrophes";
      }
      return "";
    },
    email: (value) => {
      if (!value || value.trim() === "") {
        return "Email is required";
      }
      if (value.length > fieldLimits.email) {
        return `Email must be ${fieldLimits.email} characters or less`;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      return "";
    },
    address: (value) => {
      if (value && value.trim().length > 0 && value.trim().length < 5) {
        return "Address must be at least 5 characters";
      }
      if (value && value.length > fieldLimits.address) {
        return `Address must be ${fieldLimits.address} characters or less`;
      }
      return "";
    },
    city: (value) => {
      if (value && value.trim().length > 0) {
        if (value.length > fieldLimits.city) {
          return `City must be ${fieldLimits.city} characters or less`;
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          return "City can only contain letters";
        }
        if (value.trim().length < 2) {
          return "City must be at least 2 characters";
        }
      }
      return "";
    },
    state: (value) => {
      if (value && value.trim().length > 0) {
        if (value.length > fieldLimits.state) {
          return `State must be ${fieldLimits.state} characters or less`;
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          return "State can only contain letters";
        }
        if (value.trim().length < 2) {
          return "State must be at least 2 characters";
        }
      }
      return "";
    },
    zip: (value) => {
      if (value && value.trim().length > 0) {
        if (value.length > fieldLimits.zip) {
          return `ZIP code must be ${fieldLimits.zip} characters or less`;
        }
        // Supports numeric ZIP/PIN codes only
        const zipRegex = /^[0-9]{5,10}$/;
        if (!zipRegex.test(value)) {
          return "ZIP code must be 5-10 digits";
        }
      }
      return "";
    },
    country: (value) => {
      if (value && value.trim().length > 0) {
        if (value.length > fieldLimits.country) {
          return `Country must be ${fieldLimits.country} characters or less`;
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          return "Country can only contain letters";
        }
        if (value.trim().length < 2) {
          return "Country must be at least 2 characters";
        }
      }
      return "";
    },
    phone: (value) => {
      if (value && value.trim().length > 0) {
        // Only allow digits
        if (!/^\d+$/.test(value)) {
          return "Phone number must contain only digits";
        }
        if (value.length !== 10) {
          return "Phone number must be exactly 10 digits";
        }
      }
      return "";
    },
  };

  // Validate a single field
  const validateField = (fieldName, value) => {
    const validator = validators[fieldName];
    if (validator) {
      return validator(value);
    }
    return "";
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validators).forEach((fieldName) => {
      const error = validateField(fieldName, userProfile[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validators).forEach((fieldName) => {
      allTouched[fieldName] = true;
    });
    setTouched(allTouched);

    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    if (onSave) {
      onSave();
    } else {
      saveProfile();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Clear errors and touched state
    setErrors({});
    setTouched({});

    if (onCancel) {
      onCancel();
    } else {
      cancelEditing();
    }
  };

  // Handle input change with validation
  const handleChange = (fieldName) => (e) => {
    const value = e.target.value;
    updateField(fieldName, value);

    // Validate on change if field has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  // Handle blur - validate and mark as touched
  const handleBlur = (fieldName) => () => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const error = validateField(fieldName, userProfile[fieldName]);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const inputBg = darkMode
    ? COLORS.dark.modalBackground
    : COLORS.light.background;
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const borderColor = darkMode
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(0, 0, 0, 0.2)";
  const errorColor = "#ef4444";
  const errorBgColor = darkMode
    ? "rgba(239, 68, 68, 0.1)"
    : "rgba(239, 68, 68, 0.05)";

  // Input field configuration
  const getInputClassName = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `mt-1 block w-full px-3 py-2 text-sm rounded-md border focus:ring-2 focus:outline-none shadow-sm transition-colors duration-200 ease-in-out ${
      compact ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"
    } ${hasError ? "border-red-500 focus:ring-red-500" : ""}`;
  };

  const getInputStyle = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return {
      backgroundColor: hasError ? errorBgColor : inputBg,
      color: textColor,
      borderColor: hasError ? errorColor : borderColor,
    };
  };

  const labelClassName = `block font-medium ${compact ? "text-xs" : "text-sm"}`;

  const errorClassName = `mt-1 text-xs ${compact ? "text-[10px]" : "text-xs"}`;

  // Render error message
  const renderError = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return (
        <p className={errorClassName} style={{ color: errorColor }}>
          {errors[fieldName]}
        </p>
      );
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className={`space-y-${compact ? "3" : "4"}`}>
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className={labelClassName}
              style={{ color: textColor }}
            >
              First Name <span style={{ color: errorColor }}>*</span>
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={userProfile.firstName}
              onChange={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
              maxLength={fieldLimits.firstName}
              className={getInputClassName("firstName")}
              style={getInputStyle("firstName")}
              aria-invalid={
                touched.firstName && errors.firstName ? "true" : "false"
              }
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
            />
            {renderError("firstName")}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className={labelClassName}
              style={{ color: textColor }}
            >
              Last Name <span style={{ color: errorColor }}>*</span>
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={userProfile.lastName}
              onChange={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
              maxLength={fieldLimits.lastName}
              className={getInputClassName("lastName")}
              style={getInputStyle("lastName")}
              aria-invalid={
                touched.lastName && errors.lastName ? "true" : "false"
              }
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {renderError("lastName")}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className={labelClassName}
            style={{ color: textColor }}
          >
            Email <span style={{ color: errorColor }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={userProfile.email}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
            maxLength={fieldLimits.email}
            className={getInputClassName("email")}
            style={getInputStyle("email")}
            aria-invalid={touched.email && errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {renderError("email")}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className={labelClassName}
            style={{ color: textColor }}
          >
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={userProfile.address}
            onChange={handleChange("address")}
            onBlur={handleBlur("address")}
            maxLength={fieldLimits.address}
            className={getInputClassName("address")}
            style={getInputStyle("address")}
            aria-invalid={touched.address && errors.address ? "true" : "false"}
            aria-describedby={errors.address ? "address-error" : undefined}
          />
          {renderError("address")}
        </div>

        {/* City and State Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* City */}
          <div>
            <label
              htmlFor="city"
              className={labelClassName}
              style={{ color: textColor }}
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={userProfile.city}
              onChange={handleChange("city")}
              onBlur={handleBlur("city")}
              maxLength={fieldLimits.city}
              className={getInputClassName("city")}
              style={getInputStyle("city")}
              aria-invalid={touched.city && errors.city ? "true" : "false"}
              aria-describedby={errors.city ? "city-error" : undefined}
            />
            {renderError("city")}
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className={labelClassName}
              style={{ color: textColor }}
            >
              State
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={userProfile.state}
              onChange={handleChange("state")}
              onBlur={handleBlur("state")}
              maxLength={fieldLimits.state}
              className={getInputClassName("state")}
              style={getInputStyle("state")}
              aria-invalid={touched.state && errors.state ? "true" : "false"}
              aria-describedby={errors.state ? "state-error" : undefined}
            />
            {renderError("state")}
          </div>
        </div>

        {/* ZIP and Country Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* ZIP */}
          <div>
            <label
              htmlFor="zip"
              className={labelClassName}
              style={{ color: textColor }}
            >
              ZIP Code
            </label>
            <input
              type="text"
              name="zip"
              id="zip"
              value={userProfile.zip}
              onChange={handleChange("zip")}
              onBlur={handleBlur("zip")}
              maxLength={fieldLimits.zip}
              inputMode="numeric"
              pattern="[0-9]*"
              className={getInputClassName("zip")}
              style={getInputStyle("zip")}
              aria-invalid={touched.zip && errors.zip ? "true" : "false"}
              aria-describedby={errors.zip ? "zip-error" : undefined}
            />
            {renderError("zip")}
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className={labelClassName}
              style={{ color: textColor }}
            >
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={userProfile.country}
              onChange={handleChange("country")}
              onBlur={handleBlur("country")}
              maxLength={fieldLimits.country}
              className={getInputClassName("country")}
              style={getInputStyle("country")}
              aria-invalid={
                touched.country && errors.country ? "true" : "false"
              }
              aria-describedby={errors.country ? "country-error" : undefined}
            />
            {renderError("country")}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className={labelClassName}
            style={{ color: textColor }}
          >
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={userProfile.phone}
            onChange={handleChange("phone")}
            onBlur={handleBlur("phone")}
            maxLength={fieldLimits.phone}
            inputMode="numeric"
            pattern="[0-9]*"
            className={getInputClassName("phone")}
            style={getInputStyle("phone")}
            placeholder="9876543210"
            aria-invalid={touched.phone && errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {renderError("phone")}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`mt-${compact ? "4" : "6"} flex space-x-3`}>
        {/* Save Button */}
        <button
          type="submit"
          className={`flex-1 py-2 px-4 font-medium rounded-md transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
            compact ? "text-sm py-1.5 px-3" : "text-sm"
          }`}
          style={{
            backgroundColor: primaryColor,
            color: darkMode
              ? COLORS.dark.modalBackground
              : COLORS.light.background,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Save Changes
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          className={`flex-1 py-2 px-4 font-medium rounded-md transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
            compact ? "text-sm py-1.5 px-3" : "text-sm"
          }`}
          style={{
            backgroundColor: "transparent",
            color: primaryColor,
            border: `1px solid ${primaryColor}`,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
