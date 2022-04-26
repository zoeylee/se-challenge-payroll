import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { ListErrorsComponent } from '../pages/shared/list-errors/list-errors.component';

const authRouting: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(authRouting)
  ],
  declarations: [
    AuthComponent,
    ListErrorsComponent
  ],
  exports: [RouterModule],
  providers: []
})
export class AuthModule {}
