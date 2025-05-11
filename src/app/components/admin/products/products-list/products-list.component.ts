import { Component, inject, signal } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, DatePipe]
})
export class ProductsListComponent {

  arrProducts = signal<any[]>([])
  productsService = inject(ProductsService)
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  products: any[] = [];

  async ngOnInit() {
    this.products = await this.productsService.getAll();
    this.products = this.products.reverse();
    this.totalItems = this.products.length;
    this.loadProductsPage();
  }

  private loadProductsPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.arrProducts.set(this.products.slice(startIndex, endIndex));
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProductsPage();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadProductsPage();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
