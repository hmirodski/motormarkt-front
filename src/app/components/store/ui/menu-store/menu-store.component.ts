import { Component, inject, signal, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-menu-store',
  templateUrl: './menu-store.component.html',
  styleUrls: ['./menu-store.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class MenuStoreComponent implements OnInit{
  sidebarActive = false;
  overlayVisible = false;
  categoriesVisible: boolean = false;
  router = inject(Router);

  arrCategories = signal<any[]>([])
  categoriesService = inject(CategoriesService)
  categories: any[] = [];

  formSearch: FormGroup;

  login = signal<any>(false)
  user_id = signal<any>('')

  constructor(private toastr: ToastrService){
    this.formSearch = new FormGroup({
      search: new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {

    this.categories = await this.categoriesService.getAll();
    this.arrCategories.set(this.categories);

    const login = localStorage.getItem('token_store');
    const user_id = localStorage.getItem('user_id_store');
    if(login && user_id){
      this.login.set(true)
      this.user_id.set(user_id)
    }
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
    this.overlayVisible = this.sidebarActive;
    console.log("it's working!");
  }

  closeSidebar() {
    this.sidebarActive = false;
    this.overlayVisible = false;
  }

  displayCategories() {
    this.categoriesVisible = !this.categoriesVisible;
  }

  async onSubmit() {
    if(this.formSearch.status === "INVALID"){
      this.toastr.error('Debes introducir un nombre de producto', 'Error', {
        timeOut: 3000,
      });
      return;
    }
    
    this.router.navigate(['/products/search', this.formSearch.value.search]);
  }


}
