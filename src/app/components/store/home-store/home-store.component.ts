import { Component } from '@angular/core';
import { MenuStoreComponent } from '../ui/menu-store/menu-store.component';
import { ProductsListStoreComponent } from '../products/products-list-store/products-list-store.component';

@Component({
  selector: 'app-home-store',
  templateUrl: './home-store.component.html',
  styleUrls: ['./home-store.component.css'],
  standalone: true,
  imports: [MenuStoreComponent, ProductsListStoreComponent]
})
export class HomeStoreComponent {
  selectedCategory = null;
  numberProducts = 12;
}
