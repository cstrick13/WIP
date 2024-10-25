import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  showSplashScreen = true; // Start with splash screen visible
  private firestore = getFirestore();
  userEmail: string | null = null; // User email
  userId: string | null = null; // User ID
  userProfile: any; // To store the user profile information

  constructor(private router: Router) {}

  ngOnInit(): void {
    const auth = getAuth();
    const themeToggleButton = document.getElementById('theme-toggle');

    const htmlElement = document.getElementById('htmlPage');
    const checkbox = document.getElementById('checkbox') as HTMLInputElement;

    checkbox?.addEventListener("change", () => {
      if (checkbox.checked) {
        // toggle dark mode on checkbox change
        htmlElement?.setAttribute('data-bs-theme', 'dark');
      }
      else {
        htmlElement?.setAttribute('data-bs-theme', 'light');
      }
    });

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userEmail = user.email; // Set the user's email
        this.userId = user.uid; // Get the user's ID
        await this.getUserProfile(this.userId); // Fetch user profile from Firestore
      } else {
        this.userEmail = null; // Reset if logged out
        this.userId = null; // Reset user ID
        this.userProfile = null; // Reset username
      }
    });
  }
  async getUserProfile(uid: string) {
    try {
      const docRef = doc(this.firestore, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.userProfile = docSnap.data();
        console.log('User profile:', this.userProfile.name);
      } else {
        this.userProfile = null;
        console.log('No such document!');
      }
    } catch (e) {
      console.error('Error fetching document:', e);
    }
  }

  changeTheme() {
    const htmlElement = document.getElementById('htmlPage');

    if (htmlElement?.getAttribute('data-bs-theme') === 'dark') {
      htmlElement?.setAttribute('data-bs-theme', 'light');
    }
    else {
      htmlElement?.setAttribute('data-bs-theme', 'dark');
    }
  }
  
  createPost() {
    // Logic to create a post
    console.log('Post button clicked');
  }

  logout(): void {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('User logged out');
      this.router.navigate(['/splash']); // Navigate back to splash screen or login
      localStorage.setItem('isUserLoggedIn', 'false'); // Clear login state
      console.log('User is not logged in, showing splash screen.');
      this.showSplashScreen = true; // Show splash screen
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  }
}
