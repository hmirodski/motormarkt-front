import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { ImagesProductService } from 'src/app/services/images-product.service';
import * as constants from "../../../../../constants";
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent]
})
export class DetailProductComponent {

  activatedRoute = inject(ActivatedRoute)
  productsService = inject(ProductsService)
  imagesProductService = inject(ImagesProductService)
  router = inject(Router);
  product = signal<any>({});
  arrImagesProduct = signal<any[]>([]);
  API_URL = signal(constants.API_URL);

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const product = await this.productsService.getById(params['productId']);
      this.product.set(product.data);      

      const images = await this.imagesProductService.getByProductId(params['productId']); 
      if(!images.error)   
        this.arrImagesProduct.set(images.data);
    })
  }

  async onClickDelete(productId: string){
    const response = await this.productsService.deleteById(productId);
    if(!response.error){
      this.router.navigate(['/admin/products']);
    }
  }
}
