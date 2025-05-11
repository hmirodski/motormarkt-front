import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuComponent]
})
export class EditUserComponent {
  
  form: FormGroup;
  usersService = inject(UsersService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  userId = signal('');

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl(),
      address1: new FormControl(''),
      address2: new FormControl(''),
      city: new FormControl(''),
      postcode: new FormControl(''),
      country: new FormControl(''),
      phone: new FormControl(''),
      active: new FormControl(false),
      admin: new FormControl(false),
      client: new FormControl(false)
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const userId = params['userId'];
      this.userId.set(userId);
      const user = await this.usersService.getById(userId);
      
      // Rellenar formulario
      delete user.data.id;
      user.data.password = "";
      delete user.data.createdAt;
      delete user.data.updatedAt;

      this.form.setValue(user.data);
    })
  }

  async onSubmit() {
    if(this.form.status === "INVALID"){
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 5000,
      });
      return;
    }

    if(this.form.value.password.trim() === ''){
        delete this.form.value.password;
    }    

    const response = await this.usersService.update( this.userId() ,this.form.value);
    if(!response.error){
      this.router.navigate(['/admin/users']);
    }
  }
}
