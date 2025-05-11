import { Component, inject, signal } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { StatesOrderService } from 'src/app/services/states-order.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../ui/menu/menu.component';


@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, MenuComponent]
})
export class OrdersListComponent {
  arrOrders = signal<any[]>([])
  ordersService = inject(OrdersService)
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  orders: any[] = [];
  statesOrderService = inject(StatesOrderService)


  async ngOnInit() {
    this.orders = await this.ordersService.getAll();
    this.orders.forEach(async (element, index) => {
      const states = await this.statesOrderService.getByOrderId(element.id);
      element.current_state = states[states.length - 1].state;        
    });  
    this.orders = this.orders.reverse();
    
    this.totalItems = this.orders.length;
    this.loadOrdersPage();
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

}
