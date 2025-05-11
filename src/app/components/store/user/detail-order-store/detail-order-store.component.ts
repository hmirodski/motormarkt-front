import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderLinesService } from 'src/app/services/order-lines.service';
import { StatesOrderService } from 'src/app/services/states-order.service';
import { ImagesProductService } from 'src/app/services/images-product.service';
import * as constants from "../../../../../constants";
import { CommonModule, DatePipe } from '@angular/common';
import { MenuStoreComponent } from '../../ui/menu-store/menu-store.component';


@Component({
  selector: 'app-detail-order-store',
  templateUrl: './detail-order-store.component.html',
  styleUrls: ['./detail-order-store.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, MenuStoreComponent]
})
export class DetailOrderStoreComponent {
  activatedRoute = inject(ActivatedRoute)
  usersService = inject(UsersService)
  ordersService = inject(OrdersService)
  orderLinesService = inject(OrderLinesService)
  statesOrderService = inject(StatesOrderService)
  imagesProductService = inject(ImagesProductService)
  router = inject(Router);
  API_URL = signal(constants.API_URL);


  user = signal<any>({});
  order = signal<any>({});
  order_lines = signal<any[]>([]);
  states_order = signal<any[]>([]);

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const user = await this.usersService.getById(params['userId']);
      this.user.set(user.data);

      const order = await this.ordersService.getById(params['orderId']);
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

    })
  }

  onClickLogout(){
    
    localStorage.removeItem("cart");
    localStorage.removeItem('token_store');
    localStorage.removeItem('user_id_store');
    this.router.navigate(['/user/login']);
  }
}
