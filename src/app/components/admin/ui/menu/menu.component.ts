import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MenuComponent {

  router = inject(Router)
  usersService = inject(UsersService)

  onClickLogout(){
    localStorage.removeItem('token_admin');
    this.router.navigate(['/admin/login']);
  }
}