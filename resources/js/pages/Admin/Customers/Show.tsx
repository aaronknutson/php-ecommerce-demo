import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, Calendar, ShoppingBag, MapPin, Eye } from 'lucide-react';

interface Address {
    id: number;
    type: string;
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
    is_default: boolean;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    items_count: number;
    created_at: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    orders: Order[];
    addresses: Address[];
}

interface Props {
    customer: Customer;
}

export default function Show({ customer }: Props) {
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

    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <AppLayout title={`Customer: ${customer.name}`}>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.get('/admin/customers')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Customers
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{customer.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {customer.email}
                            {customer.email_verified_at ? (
                                <Badge variant="default" className="ml-2">Verified</Badge>
                            ) : (
                                <Badge variant="secondary" className="ml-2">Unverified</Badge>
                            )}
                        </p>
                    </div>
                </div>

                {/* Customer Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{customer.orders.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Customer Since</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Date(customer.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>
                                Last {Math.min(customer.orders.length, 10)} orders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {customer.orders.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No orders yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {customer.orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <code className="text-sm font-medium">
                                                        {order.order_number}
                                                    </code>
                                                    <Badge variant={getStatusColor(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {new Date(order.created_at).toLocaleDateString()} • {order.items_count} items
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatCurrency(order.total)}
                                                    </p>
                                                </div>
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Addresses */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Addresses</CardTitle>
                            <CardDescription>
                                Saved shipping and billing addresses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {customer.addresses.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No addresses saved
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {customer.addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className="p-3 border rounded-lg"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium capitalize">
                                                        {address.type}
                                                    </span>
                                                </div>
                                                {address.is_default && (
                                                    <Badge variant="outline">Default</Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground space-y-1 ml-6">
                                                <p className="font-medium text-foreground">
                                                    {address.first_name} {address.last_name}
                                                </p>
                                                <p>{address.address_line_1}</p>
                                                {address.address_line_2 && <p>{address.address_line_2}</p>}
                                                <p>
                                                    {address.city}, {address.state} {address.zip_code}
                                                </p>
                                                <p>{address.country}</p>
                                                <p className="pt-1">{address.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
