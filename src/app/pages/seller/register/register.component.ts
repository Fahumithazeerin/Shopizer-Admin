import { compileDeclarePipeFromMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { format } from 'path';
import { Seller } from '../seller';
import { SellerService } from '../seller.service';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  seller:Seller = new Seller();
  constructor(private sellerService: SellerService) { }

  ngOnInit(): void {
  }

  sellerRegister(){
    console.log(this.seller);
    this.sellerService.registerSeller(this.seller).subscribe(data=> alert("Register Success"))
    this.clearForm(); 

}
clearForm()
{
  this.seller.name=null;
  this.seller.emailAddress=null;
  this.seller.company=null;
  
}
}
