import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/index';


const routes: Routes = [
  {
      path: '',
      redirectTo: 'auth',
      pathMatch: 'full'
  },
  { 
      path: 'auth', 
      loadChildren: () =>
      import('../app/auth/auth.module').then(
          (m) => m.AuthModule
      ) 
  },
  { 
      path: 'pages', 
      canActivate: [AuthGuard],
      loadChildren: () =>
      import('../app/pages/pages.module').then(
          (m) => m.PagesModule
      ) 
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [
      RouterModule.forRoot(
          routes,
          { enableTracing: false }
      ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
