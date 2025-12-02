'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        console.log('Login attempt started with:', { email });

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            console.log('Supabase response:', { data, error });

            if (error) {
                console.error('Login error:', error);
                throw error;
            }

            if (!data.session) {
                console.error('No session returned');
                throw new Error('No session returned from login');
            }

            console.log('Login successful, redirecting...');
            router.push('/admin');
        } catch (err: any) {
            console.error('Caught error:', err);
            setError(err.message || 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-marble-white p-4">
            <Card className="w-full max-w-md border-gold/30 shadow-2xl bg-white">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-aegean rounded-full flex items-center justify-center text-gold mb-2">
                        <Lock size={24} />
                    </div>
                    <CardTitle className="text-3xl font-heading text-aegean-dark">Admin Portal</CardTitle>
                    <CardDescription>Enter your credentials to manage the Titans.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-obsidian">Email</label>
                            <Input
                                type="email"
                                placeholder="admin@malagatrivia.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white text-obsidian border-stone-300 focus:border-aegean"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-obsidian">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white text-obsidian border-stone-300 focus:border-aegean"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-aegean hover:bg-aegean-dark text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Enter Olympus'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
