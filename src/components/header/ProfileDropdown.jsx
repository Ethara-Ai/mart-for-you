import { motion } from 'framer-motion';
import { FiEdit } from 'react-icons/fi';
import { SECTION_IDS } from '../../constants';

/**
 * ProfileDropdown - Profile card dropdown component
 *
 * Displays user profile information in a dropdown menu
 * with avatar, name, email, address, and edit button.
 */
function ProfileDropdown({
  userProfile,
  fullName,
  formattedAddress,
  onEditProfile,
  darkMode,
  colors,
}) {
  const textColor = darkMode ? colors.dark.text : colors.light.text;
  const primaryColor = darkMode ? colors.dark.primary : colors.light.primary;
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <motion.div
      id={SECTION_IDS.PROFILE_CARD}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl overflow-hidden z-50"
      style={{
        backgroundColor: darkMode ? colors.dark.modalBackground : colors.light.modalBackground,
        boxShadow: darkMode ? '0 10px 40px rgba(0, 0, 0, 0.5)' : '0 10px 40px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Profile Header */}
      <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor }}>
        <img
          src={userProfile.avatar}
          alt="User profile"
          className="w-14 h-14 rounded-full object-cover border-2"
          style={{
            borderColor: primaryColor,
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate" style={{ color: textColor }}>
            {fullName}
          </h3>
          <p className="text-sm truncate" style={{ color: primaryColor }}>
            {userProfile.email}
          </p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-4">
        <p
          className="text-sm mb-3"
          style={{
            color: darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)',
          }}
        >
          {formattedAddress}
        </p>
        <button
          onClick={onEditProfile}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] font-medium text-sm"
          style={{
            backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
            color: primaryColor,
            border: `1px solid ${darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
          }}
        >
          <FiEdit className="h-4 w-4" />
          Edit Profile
        </button>
      </div>
    </motion.div>
  );
}

export default ProfileDropdown;
