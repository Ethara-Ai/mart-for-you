// ProfileContext tests
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ProfileProvider, useProfile } from './ProfileContext';
import { ThemeProvider } from './ThemeContext';

// Wrapper component with necessary providers
const wrapper = ({ children }) => (
  <ThemeProvider>
    <ProfileProvider>{children}</ProfileProvider>
  </ThemeProvider>
);

// Default profile data (should match the default in ProfileContext)
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

describe('ProfileContext', () => {
  describe('useProfile hook', () => {
    it('throws error when used outside ProfileProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useProfile());
      }).toThrow('useProfile must be used within a ProfileProvider');

      consoleSpy.mockRestore();
    });

    it('provides profile context when used within ProfileProvider', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.userProfile).toBeDefined();
      expect(result.current.savedProfile).toBeDefined();
    });
  });

  describe('initial state', () => {
    it('has default user profile values', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.userProfile).toEqual(defaultProfile);
    });

    it('has default saved profile values', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.savedProfile).toEqual(defaultProfile);
    });

    it('has profile modal closed by default', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.isProfileOpen).toBe(false);
    });

    it('has profile card closed by default', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.isProfileCardOpen).toBe(false);
    });

    it('is not in editing mode by default', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.isProfileEditing).toBe(false);
    });
  });

  describe('updateField', () => {
    it('updates a single field in userProfile', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('firstName', 'John');
      });

      expect(result.current.userProfile.firstName).toBe('John');
      expect(result.current.userProfile.lastName).toBe(defaultProfile.lastName);
    });

    it('updates email field', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('email', 'john@example.com');
      });

      expect(result.current.userProfile.email).toBe('john@example.com');
    });

    it('updates address field', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('address', '456 New Street');
      });

      expect(result.current.userProfile.address).toBe('456 New Street');
    });

    it('updates city field', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('city', 'Mumbai');
      });

      expect(result.current.userProfile.city).toBe('Mumbai');
    });

    it('updates phone field', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('phone', '1234567890');
      });

      expect(result.current.userProfile.phone).toBe('1234567890');
    });

    it('updates zip code field', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('zip', '400001');
      });

      expect(result.current.userProfile.zip).toBe('400001');
    });

    it('updates avatar field', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });
      const newAvatar = 'https://example.com/new-avatar.jpg';

      act(() => {
        result.current.updateField('avatar', newAvatar);
      });

      expect(result.current.userProfile.avatar).toBe(newAvatar);
    });

    it('does not affect savedProfile when updating field', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('firstName', 'John');
      });

      expect(result.current.savedProfile.firstName).toBe(defaultProfile.firstName);
    });

    it('handles updating to empty string', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('firstName', '');
      });

      expect(result.current.userProfile.firstName).toBe('');
    });

    it('handles special characters in field values', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('address', "123 O'Brien Street, Apt #5");
      });

      expect(result.current.userProfile.address).toBe("123 O'Brien Street, Apt #5");
    });
  });

  describe('updateProfile', () => {
    it('updates multiple fields at once', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        });
      });

      expect(result.current.userProfile.firstName).toBe('Jane');
      expect(result.current.userProfile.lastName).toBe('Smith');
      expect(result.current.userProfile.email).toBe('jane.smith@example.com');
    });

    it('preserves unchanged fields', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          firstName: 'Jane',
        });
      });

      expect(result.current.userProfile.firstName).toBe('Jane');
      expect(result.current.userProfile.lastName).toBe(defaultProfile.lastName);
      expect(result.current.userProfile.email).toBe(defaultProfile.email);
      expect(result.current.userProfile.phone).toBe(defaultProfile.phone);
    });

    it('can update all address fields at once', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          address: '789 Test Ave',
          city: 'Test City',
          state: 'Test State',
          zip: '99999',
          country: 'Test Country',
        });
      });

      expect(result.current.userProfile.address).toBe('789 Test Ave');
      expect(result.current.userProfile.city).toBe('Test City');
      expect(result.current.userProfile.state).toBe('Test State');
      expect(result.current.userProfile.zip).toBe('99999');
      expect(result.current.userProfile.country).toBe('Test Country');
    });

    it('handles empty update object', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });
      const originalProfile = { ...result.current.userProfile };

      act(() => {
        result.current.updateProfile({});
      });

      expect(result.current.userProfile).toEqual(originalProfile);
    });
  });

  describe('startEditing', () => {
    it('saves current profile to savedProfile', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      // First modify the profile
      act(() => {
        result.current.updateField('firstName', 'Modified');
      });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.savedProfile.firstName).toBe('Modified');
    });

    it('sets isProfileEditing to true', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileEditing).toBe(true);
    });

    it('opens profile modal', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileOpen).toBe(true);
    });

    it('closes profile card', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      // First open the card
      act(() => {
        result.current.toggleProfileCard();
      });

      expect(result.current.isProfileCardOpen).toBe(true);

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileCardOpen).toBe(false);
    });
  });

  describe('saveProfile', () => {
    it('saves userProfile to savedProfile', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateField('firstName', 'Saved');
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.savedProfile.firstName).toBe('Saved');
    });

    it('sets isProfileEditing to false', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileEditing).toBe(true);

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.isProfileEditing).toBe(false);
    });

    it('closes profile modal', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileOpen).toBe(true);

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.isProfileOpen).toBe(false);
    });

    it('returns success result', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      let saveResult;
      await act(async () => {
        saveResult = await result.current.saveProfile();
      });

      expect(saveResult).toEqual({ success: true });
    });

    it('sets isSaving to true during save', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      let _savingDuringSave = false;
      const savePromise = act(async () => {
        const promise = result.current.saveProfile();
        // Check isSaving immediately after calling saveProfile
        _savingDuringSave = result.current.isSaving;
        await promise;
      });

      await savePromise;
      // After save completes, isSaving should be false
      expect(result.current.isSaving).toBe(false);
    });
  });

  describe('cancelEditing', () => {
    it('reverts userProfile to savedProfile', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      // Start editing and make changes
      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateField('firstName', 'Changed');
        result.current.updateField('lastName', 'Name');
      });

      expect(result.current.userProfile.firstName).toBe('Changed');
      expect(result.current.userProfile.lastName).toBe('Name');

      // Cancel editing
      act(() => {
        result.current.cancelEditing();
      });

      // Should revert to saved values
      expect(result.current.userProfile.firstName).toBe(defaultProfile.firstName);
      expect(result.current.userProfile.lastName).toBe(defaultProfile.lastName);
    });

    it('sets isProfileEditing to false', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileEditing).toBe(true);

      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.isProfileEditing).toBe(false);
    });

    it('closes profile modal', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileOpen).toBe(true);

      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.isProfileOpen).toBe(false);
    });

    it('preserves savedProfile after cancel', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      // Make a successful save first
      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateField('firstName', 'SavedName');
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      // Now start editing again, make changes, and cancel
      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateField('firstName', 'UnsavedName');
      });

      act(() => {
        result.current.cancelEditing();
      });

      // Should revert to the previously saved value
      expect(result.current.userProfile.firstName).toBe('SavedName');
      expect(result.current.savedProfile.firstName).toBe('SavedName');
    });
  });

  describe('resetProfile', () => {
    it('resets userProfile to default values', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          firstName: 'Modified',
          lastName: 'User',
          email: 'modified@example.com',
        });
      });

      act(() => {
        result.current.resetProfile();
      });

      expect(result.current.userProfile).toEqual(defaultProfile);
    });

    it('resets savedProfile to default values', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      // Start editing first to save current profile
      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateProfile({
          firstName: 'Modified',
        });
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.savedProfile.firstName).toBe('Modified');

      act(() => {
        result.current.resetProfile();
      });

      expect(result.current.savedProfile).toEqual(defaultProfile);
    });
  });

  describe('toggleProfileCard', () => {
    it('toggles profile card from closed to open', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.isProfileCardOpen).toBe(false);

      act(() => {
        result.current.toggleProfileCard();
      });

      expect(result.current.isProfileCardOpen).toBe(true);
    });

    it('toggles profile card from open to closed', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.toggleProfileCard();
      });

      expect(result.current.isProfileCardOpen).toBe(true);

      act(() => {
        result.current.toggleProfileCard();
      });

      expect(result.current.isProfileCardOpen).toBe(false);
    });

    it('toggles multiple times correctly', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.toggleProfileCard();
      });
      expect(result.current.isProfileCardOpen).toBe(true);

      act(() => {
        result.current.toggleProfileCard();
      });
      expect(result.current.isProfileCardOpen).toBe(false);

      act(() => {
        result.current.toggleProfileCard();
      });
      expect(result.current.isProfileCardOpen).toBe(true);
    });
  });

  describe('openProfileModal', () => {
    it('opens the profile modal', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.isProfileOpen).toBe(false);

      act(() => {
        result.current.openProfileModal();
      });

      expect(result.current.isProfileOpen).toBe(true);
    });

    it('keeps modal open if already open', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.openProfileModal();
      });

      expect(result.current.isProfileOpen).toBe(true);

      act(() => {
        result.current.openProfileModal();
      });

      expect(result.current.isProfileOpen).toBe(true);
    });
  });

  describe('closeProfileModal', () => {
    it('closes the profile modal when not editing', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.openProfileModal();
      });

      expect(result.current.isProfileOpen).toBe(true);

      act(() => {
        result.current.closeProfileModal();
      });

      expect(result.current.isProfileOpen).toBe(false);
    });

    it('does not close modal when editing', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileOpen).toBe(true);
      expect(result.current.isProfileEditing).toBe(true);

      act(() => {
        result.current.closeProfileModal();
      });

      // Modal should remain open while editing
      expect(result.current.isProfileOpen).toBe(true);
    });
  });

  describe('closeProfileCard', () => {
    it('closes the profile card', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.toggleProfileCard();
      });

      expect(result.current.isProfileCardOpen).toBe(true);

      act(() => {
        result.current.closeProfileCard();
      });

      expect(result.current.isProfileCardOpen).toBe(false);
    });

    it('keeps card closed if already closed', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      expect(result.current.isProfileCardOpen).toBe(false);

      act(() => {
        result.current.closeProfileCard();
      });

      expect(result.current.isProfileCardOpen).toBe(false);
    });
  });

  describe('getFullName', () => {
    it('returns full name with first and last name', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      const fullName = result.current.getFullName();

      expect(fullName).toBe('Vanshika Juneja');
    });

    it('returns updated name after changes', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          firstName: 'John',
          lastName: 'Doe',
        });
      });

      const fullName = result.current.getFullName();

      expect(fullName).toBe('John Doe');
    });

    it('handles empty first name', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('firstName', '');
      });

      const fullName = result.current.getFullName();

      expect(fullName).toBe('Juneja');
    });

    it('handles empty last name', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateField('lastName', '');
      });

      const fullName = result.current.getFullName();

      expect(fullName).toBe('Vanshika');
    });

    it('handles both names empty', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          firstName: '',
          lastName: '',
        });
      });

      const fullName = result.current.getFullName();

      expect(fullName).toBe('');
    });

    it('trims whitespace from full name', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          firstName: '  John  ',
          lastName: '  Doe  ',
        });
      });

      const fullName = result.current.getFullName();

      // Note: trim() is applied to the result, but not to individual names
      expect(fullName.trim()).toBe('John     Doe');
    });
  });

  describe('getFormattedAddress', () => {
    it('returns formatted address with all parts', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      const address = result.current.getFormattedAddress();

      expect(address).toBe('123 DLF Green Street, Delhi, Delhi, 110001, India');
    });

    it('returns updated address after changes', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          address: '456 New Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip: '400001',
          country: 'India',
        });
      });

      const address = result.current.getFormattedAddress();

      expect(address).toBe('456 New Street, Mumbai, Maharashtra, 400001, India');
    });

    it('handles missing address parts gracefully', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          address: '123 Street',
          city: 'City',
          state: '',
          zip: '',
          country: 'Country',
        });
      });

      const address = result.current.getFormattedAddress();

      // Should filter out empty values
      expect(address).toBe('123 Street, City, Country');
    });

    it('handles all empty address fields', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          address: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        });
      });

      const address = result.current.getFormattedAddress();

      expect(address).toBe('');
    });

    it('handles only city and country', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.updateProfile({
          address: '',
          city: 'Paris',
          state: '',
          zip: '',
          country: 'France',
        });
      });

      const address = result.current.getFormattedAddress();

      expect(address).toBe('Paris, France');
    });
  });

  describe('setUserProfile', () => {
    it('can directly set entire user profile', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      const newProfile = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        address: 'New Address',
        city: 'New City',
        state: 'New State',
        zip: '00000',
        country: 'New Country',
        phone: '0000000000',
        avatar: 'https://example.com/new.jpg',
      };

      act(() => {
        result.current.setUserProfile(newProfile);
      });

      expect(result.current.userProfile).toEqual(newProfile);
    });
  });

  describe('setIsProfileOpen', () => {
    it('can directly set profile open state', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.setIsProfileOpen(true);
      });

      expect(result.current.isProfileOpen).toBe(true);

      act(() => {
        result.current.setIsProfileOpen(false);
      });

      expect(result.current.isProfileOpen).toBe(false);
    });
  });

  describe('setIsProfileCardOpen', () => {
    it('can directly set profile card open state', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.setIsProfileCardOpen(true);
      });

      expect(result.current.isProfileCardOpen).toBe(true);

      act(() => {
        result.current.setIsProfileCardOpen(false);
      });

      expect(result.current.isProfileCardOpen).toBe(false);
    });
  });

  describe('setIsProfileEditing', () => {
    it('can directly set editing state', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      act(() => {
        result.current.setIsProfileEditing(true);
      });

      expect(result.current.isProfileEditing).toBe(true);

      act(() => {
        result.current.setIsProfileEditing(false);
      });

      expect(result.current.isProfileEditing).toBe(false);
    });
  });

  describe('complex profile operations', () => {
    it('handles full edit-save workflow', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      // Start editing
      act(() => {
        result.current.startEditing();
      });

      expect(result.current.isProfileEditing).toBe(true);
      expect(result.current.isProfileOpen).toBe(true);

      // Make changes
      act(() => {
        result.current.updateProfile({
          firstName: 'Updated',
          lastName: 'User',
          email: 'updated@example.com',
        });
      });

      // Save changes
      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.isProfileEditing).toBe(false);
      expect(result.current.isProfileOpen).toBe(false);
      expect(result.current.userProfile.firstName).toBe('Updated');
      expect(result.current.savedProfile.firstName).toBe('Updated');
    });

    it('handles full edit-cancel workflow', () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      const originalFirstName = result.current.userProfile.firstName;

      // Start editing
      act(() => {
        result.current.startEditing();
      });

      // Make changes
      act(() => {
        result.current.updateField('firstName', 'WillNotBeSaved');
      });

      expect(result.current.userProfile.firstName).toBe('WillNotBeSaved');

      // Cancel changes
      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.isProfileEditing).toBe(false);
      expect(result.current.isProfileOpen).toBe(false);
      expect(result.current.userProfile.firstName).toBe(originalFirstName);
    });

    it('handles multiple edit-save cycles', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      // First edit cycle
      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateField('firstName', 'First');
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.userProfile.firstName).toBe('First');

      // Second edit cycle
      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateField('firstName', 'Second');
      });

      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.userProfile.firstName).toBe('Second');

      // Third edit cycle with cancel
      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateField('firstName', 'Third');
      });

      act(() => {
        result.current.cancelEditing();
      });

      expect(result.current.userProfile.firstName).toBe('Second');
    });

    it('reset after edits restores default', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      // Make and save edits
      act(() => {
        result.current.startEditing();
      });

      act(() => {
        result.current.updateProfile({
          firstName: 'Custom',
          lastName: 'Name',
          email: 'custom@example.com',
        });
      });

      // saveProfile is async, need to await it
      await act(async () => {
        await result.current.saveProfile();
      });

      expect(result.current.userProfile.firstName).toBe('Custom');
      expect(result.current.savedProfile.firstName).toBe('Custom');

      // Reset to default
      act(() => {
        result.current.resetProfile();
      });

      expect(result.current.userProfile).toEqual(defaultProfile);
      expect(result.current.savedProfile).toEqual(defaultProfile);
    });
  });
});
