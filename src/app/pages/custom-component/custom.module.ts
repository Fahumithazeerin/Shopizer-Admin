import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { storeAutoCompleteComponent } from './store-autocomplete/store-autocomplete';
import { sellerAutoCompleteComponent } from './seller-autocomplete/seller-autocomplete';

@NgModule({
  declarations: [
    storeAutoCompleteComponent,
    sellerAutoCompleteComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [storeAutoCompleteComponent,sellerAutoCompleteComponent]
})
export class CustomModule { }
