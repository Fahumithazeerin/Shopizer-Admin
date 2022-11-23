import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';
import { UrlTree, UrlSegment, UrlSegmentGroup, ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import {Location} from '@angular/common';
import { UserService } from '../../../shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private crudService: CrudService,
    private storageService: StorageService,
    private userService: UserService,
  ) {
  }

  getListOfProducts(params): Observable<any> {
    return this.crudService.get(`/v1/seller/products`, params);
  }

  updateProductFromTable(id, product): Observable<any> {
    return this.crudService.patch(`/v1/private/seller/product/${id}`, product);
  }

  updateProduct(id, product): Observable<any> {
    const params = {
      seller: this.storageService.getSeller()
    };
    return this.crudService.put(`/v2/private/seller/product/definition/${id}`, product, { params });
  }

  getProductById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v1/seller/products/${id}`, params);
  }

  getProductDefinitionById(id): Observable<any> {
    const params = {
      lang: '_all',
      seller: this.storageService.getSeller()
    };
    return this.crudService.get(`/v2/private/seller/product/definition/${id}`, params);
  }

  getProductDefinitionByIdAndCode(id,code): Observable<any> {
    const params = {
      lang: '_all',
      seller: code
    };
    return this.crudService.get(`/v2/private/seller/product/definition/${id}`, params);
  }

  createProduct(product): Observable<any> {
    const params = {
      seller: this.storageService.getSeller()
    };
    return this.crudService.post(`/v2/private/seller/product/definition`, product, { params });
  }

  deleteProduct(id): Observable<any> {
    return this.crudService.delete(`/v1/private/seller/product/${id}`);
  }

  getProductTypes(): Observable<any> {
    return this.crudService.get(`/v1/private/seller/products/types`);
  }

  checkProductSku(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/seller/product/unique`,params);
  }

  addProductToCategory(productId, categoryId): Observable<any> {
    return this.crudService.post(`/v1/private/seller/product/${productId}/category/${categoryId}`, {});
  }

  removeProductFromCategory(productId, categoryId): Observable<any> {
    return this.crudService.delete(`/v1/private/seller/product/${productId}/category/${categoryId}`);
  }
  getProductByOrder(): Observable<any> {
    return this.crudService.get(`/v1/seller/products?count=200&lang=en&page=0`)
  }
  getProductOrderById(id): Observable<any> {
    return this.crudService.get(`/v1/seller/products?category=${id}&count=200&lang=en&page=0`)
  }
  getProductIdRoute(router: Router, location: Location) {
    const tree: UrlTree = router.parseUrl(location.path());
    const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    const s: UrlSegment[] = g.segments; // returns 2 segments
    return s[4].path;
  }

}
