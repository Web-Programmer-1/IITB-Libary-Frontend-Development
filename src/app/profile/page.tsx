'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { useMe } from '@/apis/queries';
import { useUpdateProfile, useUploadImage } from '@/apis/mutations';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { data: profile, isLoading } = useMe();
  const { updateUser } = useAuth();
  const updateMutation = useUpdateProfile();
  const uploadImageMutation = useUploadImage('profile-image');
  const [editing, setEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    profileImage: '',
  });

  const startEdit = () => {
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        profileImage: profile.profileImage || '',
      });
    }
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size must be less than 5MB');
    }

    setIsUploading(true);
    try {
      const data = await uploadImageMutation.mutateAsync(file);
      const imageUrl = data.url || URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, profileImage: imageUrl }));
      toast.success('Profile image uploaded!');
    } catch (err: any) {
      console.error('Profile upload error:', err);
      const fallbackUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, profileImage: fallbackUrl }));
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Upload failed. Using local preview for testing.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: (data) => {
        updateUser(data.user);
        setEditing(false);
        toast.success('Profile updated!');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Update failed');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Skeleton className="mb-6 h-10 w-32" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Could not load profile.</p>
      </div>
    );
  }

  const infoItems = [
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Phone, label: 'Phone', value: profile.phone },
    { icon: MapPin, label: 'Address', value: profile.address },
    {
      icon: Calendar,
      label: 'Member Since',
      value: new Date(profile.joinDate).toLocaleDateString(),
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="mt-2 text-slate-500">
            Manage your account information
          </p>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={startEdit} icon={<Edit3 className="h-4 w-4" />}>
            Edit
          </Button>
        )}
      </div>

      <Card className="p-6 animate-fade-in-up">
        {/* Avatar + Name */}
        {editing ? (
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 border-b border-[var(--card-border)] pb-6">
            <div className="relative group flex-shrink-0">
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-2xl object-cover border border-[var(--card-border)] bg-[var(--bg-secondary)]"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-3xl font-bold text-white">
                  {form.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-sm">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-[var(--accent-primary)]"></div>
                </div>
              )}
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-opacity duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="sr-only"
                  disabled={isUploading}
                />
                <Camera className="h-6 w-6 text-white" />
              </label>
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
                icon={<User className="h-4 w-4" />}
              />
              
              <div className="flex flex-wrap gap-2">
                <label className="relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-white transition-all duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="sr-only"
                    disabled={isUploading}
                  />
                  <Camera className="h-3.5 w-3.5" />
                  <span>Upload Avatar</span>
                </label>
                
                {form.profileImage && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, profileImage: '' }))}
                    className="flex items-center justify-center gap-1 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/5 hover:bg-[var(--danger)]/15 px-3 py-1.5 text-xs font-medium text-[var(--danger)] transition-all duration-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-4">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="h-16 w-16 rounded-2xl object-cover border border-[var(--card-border)] bg-[var(--bg-secondary)]"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-bold text-white">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {profile.name}
              </h2>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
          </div>
        )}

        {/* Info */}
        {editing ? (
          <div className="space-y-4">
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
              icon={<Phone className="h-4 w-4" />}
            />
            <Input
              label="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              placeholder="Your address"
              icon={<MapPin className="h-4 w-4" />}
            />
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleSave}
                isLoading={updateMutation.isPending}
                icon={<Save className="h-4 w-4" />}
              >
                Save Changes
              </Button>
              <Button variant="ghost" onClick={cancelEdit} icon={<X className="h-4 w-4" />}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-500">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm text-white">
                    {item.value || 'Not provided'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
