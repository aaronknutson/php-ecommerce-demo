import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id?: number;
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
    categories: Category[];
    product?: Product;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
}

export default function ProductForm({ categories, product, onSubmit, isSubmitting }: Props) {
    const { data, setData, errors } = useForm({
        category_id: product?.category_id || '',
        name: product?.name || '',
        sku: product?.sku || '',
        description: product?.description || '',
        brand: product?.brand || '',
        price: product?.price || '',
        compare_price: product?.compare_price || '',
        stock: product?.stock || 0,
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Product Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g., MacBook Pro 16"
                        required
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label htmlFor="category">
                        Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={data.category_id.toString()}
                        onValueChange={(value) => setData('category_id', parseInt(value))}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category_id && (
                        <p className="text-sm text-destructive">{errors.category_id}</p>
                    )}
                </div>

                {/* SKU */}
                <div className="space-y-2">
                    <Label htmlFor="sku">
                        SKU <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="sku"
                        value={data.sku}
                        onChange={(e) => setData('sku', e.target.value)}
                        placeholder="e.g., MBP-16-M3"
                        required
                    />
                    {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                </div>

                {/* Brand */}
                <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                        id="brand"
                        value={data.brand}
                        onChange={(e) => setData('brand', e.target.value)}
                        placeholder="e.g., Apple"
                    />
                    {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                </div>

                {/* Price */}
                <div className="space-y-2">
                    <Label htmlFor="price">
                        Price ($) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={data.price}
                        onChange={(e) => setData('price', parseFloat(e.target.value))}
                        placeholder="0.00"
                        required
                    />
                    {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                {/* Compare Price */}
                <div className="space-y-2">
                    <Label htmlFor="compare_price">Compare At Price ($)</Label>
                    <Input
                        id="compare_price"
                        type="number"
                        step="0.01"
                        value={data.compare_price}
                        onChange={(e) => setData('compare_price', parseFloat(e.target.value))}
                        placeholder="0.00"
                    />
                    {errors.compare_price && (
                        <p className="text-sm text-destructive">{errors.compare_price}</p>
                    )}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                    <Label htmlFor="stock">
                        Stock Quantity <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="stock"
                        type="number"
                        value={data.stock}
                        onChange={(e) => setData('stock', parseInt(e.target.value))}
                        placeholder="0"
                        required
                    />
                    {errors.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Enter product description..."
                    rows={5}
                    required
                />
                {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                )}
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                        Active
                    </Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is_featured"
                        checked={data.is_featured}
                        onCheckedChange={(checked) => setData('is_featured', !!checked)}
                    />
                    <Label htmlFor="is_featured" className="cursor-pointer">
                        Featured
                    </Label>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
