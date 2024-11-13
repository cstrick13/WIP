import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {getAuth} from 'firebase/auth';
import {initializeApp, getApps} from 'firebase/app';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { environment } from './.env/environement.development';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { PostPageComponent } from './pages/post-page/post-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SplashscreenComponent,
    SidebarComponent,
    RightSidebarComponent,
    ProfilePageComponent,
    UserProfilePageComponent,
    PostPageComponent
  ],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [    
    provideHttpClient(withFetch()),
    provideClientHydration(),],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
    if(!getApps().length){
      initializeApp(environment.firebaseConfig);
      console.log('Yay')
    }else{
      console.log('Nayy')
    }

    const auth = getAuth();
    
    if (auth) {
      console.log('Firebase Auth initialized:', auth);
    } else {
      console.log('Failed to initialize Firebase Auth.');
    }
  }
}
