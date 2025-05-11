import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderLinesService } from 'src/app/services/order-lines.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuStoreComponent } from '../../ui/menu-store/menu-store.component';

@Component({
  selector: 'app-cart-list-store',
  templateUrl: './cart-list-store.component.html',
  styleUrls: ['./cart-list-store.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuStoreComponent]
})
export class CartListStoreComponent {
  
  arrCart = signal<any[]>([])
  totalPriceCart = signal<any>(0);
  productsService = inject(ProductsService)
  usersService = inject(UsersService)
  ordersService = inject(OrdersService)
  orderLinesService = inject(OrderLinesService)
  form: FormGroup;
  router = inject(Router)

  login = signal<any>(false)
  user_id = signal<any>('')

  constructor(private toastr: ToastrService){
    this.form = new FormGroup({
      email: new FormControl(),
      name: new FormControl(),
      address1: new FormControl(),
      address2: new FormControl(),
      city: new FormControl(),
      postcode: new FormControl(),
      country: new FormControl(),
      phone: new FormControl(),
      client: new FormControl(false),
      admin: new FormControl(false),
      active: new FormControl(false),
      card_user: new FormControl(''),
      card_number: new FormControl(''),
      card_caducity: new FormControl(''),
      card_CVV: new FormControl(''),
    })
  }

  async ngOnInit() {
    const cartJSON = localStorage.getItem("cart");
    
    if(cartJSON){
      let currentCart: any[] = JSON.parse(cartJSON);
      const total_price = currentCart.reduce((acumulador, elemento) => acumulador + elemento.quantity * elemento.price, 0);
      this.arrCart.set(currentCart);
      this.totalPriceCart.set(total_price);      
    }

    const login = localStorage.getItem('token_store');
    const user_id = localStorage.getItem('user_id_store');
    if(login && user_id){
      this.login.set(true)
      this.user_id.set(user_id)

      const user = await this.usersService.getById(this.user_id()); 
           
      delete user.data.id;
      delete user.data.password;
      delete user.data.createdAt;
      delete user.data.updatedAt;

      user.data.card_user = '';
      user.data.card_number = '';
      user.data.card_caducity = '';
      user.data.card_CVV = '';

      this.form.setValue(user.data);
    }
  }

  async addProductToCart(product: any){
    const cartJSON = localStorage.getItem("cart");
    
    if(cartJSON){

      const productBd = await this.productsService.getById(product.id);      

      let currentCart: any[] = JSON.parse(cartJSON);
      const index = currentCart.findIndex(item => item.id === product.id);
      const newQuantity = currentCart[index].quantity + 1;

      if(productBd.data.quantity - newQuantity < 0){
        this.toastr.error('No hay suficiente stock del producto', 'Error', {
          timeOut: 3000,
        });
        return;
      }
      
      currentCart[index].quantity = newQuantity;

      const total_price = currentCart.reduce((acumulador, elemento) => acumulador + elemento.quantity * elemento.price, 0);
      this.arrCart.set(currentCart);
      this.totalPriceCart.set(total_price);   

      const newCartJSON = JSON.stringify(currentCart);
      localStorage.setItem("cart", newCartJSON);
    }
    
  }

  deleteProductToCart(product: any){
    const cartJSON = localStorage.getItem("cart");
    
    if(cartJSON){
      let currentCart: any[] = JSON.parse(cartJSON);
      const index = currentCart.findIndex(item => item.id === product.id);
      const newQuantity = currentCart[index].quantity - 1;      

      if(newQuantity <= 0){
        currentCart.splice(index, 1);
        const total_price = currentCart.reduce((acumulador, elemento) => acumulador + elemento.quantity * elemento.price, 0);
        this.arrCart.set(currentCart);
        this.totalPriceCart.set(total_price);   
  
        const newCartJSON = JSON.stringify(currentCart);
        localStorage.setItem("cart", newCartJSON);
      }else{
        currentCart[index].quantity = newQuantity;        

        const total_price = currentCart.reduce((acumulador, elemento) => acumulador + elemento.quantity * elemento.price, 0);
        this.arrCart.set(currentCart);
        this.totalPriceCart.set(total_price);   
  
        const newCartJSON = JSON.stringify(currentCart);
        localStorage.setItem("cart", newCartJSON);
      }
      
    }
  }

  clearCart(order = false) {
    const cartJSON = localStorage.removeItem("cart");
    this.arrCart.set([]);
    this.totalPriceCart.set(0);  

    if(!order){
      this.toastr.success('Carrito vaciado', '', {
        timeOut: 3000,
      });
    }
    
  }

  purchase(){
    if(this.arrCart.length === 0){
      this.toastr.error('El carrito está vacío', 'Error', {
        timeOut: 3000,
      });
    }
  }

  async onSubmit(){  

    const total_price = this.arrCart().reduce((acumulador, elemento) => acumulador + elemento.quantity * elemento.price, 0);   


    if(this.arrCart().length === 0){
      this.toastr.error('El carrito está vacío', 'Error', {
        timeOut: 3000,
      });
      return;
    }

    if(!this.form.value.email || !this.form.value.name || !this.form.value.address1 || !this.form.value.city || !this.form.value.postcode || !this.form.value.country || !this.form.value.phone || !this.form.value.card_user || !this.form.value.card_number || !this.form.value.card_caducity || !this.form.value.card_CVV){
      this.toastr.error('Faltan campos requeridos', 'Error', {
        timeOut: 3000,
      });
      return;
    }

    // Si es pedido de invitado, comprobar el usuario que no exista, registrarlo como client: false

    // Pedido de invitado
    let user_id = null;

    if(!this.login()){
      const email = this.form.value.email;
      try{
        const user = await this.usersService.getByEmail(email);
        if(!user.error){
          this.toastr.error('El email ya está en uso, inicia sesión o usa otro email', 'Error', {
            timeOut: 3000,
          });
          return;
        }
      }catch(error){}
       // Crear usuario
       this.form.value.password = this.form.value.email;
       const responseUser = await this.usersService.create(this.form.value);
       user_id = responseUser.data.id;
    }else{
      user_id = this.user_id();
      delete this.form.value.email;
      const responseUser = await this.usersService.update(user_id, this.form.value);
    }
  
    // Crear pedido
    const orderValue = {
      "payment": "credit card",
      "total_price": total_price,
      "user": { "id": user_id  }
    }
    
    const responseOrder = await this.ordersService.create(orderValue);
    const order_id = responseOrder.data.id;
    // Crear lineas de pedido
    this.arrCart().forEach(async elemento => {      
      // creamos linea de pedido
      const orderLineValue = {
        "price_unit": elemento.price,
        "total_price": elemento.price * elemento.quantity,
        "quantity": elemento.quantity,
        "order": { "id": order_id },
        "product": { "id": elemento.id }
      }
      const responseOrderLine = await this.orderLinesService.create(orderLineValue);
    });
    
    this.form.reset();
    this.clearCart(true);

    if(!this.login()){
      this.toastr.success('Pedido realizado', '', {
        timeOut: 6000,
      });
    }else{
      this.router.navigate(['/user', this.user_id(), 'orders']);
    }
    
  }
}
