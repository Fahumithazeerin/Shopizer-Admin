import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { SellerDetailEditComponent } from './seller-detail-edit/seller-detail-edit.component';
import { SellerListComponent } from './seller-list/seller-list.component';
import { SellerComponent } from './seller.component';

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
      }
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
