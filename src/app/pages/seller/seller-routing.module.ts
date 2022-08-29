import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
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
        path: '**',
        component: NotFoundComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
