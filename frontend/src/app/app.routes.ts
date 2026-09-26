import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Customer Website
  {
    path: '',
    loadComponent: () => import('./features/public/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent),
        title: 'Shaddas — Luxury Fashion & Essentials | Order via WhatsApp'
      },
      {
        path: 'shop',
        loadComponent: () => import('./features/public/shop/shop.component').then(m => m.ShopComponent),
        title: 'Shop All Products — Shaddas Ghana'
      },
      {
        path: 'shop/:id',
        loadComponent: () => import('./features/public/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        title: 'Product Details — Shaddas'
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/public/cart/cart.component').then(m => m.CartComponent),
        title: 'Order Cart — Send via WhatsApp'
      }
    ]
  },

  // Owner Authentication
  {
    path: 'owner/login',
    loadComponent: () => import('./features/owner/login/login.component').then(m => m.OwnerLoginComponent),
    title: 'Owner Login — Shaddas'
  },

  // Protected Owner Dashboard
  {
    path: 'owner',
    loadComponent: () => import('./features/owner/owner-layout/owner-layout.component').then(m => m.OwnerLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/owner/dashboard/dashboard.component').then(m => m.OwnerDashboardComponent),
        title: 'Dashboard — Shaddas Owner'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/owner/products/products.component').then(m => m.OwnerProductsComponent),
        title: 'Products — Shaddas Owner'
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/owner/categories/categories.component').then(m => m.OwnerCategoriesComponent),
        title: 'Categories — Shaddas Owner'
      },
      {
        path: 'website',
        loadComponent: () => import('./features/owner/website/website.component').then(m => m.OwnerWebsiteComponent),
        title: 'Website CMS — Shaddas Owner'
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/owner/settings/settings.component').then(m => m.OwnerSettingsComponent),
        title: 'Settings — Shaddas Owner'
      }
    ]
  },

  // Catch-all redirect
  {
    path: '**',
    redirectTo: ''
  }
];
