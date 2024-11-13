import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { authGuard } from './guards/auth.guard';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ProgressPageComponent } from './progress-page/progress-page.component';

const routes: Routes = [  
  { path: 'splash', component: SplashscreenComponent, canActivate: [authGuard]},
  { path: 'home', component: HomeComponent},
  { path: 'profile-page', component: ProfilePageComponent},
  { path: 'progress-page', component: ProgressPageComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to 'home' if no path is provided
  { path: '**', redirectTo: '/home' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
