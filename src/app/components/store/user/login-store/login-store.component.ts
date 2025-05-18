import { Component, inject } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../../ui/menu-store/menu-store.component';

@Component({
  selector: 'app-login-store',
  templateUrl: './login-store.component.html',
  styleUrls: ['./login-store.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuStoreComponent]
})
export class LoginStoreComponent {

  form: FormGroup;

  usersService = inject(UsersService)
  router = inject(Router)

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  async onSubmit(){
    localStorage.removeItem("cart");
    try {
      const user = await this.usersService.login_client(this.form.value);
      if(!user.error && user.data){
        // Asegurar que id y password existen antes de guardarlos
        if (user.data.id) {
          localStorage.setItem('user_id_store', user.data.id.toString())
        }
        if (user.data.password) {
          localStorage.setItem('token_store', user.data.password)
        }
        this.router.navigate(['/user', user.data.id]);
      }
      
    } catch (error) {
      this.form.reset();
      this.toastr.error('No existe este cliente', 'Error', {
        timeOut: 3000,
      });
      return;
    }
  }
}
