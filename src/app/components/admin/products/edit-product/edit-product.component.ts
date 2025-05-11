import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { ImagesProductService } from 'src/app/services/images-product.service';
import * as constants from "../../../../../constants";
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuComponent]
})
export class EditProductComponent {
  
  productsService = inject(ProductsService);
  categoriesService = inject(CategoriesService)
  imagesProductService = inject(ImagesProductService)

  activatedRoute = inject(ActivatedRoute);
  form: FormGroup;
  router = inject(Router);
  productId = signal('');
  API_URL = signal(constants.API_URL);
  arrCategories = signal<any[]>([]);
  arrImagesProduct = signal<any[]>([]);

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      reference: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      price: new FormControl(),
      quantity: new FormControl(),
      category: new FormControl(),
    });
  }

  async ngOnInit() {
    const categories = await this.categoriesService.getAll();
    this.arrCategories.set(categories);

    this.activatedRoute.params.subscribe(async params => {
      const productId = params['productId'];
      this.productId.set(productId);
      const product = await this.productsService.getById(productId);      

      // Rellenar formulario
      delete product.data.id;
      delete product.data.created_at;
      delete product.data.updated_at;      

      product.data.category = product.data.category ? product.data.category.id : null;

      this.form.setValue(product.data);
    })

    const images = await this.imagesProductService.getByProductId(this.productId());    
    this.arrImagesProduct.set(images.data);
      
  }

  async onSubmit() {

    this.form.value.category = {
      id: parseInt(this.form.value.category)
    }


    if(this.form.status === "INVALID"){
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 5000,
      });
      return;
    }     

    const response = await this.productsService.update( this.productId() ,this.form.value);
    if(!response.error){
      if(this.form.value.images != null){
        const images: FileList = this.form.value.images;
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append('product_id', response.data.id);
          formData.append('image', images[i], images[i].name);

          const responseImage = await this.imagesProductService.create(formData);
        }
      }
      this.router.navigate(['/admin/products']);
    }else{
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 5000,
      });
      return;
    }
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files.length > 0) {
      // Actualiza el valor del campo de archivos en el formulario
      this.form.value.images = files;
    }    
  }

  async onClickDelete(imageId: string) {
    const response = await this.imagesProductService.deleteById(imageId);
    if(!response.error){
      const images = await this.imagesProductService.getByProductId(this.productId());    
      this.arrImagesProduct.set(images.data);
    }
  }
}
