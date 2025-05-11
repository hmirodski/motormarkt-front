import { Component, Input, inject, signal } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ImagesProductService } from 'src/app/services/images-product.service';
import { CategoriesService } from 'src/app/services/categories.service';
import * as constants from "../../../../../constants";
import { ToastrService } from 'ngx-toastr';
import { CartsService } from 'src/app/services/carts.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-products-list-store',
  templateUrl: './products-list-store.component.html',
  styleUrls: ['./products-list-store.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProductsListStoreComponent {
  @Input() category: any;
  @Input() numberProducts: any;
  @Input() searchProduct: any;

  arrProducts = signal<any[]>([])
  productsService = inject(ProductsService)
  categoriesService = inject(CategoriesService)
  products: any[] = [];

  imagesProductService = inject(ImagesProductService)
  API_URL = signal(constants.API_URL);
  categoryName = signal('');
  notResults = signal('');

  constructor(private toastr: ToastrService, private cartService: CartsService){

  }
  
  async ngOnInit() {    

    if(this.category){
      const products = await this.productsService.getByCategoryId(this.category); 
      if(!products.error)
        this.products = products.data;   
      const category = await this.categoriesService.getById(this.category);      
      this.categoryName.set(category.data.name)
    }else{
      this.products = await this.productsService.getAll();
    }

    if(this.searchProduct && this.products.length > 0){
      this.products = this.products.filter(product => {
        // Comprueba si el campo name incluye la cadena de búsqueda
        return product.name.toLowerCase().includes(this.searchProduct.toLowerCase());
      });      
    }

    if(this.products.length > 0){
      this.products.sort((a, b) => b.id - a.id);

      this.products.forEach(async product => {
        const images = await this.imagesProductService.getByProductId(product.id); 
        if(!images.error)   
          product.images = images.data;
      });
      
      if(this.numberProducts)
        this.arrProducts.set(this.products.slice(0, this.numberProducts)); 
      else
        this.arrProducts.set(this.products);
    }else{
      this.notResults.set("No existen productos")
    }

    
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
