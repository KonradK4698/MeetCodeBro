import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../user';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginForm = new FormGroup({
    userEmail: new FormControl(''),
    userPassword: new FormControl('')
  })

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  onSubmit():void {
    let userEmail: string = this.userLoginForm.value.userEmail;
    let userPassword: string = this.userLoginForm.value.userPassword;

    this.loginService.loginUser({email: userEmail, password: userPassword}).subscribe(
      {
        next: (data) => {console.log(data)},
        complete: () => (console.log("User zalogowany")),
        error: (err) => { console.log(err) }
      }
    )
  }

}
