import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from 'src/app/services/categories.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent]
})
export class NewCategoryComponent {

  form: FormGroup;
  categoriesService = inject(CategoriesService);
  router = inject(Router);

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }

  async onSubmit() {
    if(this.form.status === "INVALID"){
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 5000,
      });
      return;
    }

    const response = await this.categoriesService.create(this.form.value);
    if(!response.error){
      this.router.navigate(['/admin/categories']);
    }
  }
}
