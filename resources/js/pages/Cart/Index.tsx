import StoreLayout from '@/layouts/store-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { Package, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string;
    price: number;
    primary_image: string | null;
    category: Category;
}

interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

interface Props {
    cartItems: CartItem[];
    subtotal: number;
}

export default function Index({ cartItems, subtotal }: Props) {
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const updateQuantity = (cartItemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setUpdatingItems((prev) => new Set(prev).add(cartItemId));

        router.patch(
            `/cart/${cartItemId}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onFinish: () => {
                    setUpdatingItems((prev) => {
                        const next = new Set(prev);
                        next.delete(cartItemId);
                        return next;
                    });
                },
            }
        );
    };

    const removeItem = (cartItemId: number) => {
        if (confirm('Remove this item from your cart?')) {
            router.delete(`/cart/${cartItemId}`, {
                preserveScroll: true,
            });
        }
    };

    const calculateItemTotal = (item: CartItem) => {
        return item.product.price * item.quantity;
    };

    if (cartItems.length === 0) {
        return (
            <StoreLayout>
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                            <p className="text-muted-foreground mb-6">
                                Add some products to get started
                            </p>
                            <Link href="/shop">
                                <Button size="lg">
                                    Continue Shopping
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout>
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <Link
                                            href={`/shop/${item.product.slug}`}
                                            className="flex-shrink-0"
                                        >
                                            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                                {item.product.primary_image ? (
                                                    <img
                                                        src={item.product.primary_image}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                )}
                                            </div>
                                        </Link>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/shop/${item.product.slug}`}>
                                                <h3 className="font-semibold hover:text-primary line-clamp-2">
                                                    {item.product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.product.brand}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.product.category.name}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity <= 1 ||
                                                            updatingItems.has(item.id)
                                                        }
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-12 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        disabled={updatingItems.has(item.id)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <div className="text-lg font-bold">
                                                {formatCurrency(calculateItemTotal(item))}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatCurrency(item.product.price)} each
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Continue Shopping */}
                        <Link href="/shop">
                            <Button variant="outline" className="w-full">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal ({cartItems.length}{' '}
                                            {cartItems.length === 1 ? 'item' : 'items'})
                                        </span>
                                        <span className="font-medium">
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Shipping
                                        </span>
                                        <span className="font-medium">
                                            {subtotal >= 100
                                                ? 'FREE'
                                                : formatCurrency(10)}
                                        </span>
                                    </div>
                                    {subtotal < 100 && (
                                        <p className="text-xs text-muted-foreground">
                                            Free shipping on orders over $100
                                        </p>
                                    )}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between mb-4">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-2xl font-bold">
                                            {formatCurrency(
                                                subtotal + (subtotal >= 100 ? 0 : 10)
                                            )}
                                        </span>
                                    </div>

                                    <Link href="/checkout">
                                        <Button size="lg" className="w-full">
                                            Proceed to Checkout
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
