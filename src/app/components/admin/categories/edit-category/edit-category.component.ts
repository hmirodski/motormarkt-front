import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';


@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent]
})
export class EditCategoryComponent {
  
  form: FormGroup;
  categoriesService = inject(CategoriesService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  categoryId = signal('');

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl()
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const categoryId = params['categoryId'];
      this.categoryId.set(categoryId);
      const category = await this.categoriesService.getById(categoryId);
      
      // Rellenar formulario
      delete category.data.id;
      delete category.data.created_at;
      delete category.data.updated_at;

      this.form.setValue(category.data);
    })
  }

  async onSubmit() {
    if(this.form.status === "INVALID"){
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 5000,
      });
      return;
    }   

    const response = await this.categoriesService.update( this.categoryId() ,this.form.value);
    if(!response.error){
      this.router.navigate(['/admin/categories']);
    }
  }
}
