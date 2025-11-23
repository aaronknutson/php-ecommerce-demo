import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@inertiajs/react';
import { X, Plus } from 'lucide-react';

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
    primary_image?: string;
    images?: string[];
    is_active: boolean;
    is_featured: boolean;
}

interface Props {
    categories: Category[];
    product?: Product;
    onSubmit: (data: Record<string, unknown>) => void;
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
        primary_image: product?.primary_image || '',
        images: product?.images || [],
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    const addImageUrl = () => {
        setData('images', [...data.images, '']);
    };

    const removeImageUrl = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        setData('images', newImages);
    };

    const updateImageUrl = (index: number, value: string) => {
        const newImages = [...data.images];
        newImages[index] = value;
        setData('images', newImages);
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

            {/* Primary Image */}
            <div className="space-y-2">
                <Label htmlFor="primary_image">Primary Image URL</Label>
                <Input
                    id="primary_image"
                    type="url"
                    value={data.primary_image}
                    onChange={(e) => setData('primary_image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                />
                {errors.primary_image && (
                    <p className="text-sm text-destructive">{errors.primary_image}</p>
                )}
                {data.primary_image && (
                    <div className="mt-2">
                        <img
                            src={data.primary_image}
                            alt="Primary preview"
                            className="h-32 w-32 rounded-lg border object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%23999"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Additional Images */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Additional Images</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addImageUrl}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Image
                    </Button>
                </div>
                <div className="space-y-3">
                    {data.images.map((imageUrl, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => updateImageUrl(index, e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt={`Preview ${index + 1}`}
                                        className="mt-2 h-24 w-24 rounded border object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23ddd" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" font-size="12" text-anchor="middle" dy=".3em" fill="%23999"%3EInvalid%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeImageUrl(index)}
                                className="shrink-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
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
