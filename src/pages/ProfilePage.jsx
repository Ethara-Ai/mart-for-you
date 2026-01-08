import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiEdit,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiX,
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';
import { ProfileForm } from '../components/profile';

/**
 * InfoCard - Displays a labeled info field with an icon
 */
function InfoCard({
  icon: Icon,
  label,
  value,
  maxLines = 2,
  darkMode,
  primaryColor,
  subtextColor,
  textColor,
}) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg overflow-hidden"
      style={{
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{
          backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.1)',
        }}
      >
        <Icon className="w-5 h-5" style={{ color: primaryColor }} />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-xs font-medium mb-1" style={{ color: subtextColor }}>
          {label}
        </p>
        <p
          className="text-sm font-medium wrap-break-word overflow-hidden"
          style={{
            color: textColor,
            display: '-webkit-box',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
          }}
          title={value || 'Not provided'}
        >
          {value || 'Not provided'}
        </p>
      </div>
    </div>
  );
}

/**
 * ProfilePage - User profile management page component
 *
 * Displays user profile information with the ability to view and edit
 * personal details, address, and contact information.
 */
function ProfilePage() {
  const { darkMode, COLORS } = useTheme();
  const { showSuccess } = useToast();
  const {
    userProfile,
    startEditing,
    saveProfile,
    cancelEditing,
    getFullName,
    getFormattedAddress,
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
    startEditing();
  };

  // Handle save
  const handleSave = () => {
    saveProfile();
    setIsEditing(false);
    showSuccess('Profile updated successfully');
  };

  // Handle cancel
  const handleCancel = () => {
    cancelEditing();
    setIsEditing(false);
  };

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const cardBg = darkMode ? COLORS.dark.secondary : COLORS.light.background;

  return (
    <main
      className="min-h-screen py-8"
      style={{
        background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
      }}
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {/* Back Link */}
          <Link
            to="/home"
            className="inline-flex items-center text-sm font-medium mb-4 hover:opacity-80 transition-opacity"
            style={{ color: primaryColor }}
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{
                  color: textColor,
                  fontFamily: "'Metropolis', sans-serif",
                }}
              >
                My Profile
              </h1>
              <p className="mt-1 text-sm" style={{ color: subtextColor }}>
                Manage your personal information and preferences
              </p>
            </div>

            {/* Edit Button - only show when not editing */}
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all hover:opacity-80"
                style={{
                  backgroundColor: primaryColor,
                  color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                }}
              >
                <FiEdit className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Profile Card - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1 h-full"
          >
            <div
              className="rounded-lg p-6 text-center h-full flex flex-col"
              style={{ backgroundColor: cardBg }}
            >
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4"
                  style={{
                    borderColor: primaryColor,
                  }}
                >
                  <img
                    src={userProfile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online indicator */}
                <div
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2"
                  style={{
                    backgroundColor: 'rgb(34, 197, 94)',
                    borderColor: cardBg,
                  }}
                />
              </div>

              {/* Name */}
              <h2
                className="text-xl font-bold mb-1 truncate max-w-full px-2"
                style={{ color: textColor }}
                title={getFullName()}
              >
                {getFullName()}
              </h2>

              {/* Email */}
              <p
                className="text-sm mb-4 truncate max-w-full px-2"
                style={{ color: primaryColor }}
                title={userProfile.email}
              >
                {userProfile.email}
              </p>

              {/* Quick Stats */}
              <div className="pt-4 border-t grow" style={{ borderColor }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                      12
                    </p>
                    <p className="text-xs" style={{ color: subtextColor }}>
                      Orders
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                      4
                    </p>
                    <p className="text-xs" style={{ color: subtextColor }}>
                      Wishlist
                    </p>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="mt-auto pt-4 border-t" style={{ borderColor }}>
                <p className="text-xs" style={{ color: subtextColor }}>
                  Member since January 2024
                </p>
              </div>
            </div>
          </motion.div>

          {/* Profile Details - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2 h-full"
          >
            <div className="rounded-lg p-6 h-full" style={{ backgroundColor: cardBg }}>
              {isEditing ? (
                /* Edit Form */
                <>
                  <div
                    className="flex items-center justify-between mb-6 pb-4 border-b"
                    style={{ borderColor }}
                  >
                    <h2 className="text-lg font-bold" style={{ color: textColor }}>
                      Edit Profile
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all hover:opacity-80"
                        style={{
                          color: subtextColor,
                          backgroundColor: darkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <FiX className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all hover:opacity-80"
                        style={{
                          backgroundColor: primaryColor,
                          color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                        }}
                      >
                        <FiSave className="h-4 w-4" />
                        Save
                      </button>
                    </div>
                  </div>
                  <ProfileForm onSave={handleSave} onCancel={handleCancel} />
                </>
              ) : (
                /* View Mode */
                <>
                  <h2
                    className="text-lg font-bold mb-6 pb-4 border-b"
                    style={{
                      color: textColor,
                      borderColor,
                    }}
                  >
                    Personal Information
                  </h2>

                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                      icon={FiUser}
                      label="Full Name"
                      value={getFullName()}
                      darkMode={darkMode}
                      primaryColor={primaryColor}
                      subtextColor={subtextColor}
                      textColor={textColor}
                    />
                    <InfoCard
                      icon={FiMail}
                      label="Email Address"
                      value={userProfile.email}
                      darkMode={darkMode}
                      primaryColor={primaryColor}
                      subtextColor={subtextColor}
                      textColor={textColor}
                    />
                    <InfoCard
                      icon={FiPhone}
                      label="Phone Number"
                      value={userProfile.phone}
                      darkMode={darkMode}
                      primaryColor={primaryColor}
                      subtextColor={subtextColor}
                      textColor={textColor}
                    />
                    <InfoCard
                      icon={FiMapPin}
                      label="Address"
                      value={getFormattedAddress()}
                      darkMode={darkMode}
                      primaryColor={primaryColor}
                      subtextColor={subtextColor}
                      textColor={textColor}
                    />
                  </div>

                  {/* Additional Details */}
                  <div className="mt-6 pt-6 border-t" style={{ borderColor }}>
                    <h3 className="text-sm font-bold mb-4" style={{ color: textColor }}>
                      Address Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="min-w-0">
                        <p className="text-xs mb-1" style={{ color: subtextColor }}>
                          City
                        </p>
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: textColor }}
                          title={userProfile.city || '-'}
                        >
                          {userProfile.city || '-'}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs mb-1" style={{ color: subtextColor }}>
                          State
                        </p>
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: textColor }}
                          title={userProfile.state || '-'}
                        >
                          {userProfile.state || '-'}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs mb-1" style={{ color: subtextColor }}>
                          ZIP Code
                        </p>
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: textColor }}
                          title={userProfile.zip || '-'}
                        >
                          {userProfile.zip || '-'}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs mb-1" style={{ color: subtextColor }}>
                          Country
                        </p>
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: textColor }}
                          title={userProfile.country || '-'}
                        >
                          {userProfile.country || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
