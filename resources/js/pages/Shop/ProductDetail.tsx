import StoreLayout from '@/layouts/store-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { Package, ShoppingCart, ArrowLeft, Plus, Minus, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    brand: string;
    description: string;
    specs: Record<string, string>;
    price: number;
    compare_price: number | null;
    stock: number;
    primary_image: string | null;
    images: string[];
    category: Category;
}

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: Props) {
    const [quantity, setQuantity] = useState(1);

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

    const handleAddToCart = () => {
        router.post('/cart', {
            product_id: product.id,
            quantity,
        }, {
            preserveScroll: true,
        });
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const discount = calculateDiscount(product.price, product.compare_price);

    return (
        <StoreLayout>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Shop
                    </Link>
                </div>

                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Product Image */}
                    <div>
                        <Card>
                            <CardContent className="p-6">
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                    {product.primary_image ? (
                                        <img
                                            src={product.primary_image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Package className="h-32 w-32 text-muted-foreground" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="secondary" className="mb-2">
                                {product.category.name}
                            </Badge>
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <p className="text-lg text-muted-foreground">{product.brand}</p>
                            <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-bold">
                                {formatCurrency(product.price)}
                            </span>
                            {product.compare_price && product.compare_price > product.price && (
                                <>
                                    <span className="text-xl text-muted-foreground line-through">
                                        {formatCurrency(product.compare_price)}
                                    </span>
                                    <Badge variant="destructive" className="text-sm">
                                        {discount}% OFF
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.stock <= 0 ? (
                                <Badge variant="destructive" className="text-sm">
                                    Out of Stock
                                </Badge>
                            ) : product.stock <= 10 ? (
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-sm">
                                        Only {product.stock} left in stock
                                    </Badge>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="font-medium">In Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Add to Cart */}
                        {product.stock > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-md">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (value >= 1 && value <= product.stock) {
                                                    setQuantity(value);
                                                }
                                            }}
                                            className="w-20 text-center border-0 focus-visible:ring-0"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        size="lg"
                                        onClick={handleAddToCart}
                                        className="flex-1"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Specifications */}
                {Object.keys(product.specs).length > 0 && (
                    <Card className="mb-12">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-2 border-b">
                                        <span className="font-medium capitalize">
                                            {key.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-muted-foreground">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <Link key={relatedProduct.id} href={`/shop/${relatedProduct.slug}`}>
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                                {relatedProduct.primary_image ? (
                                                    <img
                                                        src={relatedProduct.primary_image}
                                                        alt={relatedProduct.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-12 w-12 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-semibold line-clamp-2">
                                                    {relatedProduct.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {relatedProduct.brand}
                                                </p>
                                                <div className="text-lg font-bold">
                                                    {formatCurrency(relatedProduct.price)}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
