import { Component, SimpleChanges, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../../ui/menu-store/menu-store.component';
import { ProductsListStoreComponent } from '../../products/products-list-store/products-list-store.component';

@Component({
  selector: 'app-detail-category-store',
  templateUrl: './detail-category-store.component.html',
  styleUrls: ['./detail-category-store.component.css'],
  standalone: true,
  imports: [CommonModule, MenuStoreComponent, ProductsListStoreComponent]
})
export class DetailCategoryStoreComponent {
  selectedCategory = null;
  numberProducts = null;

  activatedRoute = inject(ActivatedRoute)

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.selectedCategory = params['categoryId'];
    })
  }
}
