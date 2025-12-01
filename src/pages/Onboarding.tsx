import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail } from 'lucide-react';

export function OnboardingPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                        },
                    },
                });
                if (error) throw error;
                navigate('/');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ein unbekannter Fehler ist aufgetreten');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/30">
                <Dumbbell className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-heading font-bold mb-2 text-center">
                FitTrack Pro
            </h1>
            <p className="text-text-secondary text-center mb-12 max-w-[280px]">
                Dein ultimativer Begleiter für das Fitnessstudio. Offline-First.
            </p>

            <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
                {isSignUp && (
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            placeholder="Vorname"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="bg-bg-elevated"
                        />
                        <Input
                            type="text"
                            placeholder="Nachname"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="bg-bg-elevated"
                        />
                    </div>
                )}
                <Input
                    type="email"
                    placeholder="E-Mail Adresse"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-bg-elevated"
                />
                <Input
                    type="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-bg-elevated"
                />

                {error && (
                    <div className="text-error text-sm text-center bg-error/10 p-2 rounded-lg">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    size="full"
                    disabled={loading}
                    className="mt-4"
                >
                    {loading ? 'Laden...' : (isSignUp ? 'Registrieren' : 'Anmelden')}
                </Button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-bg px-2 text-text-muted">Oder</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    size="full"
                    onClick={() => setIsSignUp(!isSignUp)}
                >
                    <Mail className="w-4 h-4 mr-2" />
                    {isSignUp ? 'Zum Login wechseln' : 'Neuen Account erstellen'}
                </Button>
            </form>
        </div>
    );
}
