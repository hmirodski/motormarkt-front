import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderLinesService } from 'src/app/services/order-lines.service';
import { ImagesProductService } from 'src/app/services/images-product.service';
import { StatesOrderService } from 'src/app/services/states-order.service';
import * as constants from "../../../../../constants";
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StatesService } from 'src/app/services/states.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';


@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DatePipe, MenuComponent]
})
export class DetailOrderComponent {
  form: FormGroup;

  activatedRoute = inject(ActivatedRoute)
  ordersService = inject(OrdersService)
  orderLinesService = inject(OrderLinesService)
  statesOrderService = inject(StatesOrderService)
  imagesProductService = inject(ImagesProductService)
  statesService = inject(StatesService)
  router = inject(Router);
  API_URL = signal(constants.API_URL);

  order = signal<any>({});
  order_lines = signal<any[]>([]);
  states_order = signal<any[]>([]);
  states = signal<any[]>([]);

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      state: new FormControl()
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const order = await this.ordersService.getById(params['orderId']);
      console.log(order.data);
      
      this.order.set(order.data);

      const order_lines = await this.orderLinesService.getByOrderId(params['orderId']);
      order_lines.forEach(async (element, index) => {
        try{
          const images = await this.imagesProductService.getByProductId(element.product.id);
          element.product.images = images.data;
        }catch(error){
          element.product.images = [];
        }
      }); 
      console.log(order_lines);
      
      this.order_lines.set(order_lines);
  
      const states_order = await this.statesOrderService.getByOrderId(params['orderId']);
      console.log(states_order);
      
      this.states_order.set(states_order.reverse());

      const states = await this.statesService.getAll();
      this.states.set(states);
    })
  }

  async onSubmit() {
    if(!this.form.value.state){
      this.toastr.error('Debes de introducir un estado', 'Error', {
        timeOut: 3000,
      });
      return;
    }

    const current_state = this.states_order()[this.states_order().length - 1].state;
    if(current_state.id == this.form.value.state){
      this.toastr.error('Debes de introducir otro estado', 'Error', {
        timeOut: 3000,
      });
      return;
    }
            
    // Creamos nuevo estado
    const formStateOrder = {
      "order": { "id": this.order().id },
      "state": { "id": parseInt(this.form.value.state) }
    }

    const state_order = await this.statesOrderService.create(formStateOrder);
    if(!state_order.error){
      const states_order = await this.statesOrderService.getByOrderId(this.order().id);
      this.states_order.set(states_order.reverse());

      this.toastr.success('Estado modificado', '', {
        timeOut: 3000,
      });
    }
  }
}
