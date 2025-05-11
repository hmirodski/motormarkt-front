import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { ImagesProductService } from 'src/app/services/images-product.service';
import * as constants from "../../../../../constants";
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../../ui/menu-store/menu-store.component';


@Component({
  selector: 'app-detail-product-store',
  templateUrl: './detail-product-store.component.html',
  styleUrls: ['./detail-product-store.component.css'],
  standalone: true,
  imports: [CommonModule, MenuStoreComponent]
})
export class DetailProductStoreComponent {
  activatedRoute = inject(ActivatedRoute)
  productsService = inject(ProductsService)
  imagesProductService = inject(ImagesProductService)
  router = inject(Router);
  product = signal<any>({});
  arrImagesProduct = signal<any[]>([]);
  API_URL = signal(constants.API_URL);

  constructor(private toastr: ToastrService)
  {}
  
  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const product = await this.productsService.getById(params['productId']);      
      this.product.set(product.data);      

      const images = await this.imagesProductService.getByProductId(params['productId']); 
      if(!images.error)   
        this.arrImagesProduct.set(images.data);
    })
  }

  addCart(product: any) {
    const cartJSON = localStorage.getItem("cart");
    
    if(cartJSON){
      let currentCart: any[] = JSON.parse(cartJSON);

      const index = currentCart.findIndex(item => item.id === product.id);
      if (index !== -1) {
        const newQuantity = currentCart[index].quantity + 1;
        if(product.quantity - newQuantity < 0){
          this.toastr.error('No hay suficiente stock del producto', 'Error', {
            timeOut: 3000,
          });
          return;
        }
        currentCart[index].quantity = newQuantity;
      } else {

        if(product.quantity <= 0){
          this.toastr.error('No hay suficiente stock del producto', 'Error', {
            timeOut: 3000,
          });
          return;
        }

        currentCart.push({
          'id': product.id,
          'reference': product.reference,
          'name': product.name,
          'price': product.price,
          'quantity': 1
        });
      }    
      const newCartJSON = JSON.stringify(currentCart);
      localStorage.setItem("cart", newCartJSON);
    }else{

      if(product.quantity <= 0){
        this.toastr.error('No hay suficiente stock del producto', 'Error', {
          timeOut: 3000,
        });
        return;
      }

      let currentCart: any[] = [];
      currentCart.push({
        'id': product.id,
        'reference': product.reference,
        'name': product.name,
        'price': product.price,
        'quantity': 1
      });
      const newCartJSON = JSON.stringify(currentCart);
      localStorage.setItem("cart", newCartJSON);
    }

    this.toastr.success('Producto añadido al carrito', '', {
      timeOut: 3000,
    });
  }
}
