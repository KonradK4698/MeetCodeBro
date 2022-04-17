import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MeetCodeBroFrontEnd';
  userLogged: boolean = false;
  constructor(private authService: AuthService){}

  ngOnInit(){
    this.userLogged = this.authService.isLoggedIn();
  }

  logOut(): void{
    this.authService.logout();
  }

  
  
}
