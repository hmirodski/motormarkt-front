import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const loginAdminGuard = () => {

    const router = inject(Router)

    if(localStorage.getItem('token_admin')){
        return true;
    }else{
        router.navigate(['/admin/login']);
        return false;
    }
}