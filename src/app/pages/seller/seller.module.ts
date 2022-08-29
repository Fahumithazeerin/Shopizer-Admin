import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    SellerComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule
    
  ]
})
export class SellerModule { }
