import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { Search, Eye, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    orders_count: number;
    created_at: string;
}

interface PaginatedCustomers {
    data: Customer[];
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
    customers: PaginatedCustomers;
}

export default function Index({ customers }: Props) {
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/customers', { search }, { preserveState: true });
    };

    return (
        <AppLayout title="Manage Customers">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Customers</h1>
                        <p className="text-muted-foreground">
                            View and manage customer accounts
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Customers</CardTitle>
                        <CardDescription>
                            {customers.total} customers total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit">Search</Button>
                                {search && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setSearch('');
                                            router.get('/admin/customers');
                                        }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </form>

                        {/* Customers Table */}
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Customer</th>
                                        <th className="p-3 text-left font-medium">Email Status</th>
                                        <th className="p-3 text-left font-medium">Orders</th>
                                        <th className="p-3 text-left font-medium">Joined</th>
                                        <th className="p-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                No customers found
                                            </td>
                                        </tr>
                                    ) : (
                                        customers.data.map((customer) => (
                                            <tr key={customer.id} className="border-b">
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium">{customer.name}</p>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {customer.email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    {customer.email_verified_at ? (
                                                        <Badge variant="default">Verified</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Unverified</Badge>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant="outline">
                                                        {customer.orders_count} orders
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(customer.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/customers/${customer.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {customers.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {customers.data.length} of {customers.total} customers
                                </p>
                                <div className="flex gap-2">
                                    {customers.links.map((link, index) => (
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
