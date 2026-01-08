import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Create the Profile Context
const ProfileContext = createContext(null);

/**
 * Default user profile data
 * In a real application, this would be fetched from an API
 */
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
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
};

/**
 * ProfileProvider - User profile state management
 *
 * Provides user profile functionality including viewing, editing,
 * and saving profile information. Includes proper async handling
 * for save operations with loading state.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function ProfileProvider({ children }) {
  const [userProfile, setUserProfile] = useState(defaultProfile);
  const [savedProfile, setSavedProfile] = useState(defaultProfile);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  /**
   * Update a single field in the profile
   * @param {string} fieldName - Name of the field to update
   * @param {*} value - New value for the field
   */
  const updateField = useCallback((fieldName, value) => {
    setUserProfile((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear any previous save errors when user makes changes
    setSaveError(null);
  }, []);

  /**
   * Update multiple fields at once
   * @param {Object} updates - Object containing field updates
   */
  const updateProfile = useCallback((updates) => {
    setUserProfile((prev) => ({
      ...prev,
      ...updates,
    }));
    setSaveError(null);
  }, []);

  /**
   * Start editing profile
   * Saves current state for potential rollback
   */
  const startEditing = useCallback(() => {
    setSavedProfile({ ...userProfile });
    setIsProfileEditing(true);
    setIsProfileOpen(true);
    setIsProfileCardOpen(false);
    setSaveError(null);
  }, [userProfile]);

  /**
   * Save profile changes
   * Async operation with loading state and error handling
   * @returns {Promise<{success: boolean, error?: string}>} Save result
   */
  const saveProfile = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Simulate API call - in production, replace with actual API call
      // await api.saveProfile(userProfile);
      await new Promise((resolve) => setTimeout(resolve, 300));

      setSavedProfile({ ...userProfile });
      setIsProfileEditing(false);
      setIsProfileOpen(false);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile';
      setSaveError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, [userProfile]);

  /**
   * Cancel editing and revert changes
   */
  const cancelEditing = useCallback(() => {
    setUserProfile({ ...savedProfile });
    setIsProfileEditing(false);
    setIsProfileOpen(false);
    setSaveError(null);
  }, [savedProfile]);

  /**
   * Reset profile to default values
   */
  const resetProfile = useCallback(() => {
    setUserProfile(defaultProfile);
    setSavedProfile(defaultProfile);
    setSaveError(null);
  }, []);

  /**
   * Toggle profile card visibility
   */
  const toggleProfileCard = useCallback(() => {
    setIsProfileCardOpen((prev) => !prev);
  }, []);

  /**
   * Open profile modal
   */
  const openProfileModal = useCallback(() => {
    setIsProfileOpen(true);
  }, []);

  /**
   * Close profile modal (only if not editing)
   */
  const closeProfileModal = useCallback(() => {
    if (!isProfileEditing) {
      setIsProfileOpen(false);
    }
  }, [isProfileEditing]);

  /**
   * Close profile card
   */
  const closeProfileCard = useCallback(() => {
    setIsProfileCardOpen(false);
  }, []);

  /**
   * Get full name - derived state using useMemo
   * More efficient than useCallback for computed values
   */
  const fullName = useMemo(
    () => `${userProfile.firstName} ${userProfile.lastName}`.trim(),
    [userProfile.firstName, userProfile.lastName]
  );

  /**
   * Get formatted address - derived state using useMemo
   */
  const formattedAddress = useMemo(() => {
    const { address, city, state, zip, country } = userProfile;
    return [address, city, state, zip, country].filter(Boolean).join(', ');
  }, [userProfile]);

  /**
   * Check if profile has unsaved changes
   */
  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(userProfile) !== JSON.stringify(savedProfile),
    [userProfile, savedProfile]
  );

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      // State
      userProfile,
      savedProfile,
      isProfileOpen,
      isProfileCardOpen,
      isProfileEditing,
      isSaving,
      saveError,

      // Derived state
      fullName,
      formattedAddress,
      hasUnsavedChanges,

      // State setters (for edge cases)
      setUserProfile,
      setIsProfileOpen,
      setIsProfileCardOpen,
      setIsProfileEditing,

      // Actions
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

      // Legacy support - deprecated, use fullName and formattedAddress instead
      getFullName: () => fullName,
      getFormattedAddress: () => formattedAddress,
    }),
    [
      userProfile,
      savedProfile,
      isProfileOpen,
      isProfileCardOpen,
      isProfileEditing,
      isSaving,
      saveError,
      fullName,
      formattedAddress,
      hasUnsavedChanges,
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
    ]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

/**
 * useProfile - Custom hook to access profile context
 *
 * @returns {Object} Profile context value containing:
 *   - userProfile: Object - Current user profile data
 *   - fullName: string - Computed full name
 *   - formattedAddress: string - Computed formatted address
 *   - isProfileEditing: boolean - Whether profile is being edited
 *   - isSaving: boolean - Whether save is in progress
 *   - saveError: string|null - Error message from last save attempt
 *   - updateField: Function - Update a single profile field
 *   - saveProfile: Function - Save profile changes (async)
 *   - cancelEditing: Function - Cancel editing and revert changes
 *   - ... and more
 *
 * @throws {Error} If used outside of ProfileProvider
 *
 * @example
 * const { userProfile, fullName, saveProfile, isSaving } = useProfile();
 *
 * const handleSave = async () => {
 *   const result = await saveProfile();
 *   if (result.success) {
 *     showToast('Profile saved!');
 *   } else {
 *     showToast(result.error, 'error');
 *   }
 * };
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileContext;
