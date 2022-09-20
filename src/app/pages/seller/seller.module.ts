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


@NgModule({
  declarations: [
    SellerComponent,
    RegisterComponent,
    SellerListComponent,
    SellerDetailEditComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    NbDialogModule.forChild()
  ]
})
export class SellerModule { }
