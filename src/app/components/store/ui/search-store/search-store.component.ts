import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../menu-store/menu-store.component';
import { ProductsListStoreComponent } from '../../products/products-list-store/products-list-store.component';

@Component({
  selector: 'app-search-store',
  templateUrl: './search-store.component.html',
  styleUrls: ['./search-store.component.css'],
  standalone: true,
  imports: [CommonModule, MenuStoreComponent, ProductsListStoreComponent]
})
export class SearchStoreComponent {
  selectedCategory = null;
  numberProducts = null;
  searchProduct = null;

  activatedRoute = inject(ActivatedRoute)

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.searchProduct = params['value'];
    })
  }
}
