import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-progress-page',
  templateUrl: './progress-page.component.html',
  styleUrl: './progress-page.component.css'
})

export class ProgressPageComponent implements OnInit {
  private firestore = getFirestore();
  userEmail: string | null = null; // User email
  userId: string | null = null; // User ID
  userProfile: any; // To store the user profile information
  content:any;

  progressRecords: any[] = [];
  isUpdating = false;
  showNewProgressForm = false;  
  newProgress = { 
    workoutType: '',
    progressGoal: 0,
    currentProgress: 0,
    privateOrPublic: false
  };

  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    const auth = getAuth();

    this.getProgressRecords();


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

  getProgressRecords(): void {
    this.sharedService.getProgress().subscribe(
      (data) => {
        this.progressRecords = data.map((record: any) => ({
          ...record,
          newProgress: record.currentProgress  
        }));
      },
      (error) => {
        console.error('Error fetching progress records:', error);
      }
    );
  }

  getProgressPercentage(currentProgress: number, progressGoal: number): number {
    return progressGoal > 0 ? (currentProgress / progressGoal) * 100 : 0;
  }

  async createProgress() {

    const progressData = {
      workoutType: this.newProgress.workoutType,
      progressGoal: this.newProgress.progressGoal,
      currentProgress: this.newProgress.currentProgress,
      userid: this.userId 
    };
  
    console.log('Sending new progress data:', progressData);  // Log the data being sent

    await this.sendProgressToDjango(progressData);
  }

  sendProgressToDjango(progressData: any) {

    const payload = {
      ...progressData
    };
    console.log(payload);
    this.sharedService.createProgress(payload).subscribe(
      response => {
        console.log('User post sent to Django successfully:', response);
      },
      error => {
        console.error('Error sending post to Django:', error);
      }
    );
  }

  updateProgress(workoutType: string, newProgress: number): void {
    this.isUpdating = true;

    this.sharedService.updateProgress(workoutType, newProgress).subscribe({
      next: (response) => {
        console.log('Progress updated:', response);
        this.getProgressRecords();
      },
      error: (error) => {
        console.error('Error updating progress:', error);
      },
      complete: () => {
        this.isUpdating = false;
      }
    });
  }
}