import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    brand: string;
    price: number;
    stock: number;
    is_active: boolean;
    is_featured: boolean;
    category: Category;
    created_at: string;
}

interface PaginatedProducts {
    data: Product[];
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
    products: PaginatedProducts;
    filters: {
        search?: string;
        category_id?: string;
    };
}

export default function Index({ products, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/products', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${id}`, {
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

    return (
        <AppLayout title="Manage Products">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Products</h1>
                        <p className="text-muted-foreground">
                            Manage your product catalog
                        </p>
                    </div>
                    <Link href="/admin/products/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Products</CardTitle>
                        <CardDescription>
                            {products.total} products total
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, SKU, or brand..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit">Search</Button>
                                {filters.search && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setSearch('');
                                            router.get('/admin/products');
                                        }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </form>

                        {/* Products Table */}
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Product</th>
                                        <th className="p-3 text-left font-medium">SKU</th>
                                        <th className="p-3 text-left font-medium">Category</th>
                                        <th className="p-3 text-left font-medium">Price</th>
                                        <th className="p-3 text-left font-medium">Stock</th>
                                        <th className="p-3 text-left font-medium">Status</th>
                                        <th className="p-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                                No products found
                                            </td>
                                        </tr>
                                    ) : (
                                        products.data.map((product) => (
                                            <tr key={product.id} className="border-b">
                                                <td className="p-3">
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {product.brand}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <code className="text-sm">{product.sku}</code>
                                                </td>
                                                <td className="p-3">{product.category.name}</td>
                                                <td className="p-3 font-medium">
                                                    {formatCurrency(product.price)}
                                                </td>
                                                <td className="p-3">
                                                    <Badge
                                                        variant={
                                                            product.stock <= 10
                                                                ? 'destructive'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {product.stock}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Badge
                                                            variant={
                                                                product.is_active ? 'default' : 'secondary'
                                                            }
                                                        >
                                                            {product.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                        {product.is_featured && (
                                                            <Badge variant="outline">Featured</Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDelete(product.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {products.data.length} of {products.total} products
                                </p>
                                <div className="flex gap-2">
                                    {products.links.map((link, index) => (
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
