import { StoreNavbar } from '@/components/store-navbar';
import { Link, usePage } from '@inertiajs/react';
import { User, Package, Settings, ShoppingBag, MapPin } from 'lucide-react';
import { type ReactNode } from 'react';
import type { SharedData } from '@/types';

interface CustomerDashboardLayoutProps {
    children: ReactNode;
}

export default function CustomerDashboardLayout({ children }: CustomerDashboardLayoutProps) {
    const { url } = usePage();

    const isActive = (path: string) => {
        return url.startsWith(path);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <StoreNavbar />
            <div className="flex-1 bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-[240px_1fr] gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="space-y-2">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-1">My Account</h2>
                                <p className="text-sm text-muted-foreground">Manage your account settings</p>
                            </div>

                            <nav className="space-y-1">
                                <Link
                                    href="/settings/profile"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive('/settings/profile')
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>

                                <Link
                                    href="/settings/password"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive('/settings/password')
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <Settings className="h-4 w-4" />
                                    Password
                                </Link>

                                <Link
                                    href="/addresses"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive('/addresses')
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <MapPin className="h-4 w-4" />
                                    Addresses
                                </Link>

                                <Link
                                    href="/orders"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive('/orders')
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    My Orders
                                </Link>
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
            <footer className="border-t py-6 md:py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2025 TechHub Electronics. All rights reserved.
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
