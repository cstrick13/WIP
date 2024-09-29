import { CanActivateFn } from '@angular/router';
import { getAuth } from 'firebase/auth';

export const authGuard: CanActivateFn = (route, state) => {
  
  const auth = getAuth();
  const user = auth.currentUser; // Get the current user

  if (user) {
    // User is logged in
    if (route.routeConfig?.path === 'splash') {
      // If trying to access splash while logged in, redirect to home
      return false; // Prevent access
    }
    return true; // Allow access to other routes
  } else {
    // User is not logged in
    if (route.routeConfig?.path === 'splash') {
      return true; // Allow access to splash
    }
    return false; // Redirect to splash for other routes
  }
};
