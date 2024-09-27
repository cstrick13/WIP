import { Component } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrl: './splashscreen.component.css'
})
export class SplashscreenComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  login() {
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        console.log('User logged in:', userCredential.user);
        // Successfully logged in, the app.component will handle redirecting
      })
      .catch((error) => {
        this.errorMessage = 'Login failed: ' + error.message;
        console.error('Login error:', error);
      });
  }
  googleSignIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(result => {
        console.log('Google user logged in:', result.user.email);  // Log user email to confirm Google login
        // Perform any additional logic after login, such as navigation
      })
      .catch(error => {
        this.errorMessage = 'Google Sign-In failed: ' + error.message;
        console.error('Error during Google Sign-In:', error);
      });
  }
}
