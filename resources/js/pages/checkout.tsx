import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, MapPin, User, MessageSquare } from 'lucide-react';

interface CartItem {
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        final_price: number;
        unit: string;
        category: {
            name: string;
            icon: string;
        };
    };
    [key: string]: unknown;
}

interface Props {
    cart?: string;
    [key: string]: unknown;
}

export default function Checkout({ cart: cartParam = '[]' }: Props) {
    const [cartItems] = useState<CartItem[]>(() => {
        try {
            return JSON.parse(cartParam);
        } catch {
            return [];
        }
    });

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        delivery_type: 'pickup' as 'pickup' | 'delivery',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const deliveryFee = 5000;
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.final_price * item.quantity), 0);
    const total = subtotal + (formData.delivery_type === 'delivery' ? deliveryFee : 0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDeliveryTypeChange = (type: 'pickup' | 'delivery') => {
        setFormData(prev => ({ 
            ...prev, 
            delivery_type: type,
            customer_address: type === 'pickup' ? '' : prev.customer_address
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            alert('Keranjang belanja kosong!');
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            ...formData,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
            })),
        };

        router.post('/orders', orderData, {
            onSuccess: () => {
                // Will redirect to order success page
            },
            onError: (errors) => {
                console.error('Order submission failed:', errors);
                alert('Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Head title="Keranjang Belanja Kosong" />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="text-2xl font-bold mb-4">Keranjang Belanja Kosong</h1>
                        <p className="text-gray-600 mb-6">
                            Silakan tambahkan produk ke keranjang terlebih dahulu
                        </p>
                        <Button onClick={() => router.get('/')}>
                            Mulai Belanja
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Checkout - FreshMart Grocery" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.get('/')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali Belanja
                            </Button>
                            <h1 className="text-xl font-bold">🛒 Checkout Pesanan</h1>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Form */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <User className="w-5 h-5" />
                                        <span>Informasi Pelanggan</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="customer_name">Nama Lengkap *</Label>
                                        <Input
                                            id="customer_name"
                                            name="customer_name"
                                            value={formData.customer_name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="customer_phone">Nomor WhatsApp *</Label>
                                        <Input
                                            id="customer_phone"
                                            name="customer_phone"
                                            value={formData.customer_phone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MapPin className="w-5 h-5" />
                                        <span>Metode Pengiriman</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            type="button"
                                            variant={formData.delivery_type === 'pickup' ? 'default' : 'outline'}
                                            onClick={() => handleDeliveryTypeChange('pickup')}
                                            className="h-auto p-4 flex flex-col items-center space-y-2"
                                        >
                                            <div className="text-2xl">🏪</div>
                                            <div className="text-center">
                                                <div className="font-semibold">Ambil di Toko</div>
                                                <div className="text-sm opacity-75">Gratis</div>
                                            </div>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={formData.delivery_type === 'delivery' ? 'default' : 'outline'}
                                            onClick={() => handleDeliveryTypeChange('delivery')}
                                            className="h-auto p-4 flex flex-col items-center space-y-2"
                                        >
                                            <div className="text-2xl">🚚</div>
                                            <div className="text-center">
                                                <div className="font-semibold">Antar ke Rumah</div>
                                                <div className="text-sm opacity-75">{formatPrice(deliveryFee)}</div>
                                            </div>
                                        </Button>
                                    </div>

                                    {formData.delivery_type === 'delivery' && (
                                        <div>
                                            <Label htmlFor="customer_address">Alamat Lengkap *</Label>
                                            <Textarea
                                                id="customer_address"
                                                name="customer_address"
                                                value={formData.customer_address}
                                                onChange={handleInputChange}
                                                required={formData.delivery_type === 'delivery'}
                                                placeholder="Masukkan alamat lengkap untuk pengiriman"
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MessageSquare className="w-5 h-5" />
                                        <span>Catatan Tambahan</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Catatan khusus untuk pesanan (opsional)"
                                        rows={3}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Ringkasan Pesanan</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.product_id} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                                            <div className="text-2xl">{item.product.category.icon}</div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.product.name}</h3>
                                                <p className="text-sm text-gray-600">{item.product.category.name}</p>
                                                <p className="text-sm">
                                                    {formatPrice(item.product.final_price)} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">
                                                    {formatPrice(item.product.final_price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="space-y-2 pt-4 border-t">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ongkos Kirim:</span>
                                            <span>
                                                {formData.delivery_type === 'delivery' 
                                                    ? formatPrice(deliveryFee) 
                                                    : 'Gratis'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                                            <span>Total:</span>
                                            <span className="text-green-600">{formatPrice(total)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* WhatsApp Info */}
                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="pt-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="text-2xl">💬</div>
                                        <div>
                                            <h3 className="font-semibold text-green-800 mb-2">
                                                Pesanan via WhatsApp
                                            </h3>
                                            <p className="text-sm text-green-700">
                                                Setelah klik "Pesan Sekarang", Anda akan diarahkan ke WhatsApp 
                                                dengan pesan pesanan yang sudah disiapkan. Kirim pesan tersebut 
                                                untuk menyelesaikan pesanan.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.customer_name || !formData.customer_phone || 
                                         (formData.delivery_type === 'delivery' && !formData.customer_address)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
                                size="lg"
                            >
                                {isSubmitting ? 'Memproses...' : '💬 Pesan Sekarang via WhatsApp'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}