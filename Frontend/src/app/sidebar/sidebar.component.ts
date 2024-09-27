import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userEmail: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const auth = getAuth();
    // Listen for changes in the authentication state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userEmail = user.email; // Set the user's email
      } else {
        this.userEmail = null; // Reset if logged out
      }
    });
  }

  logout(): void {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('User logged out');
      this.router.navigate(['/splash']); // Navigate back to splash screen or login
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  }
}
