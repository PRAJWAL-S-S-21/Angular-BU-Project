import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FormConfigService } from './services/form-config.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authservice =  inject(FormConfigService)
  const router=inject(Router);
   if(authservice.isLoggedIn()){
      return true
   }
   
   return false;
};
