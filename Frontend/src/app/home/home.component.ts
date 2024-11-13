import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userEmail: string | null = null;
  userId: string | null = null;
  userProfile: any;
  content: string = '';
  posts: any[] = [];
  selectedFile: string | null = null; // Holds base64-encoded file data
  replyContent: string = ''; // Holds the reply text
  replyPostId: number | null = null;

  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.fetchPosts();
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userEmail = user.email;
        this.userId = user.uid;
        await this.getUserProfile(this.userId);
      } else {
        this.userEmail = null;
        this.userId = null;
        this.userProfile = null;
      }
    });
  }

  async getUserProfile(uid: string) {
    try {
      const docRef = doc(getFirestore(), 'users', uid);
      const docSnap = await getDoc(docRef);
      this.userProfile = docSnap.exists() ? docSnap.data() : null;
    } catch (e) {
      console.error('Error fetching user profile:', e);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile = reader.result as string; // Save base64 string
        console.log('File selected and converted to base64:', this.selectedFile);
      };
      reader.readAsDataURL(file); // Convert to base64
    } else {
      this.selectedFile = null; // Clear if no file selected
    }
  }

  async createPost() {
    const content = this.content.trim();
    
    // Check for either content or selected file
    if (!content && !this.selectedFile) {
      alert('Please enter some content or select a file before posting.');
      return;
    }

    const postData = {
      content: content,
      userid: this.userId,
      media: this.selectedFile, // Base64-encoded media if available
    };

    console.log('Post data to be sent:', postData); // Log the post data before sending
    await this.sendPostToDjango(postData);
    this.content = ''; // Reset content field
    this.selectedFile = null; // Clear selected file
  }

  sendPostToDjango(postData: any) {
    this.sharedService.createPost(postData).subscribe(
      response => {
        console.log('Post sent to Django successfully:', response);
        this.fetchPosts(); // Refresh posts after submitting
      },
      error => {
        console.error('Error sending post to Django:', error);
      }
    );
  }
  likePost(postId: number): void {
    this.sharedService.likePost(postId).subscribe(response => {
      // Find the post and update its like count
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.likes = response.likes;
      }
    });
  }

  fetchPosts() {
    this.sharedService.getAllPosts().subscribe(
      (response) => {
        this.posts = response;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
  setReplyPostId(postId: number): void {
    this.replyPostId = postId;
  }
  addReply(): void {
    if (this.replyContent.trim() && this.replyPostId && this.userId) {
      const replyData = {
        post_id: this.replyPostId,
        user_id: this.userId,
        content: this.replyContent.trim()
      };

      this.sharedService.createReply(replyData).subscribe(
        response => {
          console.log('Reply added successfully:', response);
          this.replyContent = ''; // Clear reply content after submission
          this.replyPostId = null; // Clear post ID
        },
        error => {
          console.error('Error adding reply:', error);
        }
      );
    }
  }
}
