import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../user';
import { LoginService } from '../login.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;

  userLoginForm = new FormGroup({
    userEmail: new FormControl(''),
    userPassword: new FormControl('')
  })

  constructor(private loginService: LoginService, private authServie: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit():void {
    let userEmail: string = this.userLoginForm.value.userEmail;
    let userPassword: string = this.userLoginForm.value.userPassword;

    this.loginService.loginUser({email: userEmail, password: userPassword}).subscribe(
      {
        next: (loginData) => {console.log(loginData); this.authServie.setLocalStorage(loginData)},
        complete: () => {console.log("User zalogowany"); window.location.reload(); alert("zalogowano");},
        error: (err) => { console.log(err) }
      }
    )
  }

}
