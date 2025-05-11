import { Routes } from '@angular/router';
import { loginAdminGuard } from './guards/loginAdmin.guard';
import { loginStoreGuard } from './guards/loginStore.guard';

export const routes: Routes = [
  //** PANEL DE ADMINISTRACION  **/
  {
    path: 'admin/home',
    loadComponent: () => import('./components/admin/home/home.component').then(m => m.HomeComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./components/admin/login/login.component').then(m => m.LoginComponent)
  },
  { path: 'admin', redirectTo: 'admin/home', pathMatch: 'full' },
  // Users
  {
    path: 'admin/users',
    loadComponent: () => import('./components/admin/users/users-list/users-list.component').then(m => m.UsersListComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/users/new',
    loadComponent: () => import('./components/admin/users/new-user/new-user.component').then(m => m.NewUserComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/users/:userId',
    loadComponent: () => import('./components/admin/users/detail-user/detail-user.component').then(m => m.DetailUserComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/users/edit/:userId',
    loadComponent: () => import('./components/admin/users/edit-user/edit-user.component').then(m => m.EditUserComponent),
    canActivate: [loginAdminGuard]
  },
  // Categories
  {
    path: 'admin/categories',
    loadComponent: () => import('./components/admin/categories/categories-list/categories-list.component').then(m => m.CategoriesListComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/categories/new',
    loadComponent: () => import('./components/admin/categories/new-category/new-category.component').then(m => m.NewCategoryComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/categories/edit/:categoryId',
    loadComponent: () => import('./components/admin/categories/edit-category/edit-category.component').then(m => m.EditCategoryComponent),
    canActivate: [loginAdminGuard]
  },
  // Products
  {
    path: 'admin/products',
    loadComponent: () => import('./components/admin/products/products-list/products-list.component').then(m => m.ProductsListComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/products/new',
    loadComponent: () => import('./components/admin/products/new-product/new-product.component').then(m => m.NewProductComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/products/:productId',
    loadComponent: () => import('./components/admin/products/detail-product/detail-product.component').then(m => m.DetailProductComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/products/edit/:productId',
    loadComponent: () => import('./components/admin/products/edit-product/edit-product.component').then(m => m.EditProductComponent),
    canActivate: [loginAdminGuard]
  },
  // States
  {
    path: 'admin/states',
    loadComponent: () => import('./components/admin/states/states-list/states-list.component').then(m => m.StatesListComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/states/new',
    loadComponent: () => import('./components/admin/states/new-state/new-state.component').then(m => m.NewStateComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/states/edit/:stateId',
    loadComponent: () => import('./components/admin/states/edit-state/edit-state.component').then(m => m.EditStateComponent),
    canActivate: [loginAdminGuard]
  },
  // Orders
  {
    path: 'admin/orders',
    loadComponent: () => import('./components/admin/orders/orders-list/orders-list.component').then(m => m.OrdersListComponent),
    canActivate: [loginAdminGuard]
  },
  {
    path: 'admin/orders/:orderId',
    loadComponent: () => import('./components/admin/orders/detail-order/detail-order.component').then(m => m.DetailOrderComponent),
    canActivate: [loginAdminGuard]
  },

  //** TIENDA  **/
  {
    path: 'home',
    loadComponent: () => import('./components/store/home-store/home-store.component').then(m => m.HomeStoreComponent)
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '404',
    loadComponent: () => import('./components/store/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/store/contact-store/contact-store.component').then(m => m.ContactStoreComponent)
  },
  // Products
  {
    path: 'products/:productId',
    loadComponent: () => import('./components/store/products/detail-product-store/detail-product-store.component').then(m => m.DetailProductStoreComponent)
  },
  // Categories
  {
    path: 'categories/:categoryId',
    loadComponent: () => import('./components/store/categories/detail-category-store/detail-category-store.component').then(m => m.DetailCategoryStoreComponent)
  },
  // Buscador
  {
    path: 'products/search/:value',
    loadComponent: () => import('./components/store/ui/search-store/search-store.component').then(m => m.SearchStoreComponent)
  },
  // Carrito
  {
    path: 'cart',
    loadComponent: () => import('./components/store/cart/cart-list-store/cart-list-store.component').then(m => m.CartListStoreComponent)
  },
  // Usuario
  {
    path: 'user/login',
    loadComponent: () => import('./components/store/user/login-store/login-store.component').then(m => m.LoginStoreComponent)
  },
  {
    path: 'user/register',
    loadComponent: () => import('./components/store/user/register-store/register-store.component').then(m => m.RegisterStoreComponent)
  },
  {
    path: 'user/:userId',
    loadComponent: () => import('./components/store/user/profile-store/profile-store.component').then(m => m.ProfileStoreComponent),
    canActivate: [loginStoreGuard]
  },
  {
    path: 'user/:userId/orders',
    loadComponent: () => import('./components/store/user/orders-list-store/orders-list-store.component').then(m => m.OrdersListStoreComponent),
    canActivate: [loginStoreGuard]
  },
  {
    path: 'user/:userId/orders/:orderId',
    loadComponent: () => import('./components/store/user/detail-order-store/detail-order-store.component').then(m => m.DetailOrderStoreComponent),
    canActivate: [loginStoreGuard]
  }
];
