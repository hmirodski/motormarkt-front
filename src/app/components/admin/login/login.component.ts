import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
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
    try{
      const response = await this.usersService.login(this.form.value);
      localStorage.setItem('token_admin', response.data.password)
      this.router.navigate(['/admin/home']);
    }catch(error){
      this.toastr.error('Usuario incorrecto', 'Error', {
        timeOut: 3000,
      });
      this.form.reset()
    }
  }
}
