import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback/callback.component';
import { LogoutComponent } from './logout/logout.component';
import { SharedLoginComponent } from './shared-login/shared-login.component';
import { RedirectComponent } from './redirect/redirect.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'callback',
        component: CallbackComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'shared_login',
        component: SharedLoginComponent
      },
      {
        path: 'redirect',
        component: RedirectComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
