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

      // Manejo seguro de la categoría
      let categoryId = null;
      if (product.data.category) {
        if (typeof product.data.category === 'object' && product.data.category !== null && 'id' in product.data.category) {
          categoryId = product.data.category.id;
        } else if (typeof product.data.category === 'number') {
          categoryId = product.data.category;
        }
      }
      product.data.category = categoryId ?? undefined;

      this.form.setValue(product.data);
    })

    const images = await this.imagesProductService.getByProductId(this.productId());    
    this.arrImagesProduct.set(images.data);
      
  }

  async onSubmit() {
    try {
      // Preparar los datos del producto
      if (this.form.value.category) {
        this.form.value.category = {
          id: parseInt(this.form.value.category)
        };
      }

      if (this.form.status === "INVALID") {
        this.toastr.error('Revisa el formulario', 'Error', {
          timeOut: 5000,
        });
        return;
      }

      // Actualizar el producto
      const response = await this.productsService.update(this.productId(), this.form.value);
      
      if (!response.error) {
        // Si hay imágenes para subir
        if (this.form.value.images && this.form.value.images.length > 0) {
          const images: FileList = this.form.value.images;
          
          // Subir cada imagen
          for (let i = 0; i < images.length; i++) {
            try {
              const formData = new FormData();
              formData.append('product_id', this.productId());
              formData.append('image', images[i]);
              
              // Subir la imagen y esperar la respuesta
              await this.imagesProductService.create(formData);
            } catch (error) {
              console.error('Error al subir la imagen:', error);
              this.toastr.error('Error al subir la imagen ' + (i + 1), 'Error', {
                timeOut: 3000,
              });
            }
          }
        }
        
        this.toastr.success('Producto actualizado correctamente', 'Éxito', {
          timeOut: 3000,
        });
        
        // Recargar las imágenes
        const images = await this.imagesProductService.getByProductId(this.productId());
        this.arrImagesProduct.set(images.data);
      } else {
        this.toastr.error('Error al actualizar el producto', 'Error', {
          timeOut: 5000,
        });
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
      this.toastr.error('Ha ocurrido un error al procesar el formulario', 'Error', {
        timeOut: 5000,
      });
    }
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files.length > 0) {
      // Verificar el tipo de archivo y tamaño
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Verificar el tipo de archivo
        if (!file.type.match('image/(jpeg|jpg|png)')) {
          this.toastr.error('Solo se permiten archivos JPG, JPEG o PNG', 'Error', {
            timeOut: 3000,
          });
          event.target.value = null; // Limpiar el input
          return;
        }
        
        // Verificar el tamaño (1MB = 1048576 bytes)
        if (file.size > 1048576) {
          this.toastr.error('El tamaño máximo de archivo es 1MB', 'Error', {
            timeOut: 3000,
          });
          event.target.value = null; // Limpiar el input
          return;
        }
      }
      
      // Actualiza el valor del campo de archivos en el formulario
      this.form.value.images = files;
      this.toastr.success(`${files.length} imagen(es) seleccionada(s)`, '', {
        timeOut: 2000,
      });
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
