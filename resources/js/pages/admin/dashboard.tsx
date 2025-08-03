import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppSidebar } from '@/components/app-sidebar';
import { AppContent } from '@/components/app-content';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { 
    ShoppingCart, 
    Package, 
    Users, 
    TrendingUp, 
    AlertTriangle,
    Clock,
    CheckCircle
} from 'lucide-react';

interface Stats {
    total_products: number;
    active_products: number;
    out_of_stock: number;
    total_categories: number;
    total_orders: number;
    pending_orders: number;
    today_orders: number;
    today_revenue: number;
    [key: string]: unknown;
}

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
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
    total: number;
    status: string;
    created_at: string;
    items: OrderItem[];
    [key: string]: unknown;
}

interface Product {
    id: number;
    name: string;
    stock: number;
    minimum_stock: number;
    category: {
        name: string;
        icon: string;
    };
    [key: string]: unknown;
}

interface Props {
    stats: Stats;
    recentOrders: Order[];
    lowStockProducts: Product[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, recentOrders, lowStockProducts }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Menunggu', className: 'bg-yellow-500' },
            confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-500' },
            preparing: { label: 'Disiapkan', className: 'bg-orange-500' },
            ready: { label: 'Siap', className: 'bg-purple-500' },
            completed: { label: 'Selesai', className: 'bg-green-500' },
            cancelled: { label: 'Dibatalkan', className: 'bg-red-500' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-500' };
        
        return (
            <Badge className={config.className}>
                {config.label}
            </Badge>
        );
    };

    return (
        <AppShell variant="sidebar">
            <Head title="Dashboard Admin - FreshMart" />
            
            <AppSidebar />
            <SidebarInset>
                <AppContent>
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center space-x-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-3xl font-bold">📊 Dashboard Admin</h1>
                                <p className="text-gray-600">Selamat datang di panel administrasi FreshMart</p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_products}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.active_products} aktif
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_orders}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.pending_orders} menunggu
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pesanan Hari Ini</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.today_orders}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Hari ini
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatPrice(stats.today_revenue)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Hari ini
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Orders */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Pesanan Terbaru</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentOrders.map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="font-semibold">{order.order_number}</span>
                                                            {getStatusBadge(order.status)}
                                                        </div>
                                                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-green-600">
                                                            {formatPrice(order.total)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {order.items.length} item
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Belum ada pesanan</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Low Stock Alert */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                                        <span>Stok Menipis</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {lowStockProducts.length > 0 ? (
                                        <div className="space-y-4">
                                            {lowStockProducts.map((product) => (
                                                <div key={product.id} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                    <div className="text-2xl">
                                                        {product.category.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">{product.name}</h3>
                                                        <p className="text-sm text-gray-600">{product.category.name}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm">
                                                            <span className="font-semibold text-orange-600">{product.stock}</span>
                                                            <span className="text-gray-500"> / {product.minimum_stock}</span>
                                                        </p>
                                                        <Badge className="bg-orange-500">
                                                            Stok Rendah
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                                            <p>Semua produk stoknya aman</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>⚡ Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <a 
                                        href="/admin/products/create"
                                        className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                                    >
                                        <Package className="w-8 h-8 text-blue-600 mb-2" />
                                        <span className="text-sm font-medium">Tambah Produk</span>
                                    </a>
                                    <a 
                                        href="/admin/categories/create"
                                        className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                                    >
                                        <Users className="w-8 h-8 text-green-600 mb-2" />
                                        <span className="text-sm font-medium">Tambah Kategori</span>
                                    </a>
                                    <a 
                                        href="/admin/orders"
                                        className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                                    >
                                        <ShoppingCart className="w-8 h-8 text-purple-600 mb-2" />
                                        <span className="text-sm font-medium">Kelola Pesanan</span>
                                    </a>
                                    <a 
                                        href="/admin/products"
                                        className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
                                    >
                                        <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
                                        <span className="text-sm font-medium">Kelola Produk</span>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </AppContent>
            </SidebarInset>
        </AppShell>
    );
}