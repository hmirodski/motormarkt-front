import { Component, inject } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../../ui/menu-store/menu-store.component';

@Component({
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: ['./register-store.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuStoreComponent]
})
export class RegisterStoreComponent {
  form: FormGroup;

  usersService = inject(UsersService)
  router = inject(Router)

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      address1: new FormControl(''),
      address2: new FormControl(''),
      city: new FormControl(''),
      postcode: new FormControl(''),
      country: new FormControl(''),
      phone: new FormControl(''),
      active: new FormControl(true),
      admin: new FormControl(false),
      client: new FormControl(true)
    })
  }

  async onSubmit(){
    
    try {      
      const user = await this.usersService.create(this.form.value);
      if(!user.error){
        this.toastr.success('Registro completado', '', {
          timeOut: 1000,
        });
        this.router.navigate(['/user/login']);
      }
      
    } catch (error) {
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 3000,
      });
      return;
    }
  }
}
