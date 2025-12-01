import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';

interface UserMenuProps {
    initials: string;
}

export function UserMenu({ initials }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { signOut } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/onboarding');
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center text-primary font-bold hover:bg-primary-light/20 transition-colors"
            >
                {initials}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-48 bg-bg-card border border-border rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/profile');
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-bg-elevated flex items-center gap-2"
                    >
                        <UserIcon className="w-4 h-4" />
                        Profil bearbeiten
                    </button>

                    <div className="h-px bg-border my-1" />

                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Abmelden
                    </button>
                </div>
            )}
        </div>
    );
}
