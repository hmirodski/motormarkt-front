import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, MenuComponent]
})
export class CategoriesListComponent {

  arrCategories = signal<any[]>([])
  categoriesService = inject(CategoriesService)
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  categories: any[] = [];

  async ngOnInit() {
    this.categories = await this.categoriesService.getAll();
    this.categories = this.categories.reverse();

    this.totalItems = this.categories.length;
    this.loadCategoriesPage();
  }

  private loadCategoriesPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.arrCategories.set(this.categories.slice(startIndex, endIndex));
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCategoriesPage();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadCategoriesPage();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  async onClickDelete(categoryId: string){
    const response = await this.categoriesService.deleteById(categoryId);
    if(!response.error){
      this.currentPage = 1;
      this.categories = await this.categoriesService.getAll();
      this.totalItems = this.categories.length;
      this.loadCategoriesPage();
    }
  }
}
