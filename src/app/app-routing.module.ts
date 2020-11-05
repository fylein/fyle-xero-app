import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

<<<<<<< HEAD
const baseModuleRoutes: Routes = [
  {
    path: '',
    redirectTo: '/workspaces',
    pathMatch: 'full'
  },
  {
    path: 'workspaces',
    loadChildren: () => import('./xero/xero.module').then(m => m.XeroModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'workspaces',
    pathMatch: 'full'
  }
];
=======
const baseModuleRoutes: Routes = [];
>>>>>>> main

@NgModule({
  imports: [
    RouterModule.forRoot(
      baseModuleRoutes
    )
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
