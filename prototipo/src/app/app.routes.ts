import { Routes } from '@angular/router';
import { AuthPage } from './pages/auth/auth.page';
import { MainPage } from './pages/main/main.page';
import { SplashPage } from './pages/splash/splash.page';
import { HomePage } from './pages/main/home/home.page';

export const routes: Routes = [
  { path: '', component: AuthPage, pathMatch: 'full' },
  { path: 'auth', component: AuthPage },
  { path: 'main', component: MainPage,
    // children: [
    //   { path: 'home', component: HomePage }]
    },
        {path: 'main/home', component: HomePage},
  { path: 'splash', component: SplashPage },
];
