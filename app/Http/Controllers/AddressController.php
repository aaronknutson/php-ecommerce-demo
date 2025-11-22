<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(): Response
    {
        $addresses = Address::query()
            ->where('user_id', auth()->id())
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Settings/Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:shipping,billing,both',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $validated['user_id'] = auth()->id();

        if ($validated['is_default'] ?? false) {
            Address::where('user_id', auth()->id())->update(['is_default' => false]);
        }

        Address::create($validated);

        return redirect()->route('addresses.index')->with('success', 'Address added successfully');
    }

    public function update(Request $request, Address $address): RedirectResponse
    {
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'type' => 'required|in:shipping,billing,both',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            Address::where('user_id', auth()->id())->update(['is_default' => false]);
        }

        $address->update($validated);

        return redirect()->route('addresses.index')->with('success', 'Address updated successfully');
    }

    public function destroy(Address $address): RedirectResponse
    {
        if ($address->user_id !== auth()->id()) {
            abort(403);
        }

        $address->delete();

        return redirect()->route('addresses.index')->with('success', 'Address deleted successfully');
    }
}
