import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StatesService } from 'src/app/services/states.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-new-state',
  templateUrl: './new-state.component.html',
  styleUrls: ['./new-state.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuComponent]
})
export class NewStateComponent {

  form: FormGroup;
  statesService = inject(StatesService);
  router = inject(Router);

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      color: new FormControl('')
    });
  }

  async onSubmit() {
    if(this.form.status === "INVALID"){
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 5000,
      });
      return;
    }

    const response = await this.statesService.create(this.form.value);
    if(!response.error){
      this.router.navigate(['/admin/states']);
    }
  }
}
