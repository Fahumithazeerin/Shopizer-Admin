import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Seller } from './seller';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private httpClient:HttpClient) { }

  registerSeller(seller: Seller):Observable<Object>
  {
      return this.httpClient.post('http://localhost:8080/api/v1/seller', seller);
  }
}
