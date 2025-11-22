import CustomerDashboardLayout from '@/layouts/customer-dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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
    is_default: boolean;
}

interface Props {
    addresses: Address[];
}

export default function Index({ addresses }: Props) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            type: formData.get('type'),
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            address_line_1: formData.get('address_line_1'),
            address_line_2: formData.get('address_line_2'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip_code: formData.get('zip_code'),
            country: formData.get('country'),
            phone: formData.get('phone'),
            is_default: formData.get('is_default') === 'on',
        };

        router.post('/addresses', data, {
            onSuccess: () => {
                setIsAddDialogOpen(false);
            },
        });
    };

    const handleDelete = (addressId: number) => {
        if (confirm('Are you sure you want to delete this address?')) {
            router.delete(`/addresses/${addressId}`);
        }
    };

    return (
        <CustomerDashboardLayout>
            <Head title="My Addresses" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">My Addresses</h2>
                        <p className="text-muted-foreground">
                            Manage your shipping and billing addresses
                        </p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Address
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Address</DialogTitle>
                                <DialogDescription>
                                    Add a shipping or billing address to your account
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="type">Address Type</Label>
                                    <Select name="type" defaultValue="shipping" required>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="shipping">Shipping</SelectItem>
                                            <SelectItem value="billing">Billing</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input id="first_name" name="first_name" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input id="last_name" name="last_name" required />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="address_line_1">Address Line 1</Label>
                                    <Input id="address_line_1" name="address_line_1" required />
                                </div>

                                <div>
                                    <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                                    <Input id="address_line_2" name="address_line_2" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State</Label>
                                        <Input id="state" name="state" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="zip_code">ZIP Code</Label>
                                        <Input id="zip_code" name="zip_code" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            defaultValue="USA"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" name="phone" type="tel" required />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="is_default" name="is_default" />
                                    <Label
                                        htmlFor="is_default"
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        Set as default address
                                    </Label>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Save Address</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {addresses.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No addresses yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Add a shipping or billing address to make checkout faster
                            </p>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Address
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {addresses.map((address) => (
                            <Card key={address.id}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="text-base">
                                            {address.first_name} {address.last_name}
                                        </span>
                                        {address.is_default && (
                                            <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-1 rounded">
                                                Default
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm space-y-1 text-muted-foreground">
                                        <p className="font-medium text-foreground capitalize">
                                            {address.type} Address
                                        </p>
                                        <p>{address.address_line_1}</p>
                                        {address.address_line_2 && <p>{address.address_line_2}</p>}
                                        <p>
                                            {address.city}, {address.state} {address.zip_code}
                                        </p>
                                        <p>{address.country}</p>
                                        <p className="pt-2">{address.phone}</p>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </CustomerDashboardLayout>
    );
}
