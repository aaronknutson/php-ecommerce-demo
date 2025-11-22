import { StoreNavbar } from '@/components/store-navbar';
import { type ReactNode } from 'react';

interface StoreLayoutProps {
    children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <StoreNavbar />
            <main className="flex-1">
                {children}
            </main>
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
