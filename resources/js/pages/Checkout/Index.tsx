import StoreLayout from '@/layouts/store-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { Package, CreditCard, MapPin } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

interface Address {
    id: number;
    type: string;
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
}

interface Props {
    cartItems: CartItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    addresses: Address[];
}

export default function Index({ cartItems, subtotal, tax, shipping, total, addresses }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <StoreLayout>
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <Form action="/checkout" method="post">
                    {({ errors, hasErrors, processing, wasSuccessful }) => (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Checkout Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Shipping Address */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Shipping Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="shipping_first_name">First Name</Label>
                                                <Input
                                                    id="shipping_first_name"
                                                    name="shipping_address[first_name]"
                                                    required
                                                />
                                                {errors['shipping_address.first_name'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['shipping_address.first_name']}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="shipping_last_name">Last Name</Label>
                                                <Input
                                                    id="shipping_last_name"
                                                    name="shipping_address[last_name]"
                                                    required
                                                />
                                                {errors['shipping_address.last_name'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['shipping_address.last_name']}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="shipping_address_1">Address Line 1</Label>
                                            <Input
                                                id="shipping_address_1"
                                                name="shipping_address[address_line_1]"
                                                required
                                            />
                                            {errors['shipping_address.address_line_1'] && (
                                                <p className="text-sm text-destructive mt-1">
                                                    {errors['shipping_address.address_line_1']}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="shipping_address_2">
                                                Address Line 2 (Optional)
                                            </Label>
                                            <Input
                                                id="shipping_address_2"
                                                name="shipping_address[address_line_2]"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="shipping_city">City</Label>
                                                <Input
                                                    id="shipping_city"
                                                    name="shipping_address[city]"
                                                    required
                                                />
                                                {errors['shipping_address.city'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['shipping_address.city']}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="shipping_state">State</Label>
                                                <Input
                                                    id="shipping_state"
                                                    name="shipping_address[state]"
                                                    required
                                                />
                                                {errors['shipping_address.state'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['shipping_address.state']}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="shipping_zip">ZIP Code</Label>
                                                <Input
                                                    id="shipping_zip"
                                                    name="shipping_address[zip_code]"
                                                    required
                                                />
                                                {errors['shipping_address.zip_code'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['shipping_address.zip_code']}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="shipping_country">Country</Label>
                                                <Input
                                                    id="shipping_country"
                                                    name="shipping_address[country]"
                                                    defaultValue="USA"
                                                    required
                                                />
                                                {errors['shipping_address.country'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['shipping_address.country']}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="shipping_phone">Phone</Label>
                                                <Input
                                                    id="shipping_phone"
                                                    name="shipping_address[phone]"
                                                    type="tel"
                                                    required
                                                />
                                                {errors['shipping_address.phone'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['shipping_address.phone']}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Billing Address */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Billing Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="billing_first_name">First Name</Label>
                                                <Input
                                                    id="billing_first_name"
                                                    name="billing_address[first_name]"
                                                    required
                                                />
                                                {errors['billing_address.first_name'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['billing_address.first_name']}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="billing_last_name">Last Name</Label>
                                                <Input
                                                    id="billing_last_name"
                                                    name="billing_address[last_name]"
                                                    required
                                                />
                                                {errors['billing_address.last_name'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['billing_address.last_name']}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="billing_address_1">Address Line 1</Label>
                                            <Input
                                                id="billing_address_1"
                                                name="billing_address[address_line_1]"
                                                required
                                            />
                                            {errors['billing_address.address_line_1'] && (
                                                <p className="text-sm text-destructive mt-1">
                                                    {errors['billing_address.address_line_1']}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="billing_address_2">
                                                Address Line 2 (Optional)
                                            </Label>
                                            <Input
                                                id="billing_address_2"
                                                name="billing_address[address_line_2]"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="billing_city">City</Label>
                                                <Input
                                                    id="billing_city"
                                                    name="billing_address[city]"
                                                    required
                                                />
                                                {errors['billing_address.city'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['billing_address.city']}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="billing_state">State</Label>
                                                <Input
                                                    id="billing_state"
                                                    name="billing_address[state]"
                                                    required
                                                />
                                                {errors['billing_address.state'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['billing_address.state']}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="billing_zip">ZIP Code</Label>
                                                <Input
                                                    id="billing_zip"
                                                    name="billing_address[zip_code]"
                                                    required
                                                />
                                                {errors['billing_address.zip_code'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['billing_address.zip_code']}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="billing_country">Country</Label>
                                                <Input
                                                    id="billing_country"
                                                    name="billing_address[country]"
                                                    defaultValue="USA"
                                                    required
                                                />
                                                {errors['billing_address.country'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['billing_address.country']}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="billing_phone">Phone</Label>
                                                <Input
                                                    id="billing_phone"
                                                    name="billing_address[phone]"
                                                    type="tel"
                                                    required
                                                />
                                                {errors['billing_address.phone'] && (
                                                    <p className="text-sm text-destructive mt-1">
                                                        {errors['billing_address.phone']}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Method */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Payment Method
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="payment_method">Select Payment Method</Label>
                                            <Select name="payment_method" defaultValue="credit_card" required>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                                    <SelectItem value="paypal">PayPal</SelectItem>
                                                    <SelectItem value="cash_on_delivery">
                                                        Cash on Delivery
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.payment_method && (
                                                <p className="text-sm text-destructive mt-1">
                                                    {errors.payment_method}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="notes">
                                                Order Notes (Optional)
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                placeholder="Any special instructions for your order?"
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <Card className="sticky top-6">
                                    <CardHeader>
                                        <CardTitle>Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Cart Items */}
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {cartItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-muted-foreground">
                                                        {item.product.name} × {item.quantity}
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatCurrency(
                                                            item.product.price * item.quantity
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t pt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span className="font-medium">
                                                    {formatCurrency(subtotal)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Shipping</span>
                                                <span className="font-medium">
                                                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Tax (8%)</span>
                                                <span className="font-medium">
                                                    {formatCurrency(tax)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between mb-4">
                                                <span className="font-semibold">Total</span>
                                                <span className="text-2xl font-bold">
                                                    {formatCurrency(total)}
                                                </span>
                                            </div>

                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full"
                                                disabled={processing}
                                            >
                                                {processing ? 'Processing...' : 'Place Order'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </StoreLayout>
    );
}
