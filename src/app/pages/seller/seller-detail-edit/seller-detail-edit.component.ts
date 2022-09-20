// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'ngx-seller-detail-edit',
//   templateUrl: './seller-detail-edit.component.html',
//   styleUrls: ['./seller-detail-edit.component.scss']
// })
// export class SellerDetailEditComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SellerService } from '../seller.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-seller-detail-edit',
  templateUrl: './seller-detail-edit.component.html',
  styleUrls: ['./seller-detail-edit.component.scss']
})
export class SellerDetailEditComponent implements OnInit {
  sellerClass;
  loadingInfo = false;
  selectedItem = '2';
  sidemenuLinks = [
    {
      id: '0',
      title: 'Store branding',
      key: 'COMPONENTS.STORE_BRANDING',
      link: 'store-branding'
    },
    {
      id: '1',
      title: 'Store home page',
      key: 'COMPONENTS.STORE_LANDING',
      link: 'store-landing'
    },
    {
      id: '2',
      title: 'Store details',
      key: 'COMPONENTS.STORE_DETAILS',
      link: 'store'
    }
  ];

  constructor(
    private sellerService: SellerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadingInfo = true;
    const code = this.activatedRoute.snapshot.paramMap.get('code');
    this.sellerService.getStore(code)
      .subscribe(res => {
        this.sellerClass = res;
        this.loadingInfo = false;
      });
    
  }

  route(link) {
    this.router.navigate(['pages/seller/' + link + "/", this.sellerClass.code]);
  }

}

