import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StatesService } from 'src/app/services/states.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';


@Component({
  selector: 'app-edit-state',
  templateUrl: './edit-state.component.html',
  styleUrls: ['./edit-state.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MenuComponent]
})
export class EditStateComponent {
  
  form: FormGroup;
  statesService = inject(StatesService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  stateId = signal('');

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      color: new FormControl('')
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const stateId = params['stateId'];
      this.stateId.set(stateId);
      const state = await this.statesService.getById(stateId);
      
      // Rellenar formulario
      delete state.data.id;
      delete state.data.created_at;
      delete state.data.updated_at;

      this.form.setValue(state.data);
    })
  }

  async onSubmit() {
    if(this.form.status === "INVALID"){
      this.toastr.error('Revisa el formulario', 'Error', {
        timeOut: 5000,
      });
      return;
    }   

    const response = await this.statesService.update( this.stateId() ,this.form.value);
    if(!response.error){
      this.router.navigate(['/admin/states']);
    }
  }
}
