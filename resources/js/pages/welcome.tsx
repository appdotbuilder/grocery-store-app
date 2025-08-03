import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, MapPin, Phone, Clock, Star } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    discount_price: number | null;
    unit: string;
    stock: number;
    is_featured: boolean;
    is_on_sale: boolean;
    final_price: number;
    category: {
        id: number;
        name: string;
        icon: string;
    };
    [key: string]: unknown;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    products: Product[];
    [key: string]: unknown;
}

interface Props {
    categories: Category[];
    featuredProducts: Product[];
    products: {
        data: Product[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters: {
        search: string | null;
        category: string | null;
    };
    [key: string]: unknown;
}

export default function Welcome({ categories, featuredProducts, products, filters }: Props) {
    const [cart, setCart] = useState<{[key: number]: number}>({});
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const addToCart = (productId: number) => {
        setCart(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[productId] > 1) {
                newCart[productId]--;
            } else {
                delete newCart[productId];
            }
            return newCart;
        });
    };

    const getCartTotal = () => {
        let total = 0;
        Object.entries(cart).forEach(([productId, quantity]) => {
            const product = [...featuredProducts, ...products.data].find(p => p.id === parseInt(productId));
            if (product) {
                total += product.final_price * quantity;
            }
        });
        return total;
    };

    const getCartItemCount = () => {
        return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { search: searchTerm, category: selectedCategory }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryFilter = (categoryId: string) => {
        setSelectedCategory(categoryId);
        router.get('/', { search: searchTerm, category: categoryId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const proceedToCheckout = () => {
        const cartItems = Object.entries(cart).map(([productId, quantity]) => {
            const product = [...featuredProducts, ...products.data].find(p => p.id === parseInt(productId));
            return {
                product_id: parseInt(productId),
                quantity,
                product: product
            };
        }).filter(item => item.product);

        router.get('/checkout', { cart: JSON.stringify(cartItems) });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            <Head title="FreshMart Grocery - Belanja Kebutuhan Sehari-hari" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                {/* Header */}
                <header className="bg-white shadow-md sticky top-0 z-50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="text-2xl font-bold text-green-600">
                                    🛒 FreshMart
                                </div>
                                <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>Jl. Contoh No. 123, Jakarta</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Phone className="w-4 h-4" />
                                        <span>021-1234567</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Buka 08:00 - 22:00</span>
                                    </div>
                                </div>
                            </div>
                            
                            {getCartItemCount() > 0 && (
                                <Button 
                                    onClick={proceedToCheckout}
                                    className="bg-green-600 hover:bg-green-700 relative"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Keranjang ({getCartItemCount()})
                                    <Badge className="ml-2 bg-red-500">
                                        {formatPrice(getCartTotal())}
                                    </Badge>
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            🥬 Belanja Segar, Hidup Sehat! 🍎
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            Dapatkan produk segar berkualitas tinggi langsung ke rumah Anda
                        </p>
                        
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Cari produk..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 text-gray-900"
                                />
                                <Button type="submit" variant="secondary">
                                    <Search className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-2xl mb-2">🚚</div>
                                <div className="font-semibold">Gratis Ongkir</div>
                                <div className="text-sm opacity-80">Min. belanja 100rb</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-2xl mb-2">⚡</div>
                                <div className="font-semibold">Pengiriman Cepat</div>
                                <div className="text-sm opacity-80">Dalam 2 jam</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-2xl mb-2">🌱</div>
                                <div className="font-semibold">100% Segar</div>
                                <div className="text-sm opacity-80">Langsung dari petani</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="text-2xl mb-2">💬</div>
                                <div className="font-semibold">Order via WhatsApp</div>
                                <div className="text-sm opacity-80">Mudah & praktis</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">🛍️ Kategori Produk</h2>
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <Button
                                variant={selectedCategory === '' ? 'default' : 'outline'}
                                onClick={() => handleCategoryFilter('')}
                                className="rounded-full"
                            >
                                Semua
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                                    onClick={() => handleCategoryFilter(category.id.toString())}
                                    className="rounded-full"
                                >
                                    {category.icon} {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                {featuredProducts.length > 0 && (
                    <section className="py-12 bg-white/50">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-8">⭐ Produk Unggulan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative">
                                            <div className="aspect-square bg-gray-100 flex items-center justify-center text-4xl">
                                                {product.category.icon}
                                            </div>
                                            {product.is_on_sale && (
                                                <Badge className="absolute top-2 left-2 bg-red-500">
                                                    DISKON
                                                </Badge>
                                            )}
                                            <Badge className="absolute top-2 right-2 bg-yellow-500">
                                                <Star className="w-3 h-3 mr-1" />
                                                UNGGULAN
                                            </Badge>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2">{product.category.name}</p>
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    {product.discount_price ? (
                                                        <div>
                                                            <span className="text-lg font-bold text-green-600">
                                                                {formatPrice(product.final_price)}
                                                            </span>
                                                            <span className="text-sm text-gray-500 line-through ml-2">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-lg font-bold text-green-600">
                                                            {formatPrice(product.price)}
                                                        </span>
                                                    )}
                                                    <span className="text-sm text-gray-500">/{product.unit}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {cart[product.id] ? (
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => removeFromCart(product.id)}
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="font-semibold">{cart[product.id]}</span>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => addToCart(product.id)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => addToCart(product.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        + Keranjang
                                                    </Button>
                                                )}
                                                <span className="text-sm text-gray-500">
                                                    Stok: {product.stock}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* All Products */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            {filters.search ? `🔍 Hasil Pencarian: "${filters.search}"` : '🛒 Semua Produk'}
                        </h2>
                        
                        {products.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {products.data.map((product) => (
                                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="relative">
                                                <div className="aspect-square bg-gray-100 flex items-center justify-center text-4xl">
                                                    {product.category.icon}
                                                </div>
                                                {product.is_on_sale && (
                                                    <Badge className="absolute top-2 left-2 bg-red-500">
                                                        DISKON
                                                    </Badge>
                                                )}
                                                {product.is_featured && (
                                                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        UNGGULAN
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                                <p className="text-gray-600 text-sm mb-2">{product.category.name}</p>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        {product.discount_price ? (
                                                            <div>
                                                                <span className="text-lg font-bold text-green-600">
                                                                    {formatPrice(product.final_price)}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-green-600">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
                                                        <span className="text-sm text-gray-500">/{product.unit}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    {cart[product.id] ? (
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => removeFromCart(product.id)}
                                                            >
                                                                -
                                                            </Button>
                                                            <span className="font-semibold">{cart[product.id]}</span>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => addToCart(product.id)}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => addToCart(product.id)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            + Keranjang
                                                        </Button>
                                                    )}
                                                    <span className="text-sm text-gray-500">
                                                        Stok: {product.stock}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.links && (
                                    <div className="flex justify-center mt-8 space-x-2">
                                        {products.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url);
                                                    }
                                                }}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">😔</div>
                                <h3 className="text-xl font-semibold mb-2">Produk tidak ditemukan</h3>
                                <p className="text-gray-600 mb-4">
                                    Coba kata kunci lain atau pilih kategori yang berbeda
                                </p>
                                <Button onClick={() => router.get('/')}>
                                    Lihat Semua Produk
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="text-2xl font-bold mb-4">🛒 FreshMart</div>
                                <p className="text-gray-300 mb-4">
                                    Toko kelontong terpercaya dengan produk segar berkualitas tinggi
                                </p>
                                <div className="flex space-x-4">
                                    <Button size="sm" variant="secondary">
                                        📱 Download App
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Kontak</h3>
                                <div className="space-y-2 text-gray-300">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>Jl. Contoh No. 123, Jakarta</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4" />
                                        <span>021-1234567</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Senin - Minggu: 08:00 - 22:00</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-4">Info</h3>
                                <div className="space-y-2 text-gray-300">
                                    <div>✅ Garansi produk segar</div>
                                    <div>🚚 Pengiriman gratis min. 100rb</div>
                                    <div>💬 Order mudah via WhatsApp</div>
                                    <div>⚡ Pengiriman dalam 2 jam</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                            <p>&copy; 2024 FreshMart Grocery. All rights reserved.</p>
                        </div>
                    </div>
                </footer>

                {/* Floating Cart Button */}
                {getCartItemCount() > 0 && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <Button
                            onClick={proceedToCheckout}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 rounded-full shadow-lg"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            {getCartItemCount()} Item
                            <Badge className="ml-2 bg-white text-green-600">
                                {formatPrice(getCartTotal())}
                            </Badge>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}