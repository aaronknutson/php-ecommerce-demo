import StoreLayout from '@/layouts/store-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { MapPin, Phone, Mail, Clock, ArrowRight, Package, ShoppingCart } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string;
    price: number;
    compare_price: number | null;
    category: Category;
    primary_image: string | null;
}

interface StoreInfo {
    id: number;
    name: string;
    about: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
    email: string;
    hours: Record<string, string>;
    map_embed: string | null;
    images: string[] | null;
}

interface Props {
    store: StoreInfo;
    featuredProducts: Product[];
}

export default function Home({ store, featuredProducts }: Props) {
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

    return (
        <StoreLayout>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10">
                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div>
                                <Badge variant="secondary" className="mb-4">
                                    Visit Our Store
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                    {store.name}
                                </h1>
                                <p className="text-xl text-muted-foreground mt-4">
                                    Your premier destination for cutting-edge electronics
                                </p>
                            </div>

                            <p className="text-lg leading-relaxed">{store.about}</p>

                            <div className="flex gap-4">
                                <Link href="/shop">
                                    <Button size="lg">
                                        Shop Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" asChild>
                                    <a href="#location">Visit Us</a>
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&auto=format&fit=crop&q=80"
                                    alt="Modern tech workspace with multiple monitors"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products Section */}
            <div className="bg-background">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
                        <p className="text-muted-foreground text-lg">
                            Check out our handpicked selection of premium electronics
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Card key={product.id} className="h-full hover:shadow-lg transition-shadow flex flex-col">
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <Link href={`/shop/${product.slug}`} className="block">
                                        <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                                            {product.primary_image ? (
                                                <img
                                                    src={product.primary_image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Package className="h-16 w-16 text-muted-foreground" />
                                            )}
                                        </div>
                                    </Link>

                                    <div className="space-y-2 flex-1">
                                        <Badge variant="secondary" className="text-xs">
                                            {product.category.name}
                                        </Badge>
                                        <Link href={`/shop/${product.slug}`}>
                                            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            {product.brand}
                                        </p>

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
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/shop">
                            <Button size="lg" variant="outline">
                                View All Products
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Store Location Section */}
            <div id="location" className="bg-muted/30">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Visit Our Store</h2>
                        <p className="text-muted-foreground text-lg">
                            Come experience our products in person
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Store Info Card */}
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        Store Information
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">Address</p>
                                                <p className="text-muted-foreground">
                                                    {store.address_line_1}
                                                </p>
                                                {store.address_line_2 && (
                                                    <p className="text-muted-foreground">
                                                        {store.address_line_2}
                                                    </p>
                                                )}
                                                <p className="text-muted-foreground">
                                                    {store.city}, {store.state} {store.zip_code}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">Phone</p>
                                                <a
                                                    href={`tel:${store.phone}`}
                                                    className="text-muted-foreground hover:text-primary"
                                                >
                                                    {store.phone}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">Email</p>
                                                <a
                                                    href={`mailto:${store.email}`}
                                                    className="text-muted-foreground hover:text-primary"
                                                >
                                                    {store.email}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium mb-2">Store Hours</p>
                                                <div className="space-y-1">
                                                    {Object.entries(store.hours).map(
                                                        ([day, hours]) => (
                                                            <div
                                                                key={day}
                                                                className="flex justify-between text-sm"
                                                            >
                                                                <span className="text-muted-foreground capitalize">
                                                                    {day}:
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    {hours}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Map Card */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                    {store.map_embed ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: store.map_embed,
                                            }}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">
                                                Map coming soon
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="relative bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 dark:from-primary/10 dark:via-secondary/8 dark:to-accent/10 overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}></div>

                <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to upgrade your tech?
                    </h2>
                    <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                        Browse our full catalog or visit us in store for personalized service
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products">
                            <Button size="lg" variant="default" className="shadow-lg hover:shadow-xl transition-shadow">
                                Shop All Products
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" asChild>
                            <a href={`tel:${store.phone}`}>Call Us</a>
                        </Button>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
