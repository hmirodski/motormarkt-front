import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../ui/menu-store/menu-store.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  standalone: true,
  imports: [CommonModule, MenuStoreComponent]
})
export class NotFoundComponent {

}
