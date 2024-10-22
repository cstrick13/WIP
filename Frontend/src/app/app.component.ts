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
    const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    // Code is meant to prevent the split second reload for authstate change uder login is saved i
    if (isLoggedIn) {
    // User is logged in
    console.log('User is logged in from local storage.');
    this.showSplashScreen = false; // Skip splash screen
    
    } else {
    // User is not logged in
    console.log('User is not logged in, showing splash screen.');
    this.showSplashScreen = true; // Show splash screen
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        console.log('User is logged in:', user);
        this.showSplashScreen = false;
      } else {
        // User is not logged in
        console.log('User is not logged in, showing splash screen.');
        this.showSplashScreen = true; // Show splash screen
      }
    });
  }
  
}
