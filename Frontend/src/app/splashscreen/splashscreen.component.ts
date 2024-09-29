import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.component.html',
  styleUrl: './splashscreen.component.css'
})
export class SplashscreenComponent {
  private firestore = getFirestore(); // No need to initialize again
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  username: string = '';
  birthday: string = '';
  location: string = '';
  height: number | null = null; // New property for height
  weight: number | null = null; // New property for weight
  bodyType: string = ''; // New property for body type
  workoutFrequency: string = ''; // New property for workout frequency
  userId: string = '';
  isUserCreated: boolean = false;
  categorizedInterests: { name: string; interests: string[] }[] = [
    // General Fitness Interests
    { name: 'Workout Styles', interests: ['Weightlifting', 'Cardio', 'HIIT', 'Yoga', 'Pilates', 'CrossFit'] },
    { name: 'Nutrition & Diet', interests: ['Meal Prep', 'Healthy Eating', 'Supplements', 'Vegan', 'Keto', 'Paleo'] },
    { name: 'Fitness Goals', interests: ['Weight Loss', 'Muscle Gain', 'Endurance Training', 'Flexibility', 'Overall Health', 'Performance'] },
    
    // Community Engagement
    { name: 'Social Activities', interests: ['Group Workouts', 'Fitness Challenges', 'Sports Events', 'Community Runs', 'Dance Classes', 'Outdoor Adventures'] },
    { name: 'Support & Motivation', interests: ['Workout Buddies', 'Motivational Quotes', 'Fitness Coaches', 'Online Communities', 'Accountability Partners', 'Success Stories'] },
    
    // Equipment & Facilities
    { name: 'Gym Facilities', interests: ['Gym Types', 'Home Gym', 'Fitness Studios', 'Outdoor Gyms', 'Public Parks', 'Sports Centers'] },
    { name: 'Equipment Preferences', interests: ['Cardio Machines', 'Free Weights', 'Resistance Bands', 'Kettlebells', 'Bodyweight Exercises', 'Mobility Tools'] },
  
    // Mindset & Wellness
    { name: 'Wellness Practices', interests: ['Meditation', 'Mindfulness', 'Self-Care', 'Stress Management', 'Sleep Hygiene', 'Recovery Techniques'] },
    { name: 'Fitness Education', interests: ['Workshops', 'Webinars', 'Nutrition Classes', 'Fitness Certifications', 'Health Coaching', 'Personal Development'] }
  ];
  
  constructor(private router: Router) {}

  selectedInterests: string[] = [];
  onInterestChange(event: any, interest: string) {
    if (event.target.checked) {
      this.selectedInterests.push(interest);
    } else {
      const index = this.selectedInterests.indexOf(interest);
      if (index > -1) {
        this.selectedInterests.splice(index, 1);
      }
    }
    console.log(this.selectedInterests)
  }
  // Step 1: Create user with email and password
  createUser() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.email, this.password)
    .then((userCredential) => {
      // Successfully created user
      const user = userCredential.user;
      this.userId = user.uid;  // Store user ID for Firestore
      console.log('User created successfully:', user);
      this.createUserProfile();
      
    })
    .catch((error) => {
      console.error('Error creating user:', error.message);

    });
  }

  async createUserProfile() {
  const docRef = doc(this.firestore, 'users', this.userId); // Create document reference using the userId

  await setDoc(docRef, {
    username: this.username,
    birthday: this.birthday,
    location: this.location,
    height: this.height, // Add height to Firestore document
    weight: this.weight, // Add weight to Firestore document
    bodyType: this.bodyType, // Add body type to Firestore document
    workoutFrequency: this.workoutFrequency,
    selectedInterests: this.selectedInterests 
  })
    .then(() => {
      console.log('Profile created successfully');
      this.resetModal();
      localStorage.setItem('isUserLoggedIn', 'true');
    })
    .catch(error => {
      console.error('Error creating profile:', error.message);
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

  this.isUserCreated = false; // Reset the flag
  
  // Access bootstrap from the window object
  const carousel = document.querySelector('#carouselExample');
  if (carousel) {
    const bootstrapCarousel = (window as any).bootstrap.Carousel;
    if (bootstrapCarousel) {
      const carouselInstance = new bootstrapCarousel(carousel);
      carouselInstance.to(0); // Move the carousel back to the first item
    }
  }
}
  login() {
    const auth = getAuth();
    
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        console.log('User logged in:', userCredential.user);
        localStorage.setItem('isUserLoggedIn', 'true');
        
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
        localStorage.setItem('isUserLoggedIn', 'true'); 
        // Perform any additional logic after login, such as navigation
      })
      .catch(error => {
        this.errorMessage = 'Google Sign-In failed: ' + error.message;
        console.error('Error during Google Sign-In:', error);
      });
  }
}
