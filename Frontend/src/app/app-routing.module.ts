import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [  
  { path: 'splash', component: SplashscreenComponent, canActivate: [authGuard]},
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/splash', pathMatch: 'full' },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
