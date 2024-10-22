import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  private firestore = getFirestore();
  userEmail: string | null = null; // User email
  userId: string | null = null; // User ID
  userProfile: any; // To store the user profile information
  userBio: string = ''; // User bio
  selectedImage: string | null = null; // To store the Base64 string of the selected profile image
  selectedBannerImage: string | null = null; // To store the Base64 string of the selected banner image

  constructor(private router: Router) {}

  ngOnInit(): void {
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
        console.log('User profile:', this.userProfile);
      } else {
        this.userProfile = null;
        console.log('No such document!');
      }
    } catch (e) {
      console.error('Error fetching document:', e);
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImage = (e.target?.result as string).split(',')[1]; // Get Base64 string without the prefix
      };
      reader.readAsDataURL(file); // Read file as Base64 string
    }
  }

  onBannerImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedBannerImage = (e.target?.result as string).split(',')[1]; // Get Base64 string without the prefix
      };
      reader.readAsDataURL(file); // Read file as Base64 string
    }
  }

  async onSubmit() {
    // Check if any of the fields are empty
    if (!this.userBio.trim() || !this.selectedImage || !this.selectedBannerImage) {
      // Show an alert using SweetAlert
      await Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: 'Please fill out all fields before updating your profile.',
      });
      return; // Exit the method if any field is empty
    }

    if (this.userId) {
      // Update the user's profile with bio and images as Base64
      await setDoc(doc(this.firestore, 'users', this.userId), {
        bio: this.userBio,
        profilePicture: this.selectedImage, // Store Base64 string for profile picture
        bannerImage: this.selectedBannerImage // Store Base64 string for banner image
      }, { merge: true }); // Merge to avoid overwriting existing data

      console.log('Profile updated successfully:', { bio: this.userBio, profilePicture: this.selectedImage, bannerImage: this.selectedBannerImage });

      // Show a success alert using SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully!',
      });

      // Optionally, you can fetch the updated user profile after submission
      await this.getUserProfile(this.userId);
    }
  }
}
