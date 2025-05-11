import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ImagesProductService } from 'src/app/services/images-product.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';


@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent]
})
export class NewProductComponent {

  form: FormGroup;
  productsService = inject(ProductsService);
  router = inject(Router);
  arrCategories = signal<any[]>([])
  categoriesService = inject(CategoriesService)
  imagesProductService = inject(ImagesProductService);

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      reference: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      price: new FormControl(1),
      quantity: new FormControl(0),
      category: new FormControl(1, Validators.required),
      images: new FormControl()
    });
  }

  async ngOnInit() {
    const categories = await this.categoriesService.getAll();
    this.arrCategories.set(categories);
  }

  async onSubmit() {
    console.log(this.form.value);
    
    this.form.value.category = {
      id: parseInt(this.form.value.category)
    }
    
    if(this.form.status === "INVALID"){
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 5000,
      });
      return;
    }

    const response = await this.productsService.create(this.form.value);
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
}
