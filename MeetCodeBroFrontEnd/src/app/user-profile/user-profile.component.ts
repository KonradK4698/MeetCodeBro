import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfileService } from '../user-profile.service';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { User } from '../user';
import jwt_decode from 'jwt-decode';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Technology } from '../technology';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  message: string = '';
  value:boolean = true
  selectedItems = [];
  private choosenTechnologies: Technology[] = [];


  userProfileForm = new FormGroup({
    userName: new FormControl(''),
    userSurname: new FormControl(''),
    userDescription: new FormControl(''),
    userGithub: new FormControl(''),
    userLinkedin: new FormControl('')
  })

  public result: Technology[] = [];
  

  
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'ID',
    textField: 'Name',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true,
  };
  

  constructor(private userProfileService: UserProfileService,private authService: AuthService){}
  
  ngOnInit(): void {
    this.getUserData();
    if(this.authService.isLoggedOut()){
      this.authService.logout();
    }
    
    this.getTechnologies();

  }

  ngAfterViewInit(): void{
    console.log("inicjalizacja")
  }

  getTechnologies(): void{
      this.userProfileService.getTechnologies().subscribe({
      next: (data) => {this.result = data},
      complete: () => {console.log("pobrano technologie");},
      error: (err) => {console.log(err);}
    })
  }

  chooseTechnology(item: any): void{
    this.choosenTechnologies.push(item.ID); 
  }

  addUserTechnologies(userID: number, choosenTechnologies: Technology[]): void{
    this.userProfileService.addUserTechnology(userID, choosenTechnologies).subscribe({
      next: (data) => {console.log(data)},
      complete: () => {console.log("Dodano technologie");},
      error: (err) => {console.log(err);}
    })
  }

  setValueInForm(userData: User): void{
    this.userProfileForm.patchValue({
      userName: userData.name,
      userSurname: userData.surname,
      userDescription: userData.description,
      userGithub: userData.github,
      userLinkedin: userData.linkedin
    });
  }

  getUserData(): void{

    interface lowHighObj {
      low: number, 
      high: number
    }

    interface JwtUserData {
      sub: lowHighObj, 
      exp: number,
      iat: number
    }

    const token:string = <string>localStorage.getItem("id_token");
    const tokenWithoutBearer:string = token.replace('Bearer ', '');
    const decodedJWT:JwtUserData = jwt_decode(tokenWithoutBearer);
    const userID = decodedJWT.sub.low;


    this.userProfileService.getUserData(userID).subscribe({
      next: (data) => {  this.setValueInForm(data) },
      complete: () => {console.log("Zakończono pobieranie dnaych"); this.message = "posiadasz dostęp"},
      error: (err) => {console.log(err); this.message = "brak dostępu";}
    })

  }

  addUserData(): void{
    interface lowHighObj {
      low: number, 
      high: number
    }

    interface JwtUserData {
      sub: lowHighObj, 
      exp: number,
      iat: number
    }

    const token:string = <string>localStorage.getItem("id_token");
    const tokenWithoutBearer:string = token.replace('Bearer ', '');
    const decodedJWT:JwtUserData = jwt_decode(tokenWithoutBearer);
    const userID = decodedJWT.sub.low;
    
    const userInfo: User = {
      name: this.userProfileForm.value.userName,
      surname: this.userProfileForm.value.userSurname,
      description: this.userProfileForm.value.userDescription,
      github: this.userProfileForm.value.userGithub,
      linkedin: this.userProfileForm.value.userLinkedin
    }

    this.userProfileService.sendUserData(userID, userInfo).subscribe({
        next: (sendData) => {console.log(sendData);},
        complete: () => (console.log("Dane zostały dodane")),
        error: (err) => { console.log(err) }
    } 
    )

    this.addUserTechnologies(userID, this.choosenTechnologies);
  }

}
