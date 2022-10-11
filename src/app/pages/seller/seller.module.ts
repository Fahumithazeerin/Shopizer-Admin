import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { SellerListComponent } from './seller-list/seller-list.component';
import { NbDialogModule } from '@nebular/theme';
import { SellerDetailEditComponent } from './seller-detail-edit/seller-detail-edit.component';
import { ProductsComponent } from './seller-products/products.component';
import { ProductsListComponent } from './seller-products/products-list/products-list.component';
import { ProductCreationComponent } from './seller-products/product-creation/product-creation.component';
import { CustomModule } from '../custom-component/custom.module';
import { ProductFormComponent } from './seller-products/product-form/product-form.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AvailableButtonComponent } from './seller-products/products-list/available-button.component';


@NgModule({
  declarations: [
    SellerComponent,
    RegisterComponent,
    SellerListComponent,
    SellerDetailEditComponent,
    ProductsComponent,
    ProductFormComponent,
    ProductsListComponent,
    ProductCreationComponent,
    AvailableButtonComponent
  
  ],
  entryComponents: [AvailableButtonComponent],
  imports: [
    CommonModule,
    SellerRoutingModule,
    SharedModule,
    FormsModule,
    CustomModule,
    NgxSummernoteModule,
    HttpClientModule,
    NbDialogModule.forChild()
  ]
})
export class SellerModule { }
