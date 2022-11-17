import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation ,Inject} from '@angular/core';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { StorageService } from '../../shared/services/storage.service';
import { StoreService } from '../../store-management/services/store.service';
import { SellerOrderService } from '../../shared/services/seller-order.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
// import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { error } from '@angular/compiler/src/util';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { DOCUMENT } from '@angular/common';

import * as internal from 'stream';

@Component({
  selector: 'ngx-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class ProductOrderListComponent implements OnInit {
  @ViewChild('item', { static: false }) accordion;
  opensource: LocalDataSource = new LocalDataSource(); 
  closedsource: LocalDataSource = new LocalDataSource();
  todayOrders: LocalDataSource = new LocalDataSource();
  pastOrders: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  myDate: Date;
  stores: Array<any> = [];
  selectedStore: String = '';
  // paginator
  perPage = 20;
  currentPage = 1;
  totalCount;
  roles;
  // searchValue: string = '';
  isSuperAdmin: boolean;
  timeoutHandler: any;
  isPast=true;
  params = this.loadParams();

  
  constructor(
    private datePipe: DatePipe,
  @Inject(DOCUMENT) private document: Document,
    private ordersService: SellerOrderService,
    private router: Router,
    // private mScrollbarService: MalihuScrollbarService,
    private translate: TranslateService,
    private storageService: StorageService,
    private storeService: StoreService,
  ) {
    this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    this.getStoreList();
    this.selectedStore = this.storageService.getMerchant()
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {

        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
      });
  }
  ngOnInit() {
    this.getOrderList();
    this.translate.onLangChange.subscribe((lang) => {
      this.getOrderList();
    });
    this.opensource.onChanged().subscribe((change) => {
      if (change.action == 'refresh' || change.action == 'load') {
        clearTimeout(this.timeoutHandler);
      } else {
        var time = 2000;
      }
      if (this.timeoutHandler) {
        clearTimeout(this.timeoutHandler);
      }

      this.timeoutHandler = setTimeout(() => {
        if (change.action == 'filter') {
          change.filter.filters.map((a) => {
            if (a.field == "id") {
              this.params["id"] = a.search;
            } else if (a.field == "billingName") {
              this.params["name"] = a.search;
            } else if (a.field == "billingPhone") {
              this.params["phone"] = a.search;
            } else if (a.field == "billingEmail") {
              this.params["email"] = a.search;
            } else if (a.field == "orderStatus") {
              this.params["status"] = a.search;
            }
          });

          this.getOrderList()
        }
      }, time);

    });
  }
buttons= [
  {class: "fa fa-long-arrow-up", name: "Past Due"},
  {class: "fa fa-long-arrow-down", name: "Due Today"},
]
selectedButton;
toggleSelect(button) {

    if (button == this.selectedButton) {
        this.selectedButton = undefined
    } else {
        this.selectedButton = button
    }
}
//   toggle()
//   {
//         const past =  this.document.getElementById("past");
//         const due = this.document.getElementById("due");
//         console.log(due.innerHTML);
//
//         if(!past.classList.contains("active") && this.isPast){
//             past.classList.add("active");
//             due.classList.remove("active");
//         }
//         else{
//         this.isPast = false
//         }
//        if(!due.classList.contains("active") && !this.isPast){
//             due.classList.add("active");
//             past.classList.remove("active");
//         }else
//         {
//         this.isPast=true;
//         }
//     }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {  
    let index = tabChangeEvent.index;
    this.setSettings(index);
  }
  loadParams() {
    return {
      count: this.perPage,
      page: 0
    };
  }
  getOrderList() {
    this.params.page = this.currentPage;

    this.loadingList = true;
    var myDate = new Date();
    this.ordersService.getsOrders()
      .subscribe(orders => {
        this.loadingList = false;
        if (orders.orders && orders.orders.length !== 0) {
          var all_orders = orders.orders
          var value = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          var openorders = all_orders.filter(a=>!(a.orderStatus === 'CANCELED' || a.orderStatus === 'DELIVERED') )
          var todayorderslist = openorders.filter(a=>(a.datePurchased === formatDate(new Date(), 'yyyy-MM-dd', 'en')))
          var pastorderslist = openorders.filter(a=>(a.datePurchased !== formatDate(new Date(), 'yyyy-MM-dd', 'en')))
          if(todayorderslist && todayorderslist.length !== 0)
            this.todayOrders.load(todayorderslist);
          else
            this.todayOrders.load([])
          if(pastorderslist && pastorderslist.length !== 0)
            this.pastOrders.load(pastorderslist);
          else
            this.pastOrders.load([])
          
          if(openorders && openorders.length !== 0)
            this.opensource.load(openorders);
          else
            this.opensource.load([]);
          var closedorders = all_orders.filter(a=>a.orderStatus === 'CANCELED' || a.orderStatus === 'DELIVERED')
          if(closedorders && closedorders.length !== 0)
            this.closedsource.load(closedorders);
          else
          this.closedsource.load([]);
        } else {
          this.closedsource.load([]);
          this.opensource.load([]);
        }
        this.totalCount = orders.total;
      }, error => {
        
        this.loadingList = false;
        this.opensource.load([]);
      });
    this.setSettings();
  }

  
  setSettings(index = 0) {
    var me = this;
    this.settings = {
      // mode: 'external',
      // hideSubHeader: false,
      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        custom: [
          {
            name: 'view',
            title: '<i class="nb-edit"></i>'
          }
        ],
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
          filterFunction(cell: any, search?: string): boolean {
            return true;
          }
        },
        billingName: {
          title: this.translate.instant('ORDER.CUSTOMER_NAME'),
          type: 'string',
          valuePrepareFunction: (customer, data) => {
            // console.log(data);
            return data.billing.firstName + ' ' + data.billing.lastName;
          },
          filterFunction(cell: any, search?: string): boolean {
            return true;
          }
        },
        billingPhone: {
          title: this.translate.instant('ORDER.CUSTOMER_PHONE'),
          type: 'string',
          valuePrepareFunction: (customer, data) => {
            // console.log(customer)
            return data.billing.phone;
          },
          filterFunction(cell: any, search?: string): boolean {
            return true;
          }
        },
        billingEmail: {
          title: this.translate.instant('ORDER.CUSTOMER_EMAIL'),
          type: 'string',
          valuePrepareFunction: (customer, data) => {
            // console.log(customer)
            return data.billing.email;
          },
          filterFunction(cell: any, search?: string): boolean {
            return true;
          }
        },
        total: {
          title: this.translate.instant('ORDER.TOTAL'),
          type: 'string',
          filter: false,
          valuePrepareFunction: (total) => {
            return total.value;
          }
        },
        datePurchased: {
          title: this.translate.instant('ORDER.ORDER_DATE'),
          type: 'string',
          filter: false,
          // valuePrepareFunction: (date) => {
          //   if (date) {
          //     return new DatePipe('en-GB').transform(date, 'yyyy-MM-dd');
          //   }
          // }
        },
        orderStatus: {
          title: this.translate.instant('ORDER.STATUS'),
          type: 'string',
          filterFunction(cell: any, search?: string): boolean {
            return true;
          },
          filter: {
            type: 'list',
            config: {
              selectText: this.translate.instant('ORDER.SHOWALL'),
              list:  index == 1 ?
              [
                { value: 'DELIVERED', title: this.translate.instant('ORDER.DELIVERED') },
                { value: 'CANCELED', title: this.translate.instant('ORDER.CANCELED') },
            ] :  [
                { value: 'ORDERED', title: this.translate.instant('ORDER.ORDERED') },
                { value: 'PROCESSED', title: this.translate.instant('ORDER.PROCESSED') },
                { value: 'REFUNDED', title: this.translate.instant('ORDER.REFUNDED') },
              ]
             
            }
          }
        }
      },

    };

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
    this.getOrderList()
  }

  onSelectStore(e) {
    this.params["store"] = e.value;
    this.getOrderList();
  }

  route(e) {
    localStorage.setItem('orderID', e.data.id);
    this.router.navigate(['pages/seller/order-list']);
  }

}
