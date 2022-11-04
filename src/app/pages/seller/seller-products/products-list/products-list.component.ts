// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'ngx-products-list',
//   templateUrl: './products-list.component.html',
//   styleUrls: ['./products-list.component.scss']
// })
// export class ProductsListComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AvailableButtonComponent } from './available-button.component';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { StoreService } from '../../../store-management/services/store.service';
import { SellerService } from '../../seller.service';
import { UserService } from '../../../shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ListingService } from '../../../shared/services/listing.service';
import { forkJoin } from 'rxjs';
import { Console } from 'console';
import { event } from 'jquery';


@Component({
  selector: 'ngx-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products = [];
  source: LocalDataSource = new LocalDataSource();
  listingService: ListingService;
  loadingList = false;
  loading: boolean = false;
  sellers = [];
  productTypes=[];
  isSuperadmin: boolean;
  isAdmin: boolean;
  selectedStore: String = '';
  // paginator
  perPage = 20;
  currentPage = 1;
  totalCount;
  merchant;

  // server params
  params = this.loadParams();
  settings = {};

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private dialogService: NbDialogService,
    //private storeService: StoreService,
    private sellerService: SellerService,
    private translate: TranslateService,
    private storageService: StorageService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.selectedStore = this.storageService.getSellerId()
    this.isSuperadmin = this.storageService.getUserRoles().isSuperadmin;
    this.isAdmin = this.storageService.getUserRoles().isAdmin;
    this.listingService = new ListingService();
  }

  loadParams() {
    return {
      seller: this.storageService.getSellerId(),
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      origin: "admin", //does not load attributes in listing
      page: 0
    };
  }

  private disabled()
  {
    if(this.isSuperadmin == true)
    {
      return false;
    }
    else{
      return true;
    }
  }

  ngOnInit() {
    this.disabled();
    this.getStore();
    this.getList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    // //const types$ = this.productService.getProductTypes();
    // const sellers$ = this.sellerService.getListOfStores(this.params);
    // console.log(sellers$);
    // // forkJoin([types$])
    // //   .subscribe(([productTypes]) => {
    // //       productTypes.list.forEach((option) => {
    // //       this.productTypes.push({ value: option.code, label: option.code });
    // //     });
    // //   });
    
    });


    //ng2-smart-table server side filter //list in field
    this.source.onChanged().subscribe((change) => {
      if (!this.loadingList) {//listing service
        this.listingService.filterDetect(this.params, change, this.loadList.bind(this), this.resetList.bind(this));
      }
    });
  }

  
  fetchTableData(){
    this.loadingList = true;

    this.productService.getListOfProducts(this.params)
      .subscribe(res => {
        const products = res.products;
        this.totalCount = res.recordsTotal;
        products.forEach(el => {
          el.name = el.description.name;
        });
        this.products = [...products];
        this.source.load(products);
        this.loadingList = false;
      });
    

 }

  /** callback methods for table list*/
  private loadList(newParams: any) {
    this.currentPage = 1; //back to page 1
    this.params = newParams;
    this.fetchTableData();
  }

  private resetList() {
    this.currentPage = 1;//back to page 1
    this.params = this.loadParams();
    this.getList();
  }
  /** */

  getStore() {
    this.productService.getListOfProducts({ code: 'DEFAULT' })
      .subscribe(res => {
        let sellerData = []
        res.data.forEach((seller) => {
          sellerData.push(seller.code);
        });
        this.sellers = sellerData;
      });
  }
  getList() {
    const startFrom = this.currentPage - 1;
    this.params.page = startFrom;
    this.fetchTableData();
    this.setSettings();
  }

  setSettings() {
    this.settings = {
      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        sort: true,
        custom: [
          { name: 'edit', title: '<i class="nb-edit"></i>' },
          { name: 'remove', title: '<i class="nb-trash"></i>' }
        ],
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
          editable: false,
          filter: false
        },
        sku: {
          title: this.translate.instant('PRODUCT.SKU'),
          type: 'string',
          editable: false,
          filter: true
        },
        name: {
          title: this.translate.instant('PRODUCT.PRODUCT_NAME'),
          type: 'html',
          filter: true,
          editable: false
        },
        quantity: {
          title: this.translate.instant('PRODUCT.QTY'),
          type: 'number',
          editable: true,
          filter: false
        },
        available: {
          filter: false,
          title: this.translate.instant('COMMON.AVAILABLE'),
          type: 'custom',
          renderComponent: AvailableButtonComponent,
          defaultValue: false,
          editable: true,
          editor: {
            type: 'checkbox'
          }
        },
        price: {
          title: this.translate.instant('PRODUCT.PRICE'),
          type: 'string',
          editable: true,
          filter: false
        },
        creationDate: {
          title: this.translate.instant('PRODUCT.CREATION_DATE'),
          type: 'string',
          editable: false,
          filter: false
        },
      },
    };
  }

  updateRecord(event) {
    const product = {
      available: event.newData.available,
      price: event.newData.price,
      quantity: event.newData.quantity
    };
    event.confirm.resolve(event.newData);
    this.productService.updateProductFromTable(event.newData.id, product)
      .subscribe(res => {
        event.confirm.resolve(event.newData);
        this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
      }, error => {
        console.log(error.error.message);
      });
  }

  deleteRecord(event) {
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.productService.deleteProduct(event.data.id)
            .subscribe(result => {
              this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_REMOVED'));
              this.getList();
              // event.confirm.resolve();
            });
        } else {}
      });
  }

  choseStore(event) {
    this.params.seller = event;
    this.getList();

  }

  choseSeller(event) {
    this.params.seller = event;
    this.getList();

  }


  // paginator
  changePage(event) {
    switch (event.action) {
      case 'onPage': {
        this.currentPage = event.data;
        break;
      }
      case 'onPrev': {
        this.currentPage--;
        break;
      }
      case 'onNext': {
        this.currentPage++;
        break;
      }
      case 'onFirst': {
        this.currentPage = 1;
        break;
      }
      case 'onLast': {
        this.currentPage = event.data;
        break;
      }
    }
    this.getList();
  }
  route(e) {
    //console.log(e)
    if (e.action == 'remove') {
      this.deleteRecord(e)
    } else {
      this.router.navigate(['pages/catalogue/products/product/' + e.data.id]);
    }
  }
}

