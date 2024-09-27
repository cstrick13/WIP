import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showSplashScreen = true; // Start with splash screen visible

  constructor(private router: Router) {}

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        console.log('User is logged in:', user);
        this.showSplashScreen = false;
        this.router.navigate(['/home']); // Navigate to home if logged in
      } else {
        // User is not logged in
        console.log('User is not logged in, showing splash screen.');
        this.showSplashScreen = true; // Show splash screen
      }
    });
  }
  
}
