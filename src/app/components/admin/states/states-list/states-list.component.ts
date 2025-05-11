import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StatesService } from 'src/app/services/states.service';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../ui/menu/menu.component';

@Component({
  selector: 'app-states-list',
  templateUrl: './states-list.component.html',
  styleUrls: ['./states-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, MenuComponent]
})
export class StatesListComponent {

  arrStates = signal<any[]>([])
  statesService = inject(StatesService)
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  states: any[] = [];

  async ngOnInit() {
    this.states = await this.statesService.getAll();
    this.states = this.states.reverse();
    this.totalItems = this.states.length;
    this.loadStatesPage();
  }

  private loadStatesPage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.arrStates.set(this.states.slice(startIndex, endIndex));
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStatesPage();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadStatesPage();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  async onClickDelete(stateId: string){
    const response = await this.statesService.deleteById(stateId);
    if(!response.error){
      this.currentPage = 1;
      this.states = await this.statesService.getAll();
      this.totalItems = this.states.length;
      this.loadStatesPage();
    }
  }
}
