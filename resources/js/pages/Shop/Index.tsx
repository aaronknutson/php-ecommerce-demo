import StoreLayout from '@/layouts/store-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { Search, Package, Filter, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Category {
    id: number;
    name: string;
    slug: string;
    children?: Category[];
}

interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string;
    price: number;
    compare_price: number | null;
    stock: number;
    primary_image: string | null;
    category: Category;
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
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        sort?: string;
    };
}

export default function Index({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/shop', { ...filters, search }, { preserveState: true });
    };

    const handleCategoryChange = (categorySlug: string) => {
        router.get('/shop', { ...filters, category: categorySlug }, { preserveState: true });
    };

    const handleSortChange = (sort: string) => {
        router.get('/shop', { ...filters, sort }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        router.get('/shop');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const calculateDiscount = (price: number, comparePrice: number | null) => {
        if (!comparePrice || comparePrice <= price) {
            return 0;
        }
        return Math.round(((comparePrice - price) / comparePrice) * 100);
    };

    const hasActiveFilters = filters.search || filters.category || filters.sort;

    return (
        <StoreLayout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
                    <p className="text-muted-foreground">
                        Browse our complete collection of {products.total} products
                    </p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search products..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button type="submit">Search</Button>
                                </div>
                            </form>

                            {/* Category Filter */}
                            <Select
                                value={filters.category || 'all'}
                                onValueChange={(value) =>
                                    value === 'all' ? clearFilters() : handleCategoryChange(value)
                                }
                            >
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.slug}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Sort */}
                            <Select
                                value={filters.sort || 'latest'}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest</SelectItem>
                                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                    <SelectItem value="name">Name A-Z</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                {products.data.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your search or filters
                            </p>
                            <Button onClick={clearFilters}>Clear Filters</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.data.map((product) => (
                                <Card key={product.id} className="h-full hover:shadow-lg transition-shadow flex flex-col">
                                    <CardContent className="p-4 flex-1 flex flex-col">
                                        <Link href={`/shop/${product.slug}`} className="block">
                                            {/* Product Image */}
                                            <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                                {product.primary_image ? (
                                                    <img
                                                        src={product.primary_image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-16 w-16 text-muted-foreground" />
                                                )}
                                            </div>
                                        </Link>

                                        {/* Product Info */}
                                        <div className="space-y-2 flex-1">
                                            <Badge variant="secondary" className="text-xs">
                                                {product.category.name}
                                            </Badge>
                                            <Link href={`/shop/${product.slug}`}>
                                                <h3 className="font-semibold line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground">
                                                {product.brand}
                                            </p>

                                            {/* Stock Badge */}
                                            {product.stock <= 0 ? (
                                                <Badge variant="destructive">Out of Stock</Badge>
                                            ) : product.stock <= 10 ? (
                                                <Badge variant="secondary">
                                                    Only {product.stock} left
                                                </Badge>
                                            ) : null}

                                            {/* Price */}
                                            <div className="flex items-center gap-2 pt-2">
                                                <span className="text-xl font-bold">
                                                    {formatCurrency(product.price)}
                                                </span>
                                                {product.compare_price &&
                                                    product.compare_price > product.price && (
                                                        <>
                                                            <span className="text-sm text-muted-foreground line-through">
                                                                {formatCurrency(
                                                                    product.compare_price
                                                                )}
                                                            </span>
                                                            <Badge
                                                                variant="destructive"
                                                                className="text-xs"
                                                            >
                                                                {calculateDiscount(
                                                                    product.price,
                                                                    product.compare_price
                                                                )}
                                                                % OFF
                                                            </Badge>
                                                        </>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        {product.stock > 0 && (
                                            <Button
                                                className="w-full mt-4"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.post('/cart', {
                                                        product_id: product.id,
                                                        quantity: 1,
                                                    }, {
                                                        preserveScroll: true,
                                                    });
                                                }}
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add to Cart
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing {(products.current_page - 1) * products.per_page + 1} to{' '}
                                    {Math.min(
                                        products.current_page * products.per_page,
                                        products.total
                                    )}{' '}
                                    of {products.total} products
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
                    </>
                )}
            </div>
        </StoreLayout>
    );
}
