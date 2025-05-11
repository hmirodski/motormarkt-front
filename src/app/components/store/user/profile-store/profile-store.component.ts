import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../../ui/menu-store/menu-store.component';

@Component({
  selector: 'app-profile-store',
  templateUrl: './profile-store.component.html',
  styleUrls: ['./profile-store.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuStoreComponent]
})
export class ProfileStoreComponent {
  activatedRoute = inject(ActivatedRoute)
  usersService = inject(UsersService)
  router = inject(Router);
  form: FormGroup;
  user = signal<any>({});
  userId = signal<any>('');

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
      
      try{
        const user = await this.usersService.getById(params['userId']);        
        const token_store = localStorage.getItem('token_store');

        if((token_store && user.data.password != token_store) || !user){
          this.router.navigate(['/404']);
        }

        this.user.set(user.data);
        this.userId.set(params['userId']);

        // Rellenar formulario
        delete user.data.id;
        user.data.password = "";
        delete user.data.createdAt;
        delete user.data.updatedAt;
  
        this.form.setValue(user.data);
      
      }catch (error) {
        this.router.navigate(['/404']);
      }      
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
    
    const response = await this.usersService.update( this.userId(),this.form.value);
    if(!response.error){
      this.toastr.success('Actualizado correctamente', '', {
        timeOut: 3000,
      });

      
      //this.router.navigate(['/admin/users']);
    }

    
  }

  onClickLogout(){
    localStorage.removeItem("cart");
    localStorage.removeItem('token_store');
    localStorage.removeItem('user_id_store');
    this.router.navigate(['/user/login']);
  }
}
