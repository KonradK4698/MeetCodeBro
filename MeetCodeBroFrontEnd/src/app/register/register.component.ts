import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../user';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userRegisterForm = new FormGroup({
    userEmail: new FormControl(''),
    userPassword: new FormControl('')
  })
  
  
  constructor(private registerService: RegisterService) { }

  ngOnInit(): void {
  }

  
  onSubmit():void {
    let userPassword: string = this.userRegisterForm.value.userPassword;
    let userEmail: string = this.userRegisterForm.value.userEmail;
    
    this.registerService.addUser({email: userEmail, password: userPassword}).subscribe();
    // console.log(this.userRegisterForm.value)
  }

}
