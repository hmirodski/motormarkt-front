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
    try {
      // Obtener todas las órdenes
      const orders = await this.ordersService.getAll();
      console.log('Ordenes obtenidas:', orders);
      
      // Crear un array de promesas para cargar todos los estados
      const orderPromises = orders.map(async (order) => {
        try {
          console.log(`Cargando estados para orden ${order.id}...`);
          
          // Asegurar que order.id existe y convertirlo a string
          if (order.id !== undefined && order.id !== null) {
            const orderId = String(order.id); // Convertir explícitamente a string
            const states = await this.statesOrderService.getByOrderId(orderId);
            
            // Si hay estados, asignar el último como estado actual
            if (states && states.length > 0) {
              order.current_state = states[states.length - 1].state;
            } else {
              order.current_state = { name: 'Desconocido', color: '#999999' };
            }
          } else {
            console.warn('Orden sin ID válido:', order);
            order.current_state = { name: 'ID Inválido', color: '#FF0000' };
          }
          
          return order;
        } catch (error) {
          console.error(`Error al cargar estados para orden ${order.id}:`, error);
          order.current_state = { name: 'Error', color: '#FF0000' };
          return order;
        }
      });
      
      // Esperar a que todas las promesas se resuelvan
      this.orders = await Promise.all(orderPromises);
      
      // Ordenar las órdenes de más recientes a más antiguas
      this.orders = this.orders.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      console.log('Ordenes procesadas:', this.orders);
      
      // Actualizar la paginación
      this.totalItems = this.orders.length;
      this.loadOrdersPage();
    } catch (error) {
      console.error('Error al inicializar el componente de órdenes:', error);
      this.orders = [];
      this.totalItems = 0;
      this.loadOrdersPage();
    }
  }

  private loadOrdersPage() {
    try {
      // Calcular los índices de inicio y fin para la página actual
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = Math.min(startIndex + this.itemsPerPage, this.orders.length);
      
      // Verificar que los índices son válidos
      if (startIndex < 0 || startIndex >= this.orders.length) {
        console.warn(`Índice de inicio ${startIndex} fuera de rango (0-${this.orders.length-1})`);
        this.arrOrders.set([]);
        return;
      }
      
      // Extraer los elementos para la página actual
      const pageItems = this.orders.slice(startIndex, endIndex);
      console.log(`Mostrando órdenes ${startIndex+1}-${endIndex} de ${this.orders.length}`);
      
      // Actualizar el signal con los elementos de la página
      this.arrOrders.set(pageItems);
    } catch (error) {
      console.error('Error al cargar la página de órdenes:', error);
      this.arrOrders.set([]);
    }
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
