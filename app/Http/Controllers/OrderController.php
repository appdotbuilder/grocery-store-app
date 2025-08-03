<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Store a newly created order.
     */
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();
        
        // Calculate totals
        $subtotal = 0;
        $items = [];
        
        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $quantity = $item['quantity'];
            $price = $product->final_price;
            $total = $price * $quantity;
            
            $items[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_price' => $price,
                'quantity' => $quantity,
                'total' => $total,
            ];
            
            $subtotal += $total;
        }
        
        // Calculate delivery fee
        $deliveryFee = 0;
        if ($validated['delivery_type'] === 'delivery') {
            $deliveryFee = Setting::get('delivery_fee', 5000);
        }
        
        $total = $subtotal + $deliveryFee;
        
        // Create order
        $order = Order::create([
            'order_number' => Order::generateOrderNumber(),
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_address' => $validated['customer_address'] ?? null,
            'delivery_type' => $validated['delivery_type'],
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'total' => $total,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);
        
        // Create order items
        foreach ($items as $item) {
            $order->items()->create($item);
        }
        
        // Load the order with items for the response
        $order->load('items.product');
        
        // Generate WhatsApp message
        $whatsappMessage = $this->generateWhatsAppMessage($order);
        $whatsappUrl = $this->generateWhatsAppUrl($whatsappMessage);
        
        return Inertia::render('order-success', [
            'order' => $order,
            'whatsappUrl' => $whatsappUrl,
        ]);
    }
    
    /**
     * Generate WhatsApp message for the order.
     */
    protected function generateWhatsAppMessage(Order $order): string
    {
        $storeName = Setting::get('store_name', 'Grocery Store');
        $storePhone = Setting::get('whatsapp_number', '');
        
        $message = "🛒 *Pesanan Baru dari {$storeName}*\n\n";
        $message .= "📋 *Detail Pesanan:*\n";
        $message .= "Nomor Pesanan: {$order->order_number}\n";
        $message .= "Nama: {$order->customer_name}\n";
        $message .= "No. HP: {$order->customer_phone}\n";
        
        if ($order->delivery_type === 'delivery' && $order->customer_address) {
            $message .= "Alamat: {$order->customer_address}\n";
        }
        
        $message .= "Jenis Pengiriman: " . ($order->delivery_type === 'delivery' ? 'Antar ke Rumah' : 'Ambil di Toko') . "\n\n";
        
        $message .= "🛍️ *Item Pesanan:*\n";
        foreach ($order->items as $item) {
            $message .= "• {$item->product_name} - {$item->quantity}x @ Rp " . number_format($item->product_price, 0, ',', '.') . " = Rp " . number_format($item->total, 0, ',', '.') . "\n";
        }
        
        $message .= "\n💰 *Ringkasan Biaya:*\n";
        $message .= "Subtotal: Rp " . number_format($order->subtotal, 0, ',', '.') . "\n";
        
        if ($order->delivery_fee > 0) {
            $message .= "Ongkir: Rp " . number_format($order->delivery_fee, 0, ',', '.') . "\n";
        }
        
        $message .= "**Total: Rp " . number_format($order->total, 0, ',', '.') . "**\n\n";
        
        if ($order->notes) {
            $message .= "📝 *Catatan:* {$order->notes}\n\n";
        }
        
        $message .= "Terima kasih telah berbelanja di {$storeName}! 🙏";
        
        return $message;
    }
    
    /**
     * Generate WhatsApp URL with pre-filled message.
     */
    protected function generateWhatsAppUrl(string $message): string
    {
        $whatsappNumber = Setting::get('whatsapp_number', '');
        
        // Remove any non-numeric characters and ensure proper format
        $whatsappNumber = preg_replace('/[^0-9]/', '', $whatsappNumber);
        
        if (strpos($whatsappNumber, '0') === 0) {
            $whatsappNumber = '62' . substr($whatsappNumber, 1);
        }
        
        return 'https://wa.me/' . $whatsappNumber . '?text=' . urlencode($message);
    }
}