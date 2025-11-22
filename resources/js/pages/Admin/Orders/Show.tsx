import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
}

interface OrderItem {
    id: number;
    product_id: number;
    product?: Product;
    quantity: number;
    price: number;
    subtotal: number;
    product_snapshot: {
        name: string;
        sku: string;
        brand?: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    user_id: number | null;
    user?: User;
    guest_email: string | null;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shipping_address?: {
        line_1: string;
        line_2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    billing_address?: {
        line_1: string;
        line_2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
    payment_method: string | null;
    notes: string | null;
    items?: OrderItem[];
    created_at: string;
    updated_at: string;
}

interface Props {
    order: Order;
    statuses: Record<string, string>;
}

export default function Show({ order, statuses }: Props) {
    const [status, setStatus] = useState(order.status);
    const [notes, setNotes] = useState(order.notes || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = () => {
        setIsUpdating(true);
        router.patch(
            `/admin/orders/${order.id}/status`,
            { status, notes },
            {
                onFinish: () => setIsUpdating(false),
            }
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            pending: 'secondary',
            processing: 'default',
            shipped: 'outline',
            delivered: 'default',
            cancelled: 'destructive',
        };
        return colors[status] || 'secondary';
    };

    const formatAddress = (address: Order['shipping_address']) => {
        if (!address) {
            return <p className="text-muted-foreground">No address provided</p>;
        }
        return (
            <>
                <p>{address.line_1}</p>
                {address.line_2 && <p>{address.line_2}</p>}
                <p>
                    {address.city}, {address.state} {address.postal_code}
                </p>
                <p>{address.country}</p>
            </>
        );
    };

    return (
        <AppLayout title={`Order ${order.order_number}`}>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.get('/admin/orders')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Orders
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
                            <p className="text-muted-foreground">
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <Badge variant={getStatusColor(order.status)} className="text-base px-4 py-2">
                        {statuses[order.status]}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Order Items */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items
                                </CardTitle>
                                <CardDescription>
                                    {order.items?.length || 0} items in this order
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {item.product_snapshot.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    SKU: {item.product_snapshot.sku}
                                                    {item.product_snapshot.brand &&
                                                        ` • ${item.product_snapshot.brand}`}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity} × {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">
                                                    {formatCurrency(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>{formatCurrency(order.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax</span>
                                            <span>{formatCurrency(order.tax)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span>{formatCurrency(order.shipping)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                                            <span>Total</span>
                                            <span>{formatCurrency(order.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Status Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Order Status</CardTitle>
                                <CardDescription>
                                    Change the order status and add internal notes
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statuses).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Internal Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add internal notes about this order..."
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    onClick={handleUpdateStatus}
                                    disabled={isUpdating || status === order.status}
                                >
                                    {isUpdating ? 'Updating...' : 'Update Status'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Info Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Customer
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.user ? (
                                    <div>
                                        <p className="font-medium">{order.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.user.email}
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-medium">Guest Customer</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.guest_email}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                                {formatAddress(order.shipping_address)}
                            </CardContent>
                        </Card>

                        {/* Billing Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Billing Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                                {formatAddress(order.billing_address)}
                                {order.payment_method && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-muted-foreground">Payment Method</p>
                                        <p className="font-medium capitalize">
                                            {order.payment_method}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
