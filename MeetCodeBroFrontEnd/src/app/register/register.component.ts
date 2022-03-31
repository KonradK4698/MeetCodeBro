import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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
  

  constructor() { }

  ngOnInit(): void {
  }

  
  onSubmit():void {
    console.log(this.userRegisterForm.value)
  }

}
