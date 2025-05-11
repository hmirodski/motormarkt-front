import { Component, inject, signal } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, MenuComponent]
})
export class UsersListComponent {

  arrUsers = signal<any[]>([])
  usersService = inject(UsersService)
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  users: any[] = [];

  async ngOnInit() {
    this.users = await this.usersService.getAll();
    this.users = this.users.reverse();

    this.totalItems = this.users.length;
    this.loadUsersPage();
  }

  private loadUsersPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.arrUsers.set(this.users.slice(startIndex, endIndex));
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsersPage();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadUsersPage();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
