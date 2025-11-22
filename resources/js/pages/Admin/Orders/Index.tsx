import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, router } from '@inertiajs/react';
import { Search, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    user_id: number | null;
    user?: User;
    guest_email: string | null;
    total: number;
    items_count: number;
    created_at: string;
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
    filters: {
        search?: string;
        status?: string;
    };
    statuses: Record<string, string>;
}

export default function Index({ orders, filters, statuses }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: { search: string; status?: string } = { search };
        if (status && status !== 'all') {
            params.status = status;
        }
        router.get('/admin/orders', params, { preserveState: true });
    };

    const handleStatusFilter = (value: string) => {
        setStatus(value);
        const params: { search: string; status?: string } = { search };
        if (value && value !== 'all') {
            params.status = value;
        }
        router.get('/admin/orders', params, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this cancelled order?')) {
            router.delete(`/admin/orders/${id}`, {
                preserveScroll: true,
            });
        }
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

    return (
        <AppLayout title="Manage Orders">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Orders</h1>
                        <p className="text-muted-foreground">
                            View and manage customer orders
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Orders</CardTitle>
                        <CardDescription>
                            {orders.total} orders total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Search and Filter Bar */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by order number, customer name, or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={status} onValueChange={handleStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        {Object.entries(statuses).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button type="submit">Search</Button>
                                {(filters.search || filters.status) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setSearch('');
                                            setStatus('all');
                                            router.get('/admin/orders');
                                        }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </form>

                        {/* Orders Table */}
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Order #</th>
                                        <th className="p-3 text-left font-medium">Customer</th>
                                        <th className="p-3 text-left font-medium">Items</th>
                                        <th className="p-3 text-left font-medium">Total</th>
                                        <th className="p-3 text-left font-medium">Status</th>
                                        <th className="p-3 text-left font-medium">Date</th>
                                        <th className="p-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.data.map((order) => (
                                            <tr key={order.id} className="border-b">
                                                <td className="p-3">
                                                    <code className="text-sm font-medium">
                                                        {order.order_number}
                                                    </code>
                                                </td>
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium">
                                                            {order.user?.name || 'Guest'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.user?.email || order.guest_email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant="secondary">
                                                        {order.items_count} items
                                                    </Badge>
                                                </td>
                                                <td className="p-3 font-medium">
                                                    {formatCurrency(order.total)}
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant={getStatusColor(order.status)}>
                                                        {statuses[order.status]}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {order.status === 'cancelled' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDelete(order.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {orders.data.length} of {orders.total} orders
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
