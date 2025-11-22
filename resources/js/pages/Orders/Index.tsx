import StoreLayout from '@/layouts/store-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { Package, Eye } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    created_at: string;
    items: OrderItem[];
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    total: number;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    orders: PaginatedOrders;
}

export default function Index({ orders }: Props) {
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

    if (orders.data.length === 0) {
        return (
            <StoreLayout>
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
                            <p className="text-muted-foreground mb-6">
                                Start shopping to place your first order
                            </p>
                            <Link href="/shop">
                                <Button size="lg">Browse Products</Button>
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Orders</h1>
                    <p className="text-muted-foreground">
                        View and track your order history
                    </p>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.data.map((order) => (
                        <Card key={order.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">
                                            Order {order.order_number}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Placed on {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant={getStatusVariant(order.status)}>
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-muted-foreground">
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        </div>
                                        <div className="text-xl font-bold">
                                            {formatCurrency(order.total)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex items-center justify-between mt-8">
                        <p className="text-sm text-muted-foreground">
                            Showing {(orders.current_page - 1) * orders.per_page + 1} to{' '}
                            {Math.min(orders.current_page * orders.per_page, orders.total)} of{' '}
                            {orders.total} orders
                        </p>
                        <div className="flex gap-2">
                            {orders.links.map((link, index) => (
                                <Button
                                    key={index}
                                    size="sm"
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
