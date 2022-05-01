import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserCatalogComponent } from './user-catalog/user-catalog.component';
import { ShowUserComponent } from './show-user/show-user.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent },
  {path: 'login', component: LoginComponent},
  {path: 'account', component: UserProfileComponent},
  {path: 'catalog', component: UserCatalogComponent},
  {path: 'user/:id', component: ShowUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
