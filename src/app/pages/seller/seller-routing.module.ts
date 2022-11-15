import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { SellerDetailEditComponent } from './seller-detail-edit/seller-detail-edit.component';
import { SellerListComponent } from './seller-list/seller-list.component';
import { SellerComponent } from './seller.component';
import { ProductsListComponent } from './seller-products/products-list/products-list.component';
import { ProductCreationComponent } from './seller-products/product-creation/product-creation.component';
import { ProductOrderListComponent } from './order-management/order-management.component';

// import { ProductCreationComponent } from '../product-creation/product-creation.component';
// import { ProductsListComponent } from '../products-list/products-list.component';
// import { ProductDetailsComponent } from './seller-products/product-details/product-details.component';
// import { ProductToCategoryComponent } from './seller-products/product-to-category/product-to-category.component';
// import { ProductsImagesComponent } from './seller-products/products-images/products-images.component';
// import { ProductDiscountComponent } from './seller-products/product-discount/product-discount.component';
// import { ProductOrderingComponent } from './seller-products/product-ordering/product-ordering.component';
// import { ProductAttributesComponent } from './seller-products/attribute/product-attributes/product-attributes.component';
// import { ProductProperties } from './seller-products/property/list/product-property.component';

const routes: Routes = [
  {
    path: '', component: SellerComponent, children: [
      {
        path: '',
        redirectTo: 'register',
        pathMatch: 'full',
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'list',
        component: SellerListComponent,
      },
      {
        path: 'detail-edit/:code',
        component: SellerDetailEditComponent,
      },
      // {
      //   path: 'seller-products/create-product',
      //   // canDeactivate: [ExitGuard],
      //   component: ProductCreationComponent,
      // },
      // {
      //   path: 'seller-products/products-list',
      //   // canDeactivate: [ExitGuard],
      //   component: ProductsListComponent,
      // },
      



      {
        path: 'seller-products',
        loadChildren: 'app/pages/seller/seller-products/seller-products.module#SellerProductsModule'
      },
      {
        path: 'order-list',
        component: ProductOrderListComponent,
      },
      // {
      //   path: 'products',
      //   loadChildren: 'app/pages/catalogue/products/products.module#ProductsModule'
      // },
      // {
      //   path: '**',
      //   component: NotFoundComponent
      // }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
