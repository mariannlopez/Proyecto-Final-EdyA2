import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/auth';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return new Promise((resolve)=>{
    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      unsubscribe();

      if (user) {
        resolve(true);
      }else{
        resolve(
          router.createUrlTree(['/iniciar-sesion'], {
            queryParams: {returnUrl: state.url}
          })
        )
      }
    })
  })
};
