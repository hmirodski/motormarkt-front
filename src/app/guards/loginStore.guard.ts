import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const loginStoreGuard = () => {

    const router = inject(Router)

    if(localStorage.getItem('token_store')){
        return true;
    }else{
        router.navigate(['/user/login']);
        return false;
    }
}