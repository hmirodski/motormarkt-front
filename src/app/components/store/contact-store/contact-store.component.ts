import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { EmailsService } from 'src/app/services/emails.service';
import * as constants from "../../../../constants";
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../ui/menu-store/menu-store.component';


@Component({
  selector: 'app-contact-store',
  templateUrl: './contact-store.component.html',
  styleUrls: ['./contact-store.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuStoreComponent]
})
export class ContactStoreComponent {
  form: FormGroup;
  router = inject(Router);
  login = signal<any>(false)
  user_id = signal<any>('')
  user = signal<any>({})
  usersService = inject(UsersService);
  emailsService = inject(EmailsService);
  EMAIL = signal(constants.EMAIL);


  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      title: new FormControl(),
      email: new FormControl(),
      message: new FormControl(),
    });
  }

  async ngOnInit() {
    const login = localStorage.getItem('token_store');
    const user_id = localStorage.getItem('user_id_store');
    if(login && user_id){
      const user = await this.usersService.getById(user_id);    
      this.form.setValue({
        'title': '',
        'email': user.data.email,
        'message': ''
      })  
      this.user.set(user.data)
      this.login.set(true)
      this.user_id.set(user_id)
    }
    
  }

  async onSubmit() {
    console.log(this.form.value);
    if(!this.form.value.title || !this.form.value.email || !this.form.value.message){
      this.toastr.error('Faltan campos requeridos', 'Error', {
        timeOut: 3000,
      });
      return;
    }

    const formEmail = {
      "to": this.EMAIL(),
      "subject": "Contacto de " + this.form.value.email,
      "text": this.form.value.message
    }

    const response = await this.emailsService.send(formEmail);
    this.form.setValue({
      'title': '',
      'email': this.user().email,
      'message': ''
    })  
    this.toastr.success('Mensaje enviado correctamente', '', {
      timeOut: 3000,
    });
  }
}
