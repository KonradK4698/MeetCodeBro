import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../user';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userRegisterForm = new FormGroup({
    userEmail: new FormControl(''),
    userPassword: new FormControl('')
  })
  
  message: string = '';
  
  constructor(private registerService: RegisterService) { }

  ngOnInit(): void {
  }

  
  onSubmit():void {
    let userPassword: string = this.userRegisterForm.value.userPassword;
    let userEmail: string = this.userRegisterForm.value.userEmail;
    
    this.registerService.addUser({email: userEmail, password: userPassword}).subscribe(
      {
        next(data) { console.log(data)},
        error: (err) => { this.message = err},
        complete: () => {this.message = "Użytkownik został dodany"}
      }
    );
    // console.log(this.userRegisterForm.value)
  }

}
