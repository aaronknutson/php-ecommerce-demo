import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle } from 'lucide-react';

interface DashboardStats {
    total_products: number;
    active_products: number;
    low_stock_products: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
    total_customers: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
}

interface Product {
    id: number;
    name: string;
    sku: string;
    stock: number;
    price: number;
}

interface Props {
    stats: DashboardStats;
    recent_orders: Order[];
    low_stock_products: Product[];
}

export default function Dashboard({ stats, recent_orders, low_stock_products }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500',
            processing: 'bg-blue-500',
            shipped: 'bg-purple-500',
            delivered: 'bg-green-500',
            cancelled: 'bg-red-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    return (
        <AppLayout title="Admin Dashboard">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/orders">
                            <Button variant="outline">Manage Orders</Button>
                        </Link>
                        <Link href="/admin/products">
                            <Button>Manage Products</Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_products}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.active_products} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_orders}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pending_orders} pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Customers</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_customers}</div>
                            <p className="text-xs text-muted-foreground">Registered users</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Low Stock Alert */}
                {stats.low_stock_products > 0 && (
                    <Card className="border-yellow-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                Low Stock Alert
                            </CardTitle>
                            <CardDescription>
                                {stats.low_stock_products} products are running low on stock
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {low_stock_products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                SKU: {product.sku}
                                            </p>
                                        </div>
                                        <Badge variant="destructive">{product.stock} left</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest 5 orders placed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recent_orders.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    No orders yet
                                </p>
                            ) : (
                                recent_orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">Order #{order.order_number}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.user?.name || 'Guest'} - {order.user?.email}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                            <p className="font-bold">{formatCurrency(order.total)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
