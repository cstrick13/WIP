import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { SharedService } from '../shared.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrl: './splashscreen.component.css'
})
export class SplashscreenComponent {
  private firestore = getFirestore();
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  username: string = '';
  birthday: string = '';
  location: string = '';
  height: number | null = null;
  weight: number | null = null;
  bodyType: string = '';
  workoutFrequency: string = '';
  userid: string = '';
  isUserCreated: boolean = false;
  selectedInterests: string[] = [];

  categorizedInterests: { name: string; interests: string[] }[] = [
    { name: 'Workout Styles', interests: ['Weightlifting', 'Cardio', 'HIIT', 'Yoga', 'Pilates', 'CrossFit'] },
    { name: 'Nutrition & Diet', interests: ['Meal Prep', 'Healthy Eating', 'Supplements', 'Vegan', 'Keto', 'Paleo'] },
    { name: 'Fitness Goals', interests: ['Weight Loss', 'Muscle Gain', 'Endurance Training', 'Flexibility', 'Overall Health', 'Performance'] },
    { name: 'Social Activities', interests: ['Group Workouts', 'Fitness Challenges', 'Sports Events', 'Community Runs', 'Dance Classes', 'Outdoor Adventures'] },
    { name: 'Support & Motivation', interests: ['Workout Buddies', 'Motivational Quotes', 'Fitness Coaches', 'Online Communities', 'Accountability Partners', 'Success Stories'] },
    { name: 'Gym Facilities', interests: ['Gym Types', 'Home Gym', 'Fitness Studios', 'Outdoor Gyms', 'Public Parks', 'Sports Centers'] },
    { name: 'Equipment Preferences', interests: ['Cardio Machines', 'Free Weights', 'Resistance Bands', 'Kettlebells', 'Bodyweight Exercises', 'Mobility Tools'] },
    { name: 'Wellness Practices', interests: ['Meditation', 'Mindfulness', 'Self-Care', 'Stress Management', 'Sleep Hygiene', 'Recovery Techniques'] },
    { name: 'Fitness Education', interests: ['Workshops', 'Webinars', 'Nutrition Classes', 'Fitness Certifications', 'Health Coaching', 'Personal Development'] }
  ];

  constructor(private router: Router, private sharedService: SharedService) {}

  onInterestChange(event: any, interest: string) {
    if (event.target.checked) {
      this.selectedInterests.push(interest);
    } else {
      const index = this.selectedInterests.indexOf(interest);
      if (index > -1) {
        this.selectedInterests.splice(index, 1);
      }
    }
    console.log(this.selectedInterests);
  }

  // Step 1: Create user with email and password
  createUser() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.userid = user.uid;
        console.log('User created successfully:', user);
        this.createUserProfile();
        Swal.fire('Success', 'Account created successfully!', 'success'); // Success alert
        this.router.navigate(['/home']); // Navigate to home

      })
      .catch((error) => {
        console.error('Error creating user:', error.message);
        Swal.fire('Error', `Error creating account: ${error.message}`, 'error'); // Error alert
      });
  }

  async createUserProfile() {
    const docRef = doc(this.firestore, 'users', this.userid);

    const userProfileData = {
      username: this.username,
      birthday: this.birthday,
      location: this.location,
      height: this.height,
      weight: this.weight,
      bodyType: this.bodyType,
      workoutFrequency: this.workoutFrequency,
      selectedInterests: this.selectedInterests
    };

    await setDoc(docRef, userProfileData)
      .then(() => {
        console.log('Profile created successfully in Firestore');
        this.sendProfileToDjango(userProfileData);
        Swal.fire('Success', 'Profile saved successfully!', 'success'); // Success alert
      })
      .catch(error => {
        console.error('Error creating profile in Firestore:', error.message);
        Swal.fire('Error', `Error saving profile: ${error.message}`, 'error'); // Error alert
      });
  }

  sendProfileToDjango(userProfileData: any) {
    const payload = {
      userid: this.userid,
      ...userProfileData
    };
    console.log(payload);
    this.sharedService.createUser(payload).subscribe(
      response => {
        console.log('User profile sent to Django successfully:', response);
        Swal.fire('Success', 'Profile sent to server!', 'success'); // Success alert
      },
      error => {
        console.error('Error sending profile to Django:', error);
        Swal.fire('Error', `Error sending profile: ${error.message}`, 'error'); // Error alert
      }
    );
  }

  login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        console.log('User logged in:', userCredential.user);
        localStorage.setItem('isUserLoggedIn', 'true');
        Swal.fire('Success', 'Login successful!', 'success'); // Success alert
        this.router.navigate(['/home']); // Navigate to home
      })
      .catch((error) => {
        this.errorMessage = 'Login failed: ' + error.message;
        console.error('Login error:', error);
        Swal.fire('Error', `Login failed: ${error.message}`, 'error'); // Error alert
      });
  }

  googleSignIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(result => {
        console.log('Google user logged in:', result.user.email);
        localStorage.setItem('isUserLoggedIn', 'true');
        Swal.fire('Success', 'Logged in with Google!', 'success'); // Success alert
        this.router.navigate(['/home']); // Navigate to home
      })
      .catch(error => {
        this.errorMessage = 'Google Sign-In failed: ' + error.message;
        console.error('Error during Google Sign-In:', error);
        Swal.fire('Error', `Google Sign-In failed: ${error.message}`, 'error'); // Error alert
      });
  }

  resetModal() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.birthday = '';
    this.location = '';
    this.bodyType = '';
    this.height = 0;
    this.weight = 0;
    this.workoutFrequency = '';
    this.selectedInterests = [];
    this.isUserCreated = false;

    const carousel = document.querySelector('#carouselExample');
    if (carousel) {
      const bootstrapCarousel = (window as any).bootstrap.Carousel;
      if (bootstrapCarousel) {
        const carouselInstance = new bootstrapCarousel(carousel);
        carouselInstance.to(0); // Move the carousel back to the first item
      }
    }
  }
}
