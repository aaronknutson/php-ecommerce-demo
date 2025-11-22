import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import ProductForm from './ProductForm';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    sku: string;
    description: string;
    brand?: string;
    specs?: Record<string, string>;
    price: number;
    compare_price?: number;
    stock: number;
    is_active: boolean;
    is_featured: boolean;
}

interface Props {
    product: Product;
    categories: Category[];
}

export default function Edit({ product, categories }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (data: Record<string, unknown>) => {
        setIsSubmitting(true);
        router.put(`/admin/products/${product.id}`, data, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout title="Edit Product">
            <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Edit Product</h1>
                        <p className="text-muted-foreground">Update product information</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                            <CardDescription>
                                Make changes to the product details below
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProductForm
                                categories={categories}
                                product={product}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
