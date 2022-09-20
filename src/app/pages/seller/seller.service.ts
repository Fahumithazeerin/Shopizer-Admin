import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../shared/services/crud.service';
import { Seller } from './seller';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private httpClient:HttpClient, private crudService: CrudService,) { }

  // registerSeller(seller: Seller):Observable<Object>
  // {
  //     return this.httpClient.post('http://localhost:8080/api/v1/seller', seller);
  // }
  registerSeller(seller: Seller): Observable<Object> {
    return this.httpClient.post('http://localhost:8080/api/v1/private/seller', seller);
  }

  // getSellerList(): Observable<Seller[]>{
  //   return this.httpClient.get<Seller[]>('http://localhost:8080/api/v1/seller/list');
  // }
  getStore(code): Observable<any> {
    return this.crudService.get(`/v1/seller/${code}`);
  }
  checkIfStoreExists(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/seller/unique`, params);
  }
  deleteStore(sellerCode: any): Observable<any> {
    return this.crudService.delete(`/v1/private/seller/${ sellerCode }`);
  }

  updateStore(seller: any): Observable<any> {
    return this.crudService.put(`/v1/private/seller/${ seller.code }`, seller);
  }
  getListOfStores(params): Observable<any> {
    return this.crudService.get(`/v1/private/seller/list`, params);
  }

}