import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user?.user_metadata) {
            setFirstName(user.user_metadata.first_name || '');
            setLastName(user.user_metadata.last_name || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { data, error } = await supabase.auth.updateUser({
                data: { first_name: firstName, last_name: lastName }
            });

            if (error) throw error;

            if (data.user) {
                setUser(data.user);
                setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert' });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage({ type: 'error', text: err.message });
            } else {
                setMessage({ type: 'error', text: 'Ein unbekannter Fehler ist aufgetreten' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Passwort erfolgreich geändert' });
            setPassword('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage({ type: 'error', text: err.message });
            } else {
                setMessage({ type: 'error', text: 'Ein unbekannter Fehler ist aufgetreten' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 pt-[calc(env(safe-area-inset-top)+20px)]">
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-text-primary"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-heading font-bold">Profil bearbeiten</h1>
            </header>

            {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-8">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <h2 className="text-lg font-bold">Persönliche Daten</h2>
                    <Input
                        label="Vorname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                        label="Nachname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Speichern
                    </Button>
                </form>

                <div className="h-px bg-border" />

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <h2 className="text-lg font-bold">Passwort ändern</h2>
                    <Input
                        type="password"
                        label="Neues Passwort"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mindestens 6 Zeichen"
                    />
                    <Button
                        type="submit"
                        variant="secondary"
                        disabled={loading || !password}
                        className="w-full"
                    >
                        Passwort aktualisieren
                    </Button>
                </form>
            </div>
        </div>
    );
}
