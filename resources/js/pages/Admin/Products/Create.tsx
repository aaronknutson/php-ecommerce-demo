import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import ProductForm from './ProductForm';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (data: Record<string, unknown>) => {
        setIsSubmitting(true);
        router.post('/admin/products', data, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout title="Create Product">
            <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Create Product</h1>
                        <p className="text-muted-foreground">Add a new product to your catalog</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                            <CardDescription>
                                Fill in the details below to create a new product
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProductForm
                                categories={categories}
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
