import { createContext, useContext, useState, useCallback } from 'react';

// Create the Profile Context
const ProfileContext = createContext(null);

// Default user profile
const defaultProfile = {
  firstName: 'Vanshika',
  lastName: 'Juneja',
  email: 'vanshika@example.com',
  address: '123 DLF Green Street',
  city: 'Delhi',
  state: 'Delhi',
  zip: '110001',
  country: 'India',
  phone: '9876543210',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

// Profile Provider Component
export function ProfileProvider({ children }) {
  const [userProfile, setUserProfile] = useState(defaultProfile);
  const [savedProfile, setSavedProfile] = useState(defaultProfile);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  // Update a single field in the profile
  const updateField = useCallback((fieldName, value) => {
    setUserProfile((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  // Update multiple fields at once
  const updateProfile = useCallback((updates) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Start editing profile
  const startEditing = useCallback(() => {
    setSavedProfile({ ...userProfile });
    setIsProfileEditing(true);
    setIsProfileOpen(true);
    setIsProfileCardOpen(false);
  }, [userProfile]);

  // Save profile changes
  const saveProfile = useCallback(() => {
    setSavedProfile({ ...userProfile });
    setIsProfileEditing(false);
    setIsProfileOpen(false);
    // Here you would typically make an API call to save the profile
    return { success: true };
  }, [userProfile]);

  // Cancel editing and revert changes
  const cancelEditing = useCallback(() => {
    setUserProfile({ ...savedProfile });
    setIsProfileEditing(false);
    setIsProfileOpen(false);
  }, [savedProfile]);

  // Reset profile to default
  const resetProfile = useCallback(() => {
    setUserProfile(defaultProfile);
    setSavedProfile(defaultProfile);
  }, []);

  // Toggle profile card visibility
  const toggleProfileCard = useCallback(() => {
    setIsProfileCardOpen((prev) => !prev);
  }, []);

  // Open profile modal
  const openProfileModal = useCallback(() => {
    setIsProfileOpen(true);
  }, []);

  // Close profile modal
  const closeProfileModal = useCallback(() => {
    if (!isProfileEditing) {
      setIsProfileOpen(false);
    }
  }, [isProfileEditing]);

  // Close profile card
  const closeProfileCard = useCallback(() => {
    setIsProfileCardOpen(false);
  }, []);

  // Get full name
  const getFullName = useCallback(
    () => `${userProfile.firstName} ${userProfile.lastName}`.trim(),
    [userProfile.firstName, userProfile.lastName],
  );

  // Get formatted address
  const getFormattedAddress = useCallback(() => {
    const { address, city, state, zip, country } = userProfile;
    return [address, city, state, zip, country].filter(Boolean).join(', ');
  }, [userProfile]);

  // Context value
  const value = {
    userProfile,
    savedProfile,
    isProfileOpen,
    isProfileCardOpen,
    isProfileEditing,
    setUserProfile,
    updateField,
    updateProfile,
    startEditing,
    saveProfile,
    cancelEditing,
    resetProfile,
    toggleProfileCard,
    openProfileModal,
    closeProfileModal,
    closeProfileCard,
    setIsProfileOpen,
    setIsProfileCardOpen,
    setIsProfileEditing,
    getFullName,
    getFormattedAddress,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

// Custom hook to use profile context
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileContext;
