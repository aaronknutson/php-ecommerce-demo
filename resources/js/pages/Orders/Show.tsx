import StoreLayout from '@/layouts/store-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    primary_image: string | null;
}

interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: number;
    total: number;
}

interface Address {
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shipping_address: Address;
    billing_address: Address;
    payment_method: string;
    notes: string | null;
    created_at: string;
    items: OrderItem[];
}

interface Props {
    order: Order;
}

export default function Show({ order }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'processing':
                return 'default';
            case 'shipped':
                return 'default';
            case 'delivered':
                return 'default';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatPaymentMethod = (method: string) => {
        return method
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatAddress = (address: Address) => {
        return (
            <>
                <p className="font-medium">
                    {address.first_name} {address.last_name}
                </p>
                <p>{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p>
                    {address.city}, {address.state} {address.zip_code}
                </p>
                <p>{address.country}</p>
                <p className="mt-2">Phone: {address.phone}</p>
            </>
        );
    };

    return (
        <StoreLayout>
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/orders"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Orders
                    </Link>
                </div>

                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Order {order.order_number}</h1>
                        <p className="text-muted-foreground">
                            Placed on {formatDate(order.created_at)}
                        </p>
                    </div>
                    <Badge variant={getStatusVariant(order.status)} className="text-lg px-4 py-2">
                        {getStatusLabel(order.status)}
                    </Badge>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                                        <Link
                                            href={`/shop/${item.product.slug}`}
                                            className="flex-shrink-0"
                                        >
                                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
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
                                        <div className="flex-1">
                                            <Link href={`/shop/${item.product.slug}`}>
                                                <h3 className="font-semibold hover:text-primary">
                                                    {item.product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatCurrency(item.price)} each
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">
                                                {formatCurrency(item.total)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Addresses */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <MapPin className="h-4 w-4" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    {formatAddress(order.shipping_address)}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <MapPin className="h-4 w-4" />
                                        Billing Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground">
                                    {formatAddress(order.billing_address)}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment & Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CreditCard className="h-4 w-4" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-1">Payment Method</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatPaymentMethod(order.payment_method)}
                                    </p>
                                </div>
                                {order.notes && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Order Notes</p>
                                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
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
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">
                                            {formatCurrency(order.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="font-medium">
                                            {order.shipping === 0
                                                ? 'FREE'
                                                : formatCurrency(order.shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax (8%)</span>
                                        <span className="font-medium">
                                            {formatCurrency(order.tax)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-2xl font-bold">
                                            {formatCurrency(order.total)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
