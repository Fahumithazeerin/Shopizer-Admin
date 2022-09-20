import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigService } from '../../shared/services/config.service';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../shared/services/user.service';
import { SecurityService } from '../../shared/services/security.service';
import * as moment from 'moment';
import { SellerService } from '../seller.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { validators } from '../../shared/validation/validators';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() title: string;
  @Input() sellerClass: any;
  @Input() isCancel: string;

  @ViewChild('search', { static: false })
  searchElementRef: ElementRef;
  supportedLanguages = [];
  supportedLanguagesSelected = [];
  supportedCurrency = [];
  weightList = [];
  sizeList = [];
  flag = true;
  provinces = [];
  countries = [];
  form: FormGroup;
  env = environment;
  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    administrative_area_level_2: 'short_name',
    country: 'short_name',
    postal_code: 'short_name',
    sublocality_level_1: 'long_name'
  };
  loading = false;
  showRemoveButton = true;
  isReadonlyCode = false;
  isSuperadmin: boolean;
  retailerArray = [];
  roles: any = {};
  isCodeUnique = true;
  isRetailer = false;
  isRetailerRole = false;
  establishmentType = 'STORE';
  parentRetailer: any;
  seller = '';
  parent: any;
  selectedItem = '1';
  sidemenuLinks = [
    {
      id: '0',
      title: 'Store branding',
      key: 'COMPONENTS.STORE_BRANDING',
      link: 'store-branding'
    },
    {
      id: '1',
      title: 'Store details',
      key: 'COMPONENTS.STORE_DETAILS',
      link: 'store'
    }
  ];
  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private sellerService: SellerService,
    //private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService
  ) {
    this.establishmentType = window.location.hash.indexOf('retailer') !== -1 ? 'RETAILER' : 'STORE';
    this.seller = localStorage.getItem('merchant');
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.loading = true;
    forkJoin(
      this.configService.getListOfCountries(),
      this.configService.getListOfSupportedCurrency(),
      this.configService.getWeightAndSizes(),
      this.sellerService.getListOfStores({ start: 0, length: 1500, retailers: true, store: this.seller }),
      this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant')))
      .subscribe(([countries, currencies, measures, stores, languages]) => {
        this.countries = [...countries];
        this.supportedCurrency = [...currencies];
        this.weightList = [...measures.weights];
        this.sizeList = [...measures.measures];

        this.supportedLanguages = this.configService.getListOfGlobalLanguages();

        // use method for getting only retailer store
        //list of retailers

        this.form.controls['retailer'].disable();
        this.form.controls['retailerStore'].disable();
        if (this.securityService.isSuperAdmin()) {
          this.form.controls['retailer'].enable();
          this.form.controls['retailerStore'].enable();
          this.isRetailerRole = true;
        }

        if (this.roles.isAdminRetail) {
          this.isRetailerRole = true;
        }

        stores.data.forEach(el => {
          if (el.retailer) {
            this.retailerArray.push(el);
          }
          if (el.code === this.seller) {
            this.parent = el;
          }
        });

        //console.log('Retailer size ' + this.retailerArray.length);
        //console.log('Is retailer ' + this.isRetailer);

        this.adjustForm();

        this.loading = false;

      });
    if (this.env.googleApiKey) {
      this.addressAutocomplete();
    }
  }
  

  ngOnInit() {
    this.createForm();
  }

  addressAutocomplete() {
    // load Places Autocomplete
    /**
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.address_components) {
            const obj = {
              street_number: '',
              route: '',
              locality: '',
              administrative_area_level_1: '',
              administrative_area_level_2: '',
              sublocality_level_1: '',
              country: '',
              postal_code: '',
            };
            for (let i = 0; i < place.address_components.length; i++) {
              const addressType = place.address_components[i].types[0];
              if (this.componentForm[addressType]) {
                obj[addressType] = place.address_components[i][this.componentForm[addressType]];
              }
            }
            // rewrite form
            this.form.controls['address'].patchValue({ postalCode: obj.postal_code });
            this.form.controls['address'].patchValue({ country: obj.country });
            this.form.controls['address'].patchValue({ stateProvince: obj.administrative_area_level_1 });
            this.form.controls['address'].patchValue({ city: obj.locality });
            this.form.controls['address'].patchValue({ address: obj.route + ' ' + obj.street_number });
            if (obj.country) {
              this.countryIsSelected(obj.country);
            }
            this.cdr.markForCheck();


          } else {
            // console.log('Choose address from list');
          }
        });
      });
    });
    **/
  }

  private createForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      code: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(validators.alphanumeric)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(validators.emailPattern)]],
      address: this.fb.group({
        searchControl: [''],
        stateProvince: [{ value: '', disabled: false }],
        country: ['', [Validators.required]],
        address: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        city: ['', [Validators.required]]
      }),
      supportedLanguages: [[], [Validators.required]],
      defaultLanguage: ['', [Validators.required]],
      currency: [''],
      currencyFormatNational: [true],
      weight: ['', [Validators.required]],
      dimension: ['', [Validators.required]],
      inBusinessSince: [new Date()],
      useCache: [false],
      retailer: [false],
      retailerStore: '',
    });
    if (this.sellerClass && (!this.sellerClass.id && this.roles.isAdminRetail)) {
      this.form.patchValue({ retailer: false });
      this.form.patchValue({ retailerStore: this.sellerClass });
      this.form.controls['retailer'].disable();
      this.form.controls['retailerStore'].disable();
    }

    //console.log('Creating form 3 ');
    //console.log('Store id' + this.store.id);
    if (this.sellerClass && this.sellerClass.id > 0) {
      this.fillForm();
    }

  }

  adjustForm() {

    if (this.parent != null) {

      if (this.parent.retailer) {
        this.isRetailer = true;
      }

      this.form.patchValue({

        supportedLanguages: this.parent.supportedLanguages,
        defaultLanguage: this.parent.defaultLanguage,
        currency: this.parent.currency,
        currencyFormatNational: this.parent.currencyFormatNational,
        weight: this.parent.weight,
        dimension: this.parent.dimension,
      });


      this.form.controls['address'].patchValue({ country: this.parent.address.country });
      this.countryIsSelected(this.parent.address.country);
      this.form.controls['address'].patchValue({ stateProvince: this.parent.address.stateProvince }, { disabled: false });


      /** can't assign parent to root */
      if (this.roles.isSuperadmin) {
        this.form.controls['retailerStore'].disable();
      }


    }

  }

  fillForm() {

    this.isRetailer = this.sellerClass.retailer;
    //console.log('Fill form store ' + JSON.stringify(this.store));
    if (this.sellerClass.parent && this.sellerClass.parent != null) {
      this.parentRetailer = this.sellerClass.parent;
    }
    //console.log('Parent code ' + this.parentRetailer.code);

    this.sellerClass.supportedLanguages.forEach(lang => {
      this.supportedLanguagesSelected.push(lang.code);
    });
    this.form.patchValue({
      name: this.sellerClass.name,
      code: this.sellerClass.code,
      phone: this.sellerClass.phone,
      email: this.sellerClass.email,
      supportedLanguages: this.sellerClass.supportedLanguages,
      defaultLanguage: this.sellerClass.defaultLanguage,
      currency: this.sellerClass.currency,
      currencyFormatNational: this.sellerClass.currencyFormatNational,
      weight: this.sellerClass.weight,
      dimension: this.sellerClass.dimension,
      inBusinessSince: new Date(this.sellerClass.inBusinessSince),
      useCache: this.sellerClass.useCache,
      retailer: this.isRetailer,
      retailerStore: this.parentRetailer != null ? this.parentRetailer.code : '',
    });
    this.form.controls['address'].patchValue({ searchControl: '' });
    this.form.controls['address'].patchValue({ stateProvince: this.sellerClass.address.stateProvince }, { disabled: false });
    this.form.controls['address'].patchValue({ country: this.sellerClass.country });
    this.form.controls['address'].patchValue({ address: this.sellerClass.address.address });
    this.form.controls['address'].patchValue({ postalCode: this.sellerClass.address.postalCode });
    this.form.controls['address'].patchValue({ city: this.sellerClass.address.city });
    if (this.sellerClass.address.country) {
      this.countryIsSelected(this.sellerClass.address.country);
    }
    this.isReadonlyCode = true;
    this.cdr.markForCheck();

  }

  get name() {
    return this.form.get('name');
  }

  get code() {
    return this.form.get('code');
  }

  get phone() {
    return this.form.get('phone');
  }

  get address() {
    return this.form.get('address').get('address');
  }

  get stateProvince() {
    return this.form.get('address').get('stateProvince');
  }

  get country() {
    return this.form.get('address').get('country');
  }

  get city() {
    return this.form.get('address').get('city');
  }

  get postalCode() {
    return this.form.get('address').get('postalCode');
  }

  get email() {
    return this.form.get('email');
  }

  get inBusinessSince() {
    return this.form.get('inBusinessSince');
  }

  get retailer() {
    return this.form.get('retailer');
  }

  get retailerStore() {
    return this.form.get('retailerStore');
  }

  save() {
    //this.findInvalidControls();
    this.form.controls['address'].patchValue({ country: this.form.value.address.country });
    this.form.controls['address'].patchValue({ stateProvince: this.form.value.address.stateProvince });
    const storeObj = this.form.value;

    //creating a child
    if (this.sellerClass && !this.sellerClass.id) {
      if (!this.roles.isSuperadmin && this.isRetailer) {
        storeObj.retailer = false;
        storeObj.retailerStore = this.seller;
      }
    }

    if (this.sellerClass && (this.sellerClass.id && this.isRetailer)) {
      storeObj.retailer = true;
    }


    storeObj.supportedLanguages = this.supportedLanguagesSelected;

    if (this.sellerClass && this.sellerClass.id) {
      this.sellerService.updateStore(storeObj)
        .subscribe(store => {
          this.toastr.success(this.translate.instant('REGISTER_FORM.SELLER_UPDATED'));
          this.router.navigate(['/']);
        });
    } else {
      this.sellerService.checkIfStoreExists(this.form.value.code)
        .subscribe(res => {
          if (res.exist) {
            this.toastr.success(this.translate.instant('COMMON.CODE_EXISTS'));
          } else {
      
            this.sellerService.registerSeller(storeObj)
              .subscribe(store => {
                this.toastr.success(this.translate.instant('REGISTER_FORM.SELLER_CREATED'));
                this.router.navigate(['/']);
              });
        
          }
        });
    }
  }
        
  remove() {
    this.sellerService.deleteStore(this.sellerClass.code)
      .subscribe(res => {
        this.toastr.success(this.translate.instant('REGISTER_FORM.SELLER_REMOVED'));
        this.router.navigate(['/']);
      });
  }

  countryIsSelected(code) {
    this.provinces = [];
    // this.stateProvince.disable();
    this.configService.getListOfZonesProvincesByCountry(code)
      .subscribe(provinces => {
        this.provinces = [...provinces];
        if (this.provinces.length > 0) {
          // this.stateProvince.enable();
        }
      }, error1 => {
        this.toastr.success(this.translate.instant('REGISTER_FORM.ERROR_STATE_PROVINCE'));
      });
  }

  addSupportedLanguage(languageCode) {
    let newLanguages = this.form.value.supportedLanguages ? [...this.form.value.supportedLanguages] : [];
    // check if element is exist in array
    const index = newLanguages.indexOf(languageCode);
    const selectedIndex = this.supportedLanguagesSelected.indexOf(languageCode);

    // if exist
    if (selectedIndex !== -1) {//already exist, remove element at index
      this.supportedLanguagesSelected.splice(selectedIndex, 1);
    } else {//add language
      this.supportedLanguagesSelected.push(languageCode);
    }

    this.form.patchValue({ 'supportedLanguages': this.supportedLanguagesSelected }); // rewrite form

  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    //console.log('Invalid fields ' + invalid);
  }

  userHasSupportedLanguage(language) {
    if (!this.sellerClass || !this.sellerClass.supportedLanguages)
      return false;
    return this.sellerClass.supportedLanguages.find((l: any) => l.code === language.code);
  }

  showRetailers(event) {
    if (!event.target.checked) {
      this.isRetailer = false;
      this.form.controls['retailerStore'].enable();
    } else {
      this.isRetailer = true;
      this.form.controls['retailerStore'].disable()
    }
    //event ? this.form.controls['retailerStore'].disable() : this.form.controls['retailerStore'].enable();
  }

  checkCode(event) {
    const code = event.target.value;
    this.sellerService.checkIfStoreExists(this.form.value.code)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.sellerClass.code !== code));
      });
  }

  canRemove() {
    return this.sellerClass.id && ((this.roles.isSuperadmin && this.establishmentType === 'RETAILER')
      || (this.roles.isSuperadmin && this.establishmentType === 'SELLER')) && this.sellerClass.code !== 'DEFAULT';
  }
  onClickRoute(link) {
    this.router.navigate(['pages/store-management/' + link + "/", this.sellerClass.code]);
  }
  goToBack() {
    this.router.navigate(['pages/store-management/stores-list']);
  }

}

