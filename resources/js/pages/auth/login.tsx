import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck, User } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            {/* Demo Credentials */}
            <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                    <div className="mb-3">
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Demo Credentials
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Use these credentials to test the application
                        </p>
                    </div>

                    <div className="grid gap-3">
                        {/* Admin Credentials */}
                        <div className="flex items-start gap-3 p-3 rounded-md bg-background border">
                            <ShieldCheck className="h-4 w-4 mt-0.5 text-primary" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold mb-1">Admin Account</p>
                                <div className="text-xs space-y-0.5">
                                    <p className="font-mono break-all">admin@techhub.com</p>
                                    <p className="font-mono">password</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Credentials */}
                        <div className="flex items-start gap-3 p-3 rounded-md bg-background border">
                            <User className="h-4 w-4 mt-0.5 text-primary" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold mb-1">Customer Account</p>
                                <div className="text-xs space-y-0.5">
                                    <p className="font-mono break-all">mherman@example.com</p>
                                    <p className="font-mono">password</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
