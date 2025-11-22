import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Menu, Package, Home as HomeIcon, ShoppingBag, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { SharedData } from '@/types';

export function StoreNavbar() {
    const { auth, cartCount } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
                    <Package className="h-6 w-6" />
                    <span>TechHub Electronics</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Home
                    </Link>
                    <Link
                        href="/shop"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Shop
                    </Link>
                    {auth.user && (
                        <>
                            <Link
                                href="/orders"
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                My Orders
                            </Link>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    Admin
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {/* Cart */}
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    {cartCount}
                                </Badge>
                            )}
                            <span className="sr-only">Shopping cart ({cartCount} items)</span>
                        </Button>
                    </Link>

                    {/* User Menu */}
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/orders" className="cursor-pointer">
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        <span>My Orders</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings/profile" className="cursor-pointer">
                                        <SettingsIcon className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer">
                                                <Package className="mr-2 h-4 w-4" />
                                                <span>Admin Panel</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/logout" method="post" as="button" className="w-full cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Sign up</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col space-y-4 mt-4">
                                <Link
                                    href="/"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    <HomeIcon className="inline mr-2 h-4 w-4" />
                                    Home
                                </Link>
                                <Link
                                    href="/shop"
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    <ShoppingBag className="inline mr-2 h-4 w-4" />
                                    Shop
                                </Link>
                                {auth.user && (
                                    <>
                                        <Link
                                            href="/orders"
                                            className="text-sm font-medium transition-colors hover:text-primary"
                                        >
                                            <Package className="inline mr-2 h-4 w-4" />
                                            My Orders
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                className="text-sm font-medium transition-colors hover:text-primary"
                                            >
                                                <SettingsIcon className="inline mr-2 h-4 w-4" />
                                                Admin Panel
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
