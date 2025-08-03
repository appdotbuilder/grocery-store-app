import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    total: number;
    product: {
        category: {
            icon: string;
        };
    };
    [key: string]: unknown;
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string | null;
    delivery_type: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    status: string;
    notes: string | null;
    items: OrderItem[];
    [key: string]: unknown;
}

interface Props {
    order: Order;
    whatsappUrl: string;
    [key: string]: unknown;
}

export default function OrderSuccess({ order, whatsappUrl }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const openWhatsApp = () => {
        window.open(whatsappUrl, '_blank');
    };

    return (
        <>
            <Head title={`Pesanan Berhasil - ${order.order_number}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
                                Kembali ke Beranda
                            </Button>
                            <h1 className="text-xl font-bold">✅ Pesanan Berhasil</h1>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Success Message */}
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-green-800 mb-2">
                                        Pesanan Berhasil Dibuat! 🎉
                                    </h2>
                                    <p className="text-green-700 mb-4">
                                        Nomor pesanan Anda: <strong>{order.order_number}</strong>
                                    </p>
                                    <p className="text-green-600">
                                        Silakan lanjutkan ke WhatsApp untuk menyelesaikan pesanan
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* WhatsApp Action */}
                        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">
                                        Langkah Terakhir: Kirim Pesanan via WhatsApp
                                    </h3>
                                    <p className="mb-6 opacity-90">
                                        Klik tombol di bawah ini untuk membuka WhatsApp dengan pesan 
                                        pesanan yang sudah disiapkan. Kirim pesan tersebut untuk 
                                        menyelesaikan pesanan Anda.
                                    </p>
                                    <Button
                                        onClick={openWhatsApp}
                                        size="lg"
                                        className="bg-white text-green-600 hover:bg-gray-100"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Buka WhatsApp & Kirim Pesanan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>📋 Detail Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <strong>Nomor Pesanan:</strong><br />
                                        {order.order_number}
                                    </div>
                                    <div>
                                        <strong>Status:</strong><br />
                                        <Badge className="bg-yellow-500">
                                            Menunggu Konfirmasi
                                        </Badge>
                                    </div>
                                    <div>
                                        <strong>Nama Pelanggan:</strong><br />
                                        {order.customer_name}
                                    </div>
                                    <div>
                                        <strong>No. WhatsApp:</strong><br />
                                        {order.customer_phone}
                                    </div>
                                    <div>
                                        <strong>Metode Pengiriman:</strong><br />
                                        {order.delivery_type === 'delivery' ? '🚚 Antar ke Rumah' : '🏪 Ambil di Toko'}
                                    </div>
                                    <div>
                                        <strong>Total Pembayaran:</strong><br />
                                        <span className="text-lg font-bold text-green-600">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>

                                {order.customer_address && (
                                    <div>
                                        <strong>Alamat Pengiriman:</strong><br />
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.customer_address}
                                        </p>
                                    </div>
                                )}

                                {order.notes && (
                                    <div>
                                        <strong>Catatan:</strong><br />
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>🛍️ Item Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                                        <div className="text-2xl">
                                            {item.product?.category?.icon || '📦'}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.product_name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {formatPrice(item.product_price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">
                                                {formatPrice(item.total)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-2 pt-4 border-t">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ongkos Kirim:</span>
                                        <span>
                                            {order.delivery_fee > 0 
                                                ? formatPrice(order.delivery_fee) 
                                                : 'Gratis'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-green-600">{formatPrice(order.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Next Steps */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-blue-800">📝 Langkah Selanjutnya</CardTitle>
                            </CardHeader>
                            <CardContent className="text-blue-700">
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>Klik tombol "Buka WhatsApp" di atas</li>
                                    <li>Kirim pesan pesanan yang sudah disiapkan</li>
                                    <li>Tunggu konfirmasi dari toko</li>
                                    <li>Lakukan pembayaran sesuai instruksi</li>
                                    <li>
                                        {order.delivery_type === 'delivery' 
                                            ? 'Tunggu pesanan diantar ke alamat Anda' 
                                            : 'Datang ke toko untuk mengambil pesanan'
                                        }
                                    </li>
                                </ol>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={openWhatsApp}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                size="lg"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Kirim via WhatsApp
                            </Button>
                            <Button
                                onClick={() => router.get('/')}
                                variant="outline"
                                size="lg"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Belanja Lagi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}