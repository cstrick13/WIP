import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showSplashScreen = true; // Start with splash screen visible
  private firestore = getFirestore();
  userEmail: string | null = null; // User email
  userId: string | null = null; // User ID
  userProfile: any; // To store the user profile information
  content:any;
  posts: any[] = []; // Changed to `any[]` to handle flexible post structure
  lastVisiblePost: any = null;
  isLoading = false;

  constructor(private router: Router, private sharedService:SharedService) {}

  ngOnInit(): void {
    this.fetchPosts();
    const auth = getAuth();
    
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
  
  async createPost() {
    const content = this.content.trim();

    if (!content) {
        alert('Please enter some content before posting.');
        return;
    }

    const postData = {
      content: content,
      userid: this.userId,
    };

    await this.sendPostToDjango(postData);
}


  sendPostToDjango(postData: any) {

    const payload = {
      ...postData
    };
    console.log(payload);
    this.sharedService.createPost(payload).subscribe(
      response => {
        console.log('User post sent to Django successfully:', response);
      },
      error => {
        console.error('Error sending post to Django:', error);
      }
    );
  }

  fetchPosts() {
    this.isLoading = true;
  
    this.sharedService.getAllPosts().subscribe(
      (response) => {
        this.posts = response; // Newest posts will be first due to backend ordering
        console.log('Fetched posts in descending order by timestamp:', this.posts);
      },
      (error) => {
        console.error('Error fetching posts:', error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  


}
