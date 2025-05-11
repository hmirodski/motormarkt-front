import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { OrdersService } from 'src/app/services/orders.service';
import { StatesOrderService } from 'src/app/services/states-order.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, MenuComponent]
})
export class DetailUserComponent {

  activatedRoute = inject(ActivatedRoute)
  usersService = inject(UsersService)
  router = inject(Router);

  user = signal<any>({});
  ordersService = inject(OrdersService)
  statesOrderService = inject(StatesOrderService)
  orders: any[] = [];
  arrOrders = signal<any[]>([])
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const user = await this.usersService.getById(params['userId']);
      this.user.set(user.data);

      this.orders = await this.ordersService.getByUser(params['userId']);
      this.orders.forEach(async (element, index) => {
        const states = await this.statesOrderService.getByOrderId(element.id);
        element.current_state = states[states.length - 1].state;        
      });      
      this.totalItems = this.orders.length;
      this.loadOrdersPage();      
    })
  }

  private loadOrdersPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.arrOrders.set(this.orders.slice(startIndex, endIndex));
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadOrdersPage();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadOrdersPage();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  async onClickDelete(userId: string){
    const response = await this.usersService.deleteById(userId);
    if(!response.error){
      this.router.navigate(['/admin/users']);
    }
  }

  
}
