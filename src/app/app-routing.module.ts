import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

@NgModule({
  imports: [
    RouterModule.forRoot(
      baseModuleRoutes
    )
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
