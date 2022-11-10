import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})

export class SellerOrderService {
  merchantIdString = 'merchantId';

  constructor(
    private crudService: CrudService
  ) {
  }

  getUser(id: any): Observable<any> {
    return this.crudService.get(`/v1/private/users/` + id);
  }

  getUserProfile(): Observable<any> {
    return this.crudService.get(`/v1/private/user/profile`);
  }

  checkIfUserExist(body): Observable<any> {
    return this.crudService.post(`/v1/private/user/unique`, body);
  }
  
  getsOrders(): Observable<any> {
    //console.log(this.crudService.get(`/v1/private/seller/order-list`));
    return this.crudService.get(`/v1/private/seller/order-list`);
  }

}
