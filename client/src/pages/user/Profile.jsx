import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../api/client';
import {
  User,
  ShieldCheck,
  KeyRound,
  Lock,
  FileCheck,
  Building,
  Save,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Sparkles,
  Trash2,
  Check,
  Image as ImageIcon,
} from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'p1', label: 'Executive Male', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' },
  { id: 'p2', label: 'Executive Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 'p3', label: 'Corporate Leader', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 'p4', label: 'Senior Specialist', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { id: 'p5', label: 'Young Professional', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80' },
  { id: 'p6', label: 'Banking Consultant', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' },
];

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useNotification();
  const fileInputRef = useRef(null);

  // Avatar state
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  );
  const [showPresets, setShowPresets] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneError, setPhoneError] = useState('');
   // Occupation field added to state management
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [address, setAddress] = useState(user?.kycDetails?.address || '');
  const [city, setCity] = useState(user?.kycDetails?.city || 'Mumbai');
  const [state, setState] = useState(user?.kycDetails?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.kycDetails?.pincode || '400001');

  // KYC fields
  const [panNumber, setPanNumber] = useState(user?.kycDetails?.panNumber || '');
  const [aadharMasked, setAadharMasked] = useState(user?.kycDetails?.aadharMasked || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // T-PIN fields
  const [tPin, setTPin] = useState('');
  const [tPinPassword, setTPinPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPin, setSavingPin] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
    if (user?.name) setName(user.name);
    if (user?.phone) setPhone(user.phone);
    if(user?.occupation) setOccupation(user.occupation); // Set occupation if available
    if (user?.kycDetails?.address) setAddress(user.kycDetails.address);
    if (user?.kycDetails?.panNumber) setPanNumber(user.kycDetails.panNumber);
    if (user?.kycDetails?.aadharMasked) setAadharMasked(user.kycDetails.aadharMasked);
  }, [user]);

  // Handle local file selection with client-side canvas compression
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        const width = img.width;
        const height = img.height;

        // Crop centered square
        const minDimension = Math.min(width, height);
        const startX = (width - minDimension) / 2;
        const startY = (height - minDimension) / 2;

        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, startX, startY, minDimension, minDimension, 0, 0, MAX_SIZE, MAX_SIZE);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setAvatar(compressedDataUrl);
        showToast('Photo selected! Click "Save Photo" to apply across your account.', 'info');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhotoOnly = async () => {
    setSavingPhoto(true);
    try {
      await api.updateProfile({ avatar });
      showToast('Profile photo updated successfully!', 'success');
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to update profile photo');
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleResetPhoto = () => {
    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
    setAvatar(defaultAvatar);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setSavingProfile(true);
    try {
      await api.updateProfile({
        name,
        phone,
        occupation, // Include occupation in the profile update payload
        address,
        city,
        state,
        pincode,
        panNumber,
        aadharMasked,
        avatar,
      });
      showToast('Profile & KYC details updated successfully!', 'success');
      await refreshUser();
    } catch (err) {
      setPhoneError(err.message || 'Validation failed');
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      showToast('NetBanking password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUpdateTPin = async (e) => {
    e.preventDefault();
    if (tPin.length !== 4) {
      alert('T-PIN must be 4 digits');
      return;
    }
    setSavingPin(true);
    try {
      await api.setTPin({ pin: tPin, currentPassword: tPinPassword });
      showToast('4-Digit Transaction PIN updated successfully!', 'success');
      setTPin('');
      setTPinPassword('');
    } catch (err) {
      alert(err.message || 'Failed to update T-PIN');
    } finally {
      setSavingPin(false);
    }
  };

  const isPhotoModified = avatar !== user?.avatar;

  return (
    <div className="page-body">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>Profile & Security Settings</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage your profile photo, personal identity, KYC compliance, password and 4-digit T-PIN</p>
      </div>

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        style={{ display: 'none' }}
      />

      {/* Hero Profile Photo & Identity Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Avatar with Camera Trigger Overlay */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  padding: '4px',
                  background: 'linear-gradient(135deg, #1c2a8f 0%, #00a4e4 100%)',
                  boxShadow: '0 8px 24px rgba(28, 42, 143, 0.25)',
                }}
              >
                <img
                  src={avatar}
                  alt={user?.name || 'Customer'}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block',
                    background: '#ffffff',
                  }}
                />
              </div>

              {/* Floating Camera Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo from Computer"
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  background: '#1c2a8f',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Camera size={16} />
              </button>
            </div>

            {/* User Meta Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  {user?.name || 'Rahul Sharma'}
                </h3>
                <span className={`badge ${user?.kycStatus === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                  {user?.kycStatus === 'verified' ? '✓ Verified Customer' : 'KYC Pending'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                {user?.email} • {user?.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
                <Building size={14} color="#1c2a8f" />
                <span>Primary Branch: Nariman Point, Mumbai</span>
              </div>
            </div>
          </div>

          {/* Photo Action Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <Upload size={14} />
                <span>Upload New Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              >
                <Sparkles size={14} color="#00a4e4" />
                <span>Preset Avatars</span>
              </button>

              {avatar !== user?.avatar && (
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Save Photo CTA when dirty */}
            {isPhotoModified && (
              <button
                type="button"
                onClick={handleSavePhotoOnly}
                disabled={savingPhoto}
                className="btn btn-primary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  marginTop: '4px',
                }}
              >
                <Check size={14} />
                <span>{savingPhoto ? 'Saving Photo...' : 'Apply & Save Profile Photo'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Preset Avatars Drawer */}
        {showPresets && (
          <div
            style={{
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: '1px dashed var(--border-light)',
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '12px' }}>
              Select a professional banking avatar:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {PRESET_AVATARS.map((p) => {
                const isSelected = avatar === p.url;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setAvatar(p.url);
                      showToast(`${p.label} selected! Click "Apply & Save Profile Photo".`, 'info');
                    }}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '6px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #1c2a8f' : '2px solid transparent',
                      background: isSelected ? '#eff6ff' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                    />
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px', maxWidth: '64px', lineHeight: '1.2' }}>
                      {p.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Profile & KYC Card */}
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>Customer Profile</h3>
            <span className={`badge ${user?.kycStatus === 'verified' ? 'badge-success' : 'badge-warning'}`}>
              KYC: {user?.kycStatus?.toUpperCase() || 'PENDING'}
            </span>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Customer Legal Name</label>
              <input
                type="text"
                required
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Email (Login ID)</label>
                <input type="email" disabled className="form-control" value={user?.email || ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  required
                  className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                  style={phoneError ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                />
                {phoneError && (
                  <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={13} />
                    <span>{phoneError}</span>
                  </div>
                )}
              </div>
            </div>
              

            <div className="form-group">
            <label className="form-label">Occupation / Profession</label>

            <input
              type="text"
              className="form-control"
              placeholder="e.g. Software Engineer / Business"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

            {/* KYC Documents Section */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', margin: '16px 0' }}>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1c2a8f', marginBottom: '10px' }}>
                KYC Identity Documents
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>PAN Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. ABCPS1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Aadhaar Number (Masked)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="XXXXXXXX7894"
                    value={aadharMasked}
                    onChange={(e) => setAadharMasked(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Permanent Residential Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Street address, building, flat number"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={savingProfile} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              <Save size={16} />
              <span>{savingProfile ? 'Saving Changes...' : 'Save Profile & KYC Details'}</span>
            </button>
          </form>
        </div>

        {/* Security & Password / T-PIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Update 4-Digit T-PIN */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              Set / Update 4-Digit T-PIN
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '18px' }}>
              Required for authorising RTGS, NEFT, IMPS & Intra-bank transfers.
            </p>

            <form onSubmit={handleUpdateTPin}>
              <div className="form-group">
                <label className="form-label">New 4-Digit Transaction PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  className="form-control"
                  placeholder="••••"
                  value={tPin}
                  onChange={(e) => setTPin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm with Current Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Enter current password"
                  value={tPinPassword}
                  onChange={(e) => setTPinPassword(e.target.value)}
                />
              </div>

              <button type="submit" disabled={savingPin} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                <KeyRound size={15} />
                <span>{savingPin ? 'Updating...' : 'Update Transaction PIN'}</span>
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              Change NetBanking Password
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '18px' }}>
              Keep your account secure with regular password updates.
            </p>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (Min 6 characters)</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button type="submit" disabled={savingPassword} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                <Lock size={15} />
                <span>{savingPassword ? 'Updating...' : 'Change Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
