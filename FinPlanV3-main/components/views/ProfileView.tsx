
import React, { useState, useMemo } from 'react';
import { RegisteredUser } from '../../types.ts';
import Button from '../common/Button.tsx';
import Input from '../common/Input.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import { useLoading } from '../../contexts/LoadingContext.tsx';

interface ProfileViewProps {
    user: RegisteredUser;
    onUpdateUser: (updatedUser: RegisteredUser) => void;
}

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateUser }) => {
    const { t } = useLanguage();
    const { setLoadingMessage } = useLoading();
    
    const [name, setName] = useState(user.name);
    const [isEditingName, setIsEditingName] = useState(false);
    
    const [email, setEmail] = useState(user.email);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    
    const isMobile = useMemo(() => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent), []);

    const handleNameSave = () => {
        if (name.trim()) {
            onUpdateUser({ ...user, name: name.trim() });
            setIsEditingName(false);
        }
    };

    const handleEmailSave = () => {
        if (email.trim()) {
            onUpdateUser({ ...user, email: email.trim() });
            setIsEditingEmail(false);
        }
    };

    const handlePasswordSave = () => {
        setPasswordError('');
        if (currentPassword !== user.password) {
            setPasswordError(t('profile.errors.currentPassword'));
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError(t('profile.errors.passwordLength'));
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError(t('profile.errors.passwordMismatch'));
            return;
        }
        onUpdateUser({ ...user, password: newPassword });
        setIsEditingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLoadingMessage(t('loading.uploading'));
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const base64Url = loadEvent.target?.result as string;
                if (base64Url) {
                    onUpdateUser({ ...user, profilePictureUrl: base64Url });
                }
                setLoadingMessage('');
            };
            reader.onerror = () => {
                console.error("Error reading file.");
                alert("Could not read file.");
                setLoadingMessage('');
            }
            reader.readAsDataURL(file);
        }
        // Reset the input value to allow re-selecting the same file
        event.target.value = '';
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">{t('profile.title')}</h2>

            {/* Profile Picture Section */}
            <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-6">
                <img 
                    src={user.profilePictureUrl} 
                    alt={user.name} 
                    className="h-24 w-24 rounded-full object-cover bg-gray-200 ring-4 ring-primary/50" 
                />
                <div className="flex-grow flex flex-col items-center sm:items-start">
                    <h3 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">{user.name}</h3>
                    <p className="text-text-secondary dark:text-dark-text-secondary">{user.email}</p>
                    <label
                        className="mt-3 cursor-pointer inline-flex items-center justify-center gap-2 transform hover:-translate-y-px hover:shadow-md bg-secondary hover:bg-[#946040] text-white focus:ring-secondary px-3 py-1.5 text-sm rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-dark-background transition-all duration-200"
                    >
                        {t('profile.changePicture')}
                        <input
                            type="file"
                            onChange={handleFileSelect}
                            accept="image/jpeg, image/png, image/gif"
                            {...(isMobile && { capture: 'user' })}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-md space-y-6">
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary border-b border-gray-200 dark:border-dark-border pb-3 mb-4">
                    {t('profile.accountSettings')}
                </h3>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{t('profile.nameLabel')}</label>
                    {!isEditingName ? (
                        <div className="flex justify-between items-center">
                            <p className="text-text-primary dark:text-dark-text-primary">{user.name}</p>
                            <Button variant="ghost" size="sm" onClick={() => { setIsEditingName(true); setName(user.name); }}>
                                <EditIcon className="w-4 h-4 mr-1" /> {t('profile.edit')}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                            <Button onClick={handleNameSave} size="sm">{t('profile.save')}</Button>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingName(false)}>{t('profile.cancel')}</Button>
                        </div>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{t('profile.emailLabel')}</label>
                     {!isEditingEmail ? (
                        <div className="flex justify-between items-center">
                            <p className="text-text-primary dark:text-dark-text-primary">{user.email}</p>
                            <Button variant="ghost" size="sm" onClick={() => { setIsEditingEmail(true); setEmail(user.email); }}>
                                <EditIcon className="w-4 h-4 mr-1" /> {t('profile.edit')}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Button onClick={handleEmailSave} size="sm">{t('profile.save')}</Button>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingEmail(false)}>{t('profile.cancel')}</Button>
                        </div>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">{t('profile.passwordLabel')}</label>
                    {!isEditingPassword ? (
                         <div className="flex justify-between items-center">
                            <p className="text-text-primary dark:text-dark-text-primary tracking-widest">********</p>
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingPassword(true)}>
                                <EditIcon className="w-4 h-4 mr-1" /> {t('profile.edit')}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 pt-2">
                             <Input type="password" placeholder={t('profile.currentPassword')} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                             <Input type="password" placeholder={t('profile.newPassword')} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                             <Input type="password" placeholder={t('profile.confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            {passwordError && <p className="text-sm text-danger">{passwordError}</p>}
                             <div className="flex items-center gap-2">
                                <Button onClick={handlePasswordSave} size="sm">{t('profile.save')}</Button>
                                <Button variant="ghost" size="sm" onClick={() => { setIsEditingPassword(false); setPasswordError(''); }}>{t('profile.cancel')}</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;