import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfileService } from '../user-profile.service';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { User } from '../user';
import jwt_decode from 'jwt-decode';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Technology } from '../technology';
import { AuthService } from '../auth.service';
import { FriendsService } from '../friends.service';
import { decodeJWTToken } from '../decodeToken';
import { Friend, SugestedUser } from '../friend';

import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Invite{
  invitationID: number,
  senderID: number
}

interface UserWithInvite{
  senderInformation: User,
  invitationInformation: Invite
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})



export class UserProfileComponent implements OnInit {

  message: string = '';
  value:boolean = true
  selectedItems = [];
  public invitationSenderInfoArr: User[] = []; 
  private invitationsArr: Invite[] = [];
  public invitationSenders: UserWithInvite[] = [];
  public userFriends: Friend[] = [];
  public sugestedFriendsFromFriends: SugestedUser[] = [];

  userInformation: User = {};


  userProfileForm = new FormGroup({
    userName: new FormControl(''),
    userSurname: new FormControl(''),
    userDescription: new FormControl(''),
    userGithub: new FormControl(''),
    userLinkedin: new FormControl('')
  })
  
  public result: Technology[] = [];
  

  selected: number[] = [5, 6];
  
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'ID',
    textField: 'Name',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true,
  };

  //wybór tehnologii
  separatorKeysCodes: number[] = [];
  userKnownTechnologies: Technology[] =[];
  userTechnologiesName:string[] = []; 
  userTechnologiesId:number[] = [];
  userTechToDelete:number[] = [];
  userTechToCreate:number[] = [];
  allTechnologies: Technology[] = [];
  userTechnologies = new FormControl('');

  addTechnology(event: MatChipInputEvent): void {
    
    const value = (event.value || '').trim();
    if (value) {
      this.userTechnologiesName.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.userTechnologies.setValue(null);
  }

  removeTechnology(technology: string): void {
    const index = this.userTechnologiesName.indexOf(technology);
    let techID = 0;
    if (index >= 0) {
      this.userTechnologiesName.splice(index, 1);
    }

    this.allTechnologies.map(tech => {
      if(tech.Name === technology){
        techID = tech.ID;
        const techIdIndex = this.userTechnologiesId.indexOf(techID);
        if(techIdIndex >= 0){
          this.userTechnologiesId.splice(index, 1);
        }
      }
    })

  }

  selectTechnology(event: MatAutocompleteSelectedEvent): void {
    this.userTechnologiesName.push(event.option.viewValue);
    this.userTechnologiesId.push(event.option.value);
    
    this.userTechnologies.setValue(null);
  }

  constructor(private userProfileService: UserProfileService,private authService: AuthService, private friendsService: FriendsService){}
  
  ngOnInit(): void {
    this.getUserData();
    if(this.authService.isLoggedOut()){
      this.authService.logout();
    }

    this.getTechnologies();
    this.geUserTechnologies();

    this.getInvitation();

    this.getAllFriends();

    this.sugestsFriends();
  }

  getTechnologies(): void{
      this.userProfileService.getTechnologies().subscribe({
      next: (data) => {this.allTechnologies = data; console.log(data)},
      complete: () => {console.log("pobrano technologie");},
      error: (err) => {console.log(err);}
    })
  }

  geUserTechnologies(): void{
    const userID = decodeJWTToken().sub.low;

    this.userProfileService.getUserTechnology(userID).subscribe({
      next: (data)=>{
        this.userKnownTechnologies.length = 0;
        this.userTechnologiesName.length = 0;
        this.userTechnologiesId.length = 0;
        this.userKnownTechnologies = data;
        data.map(technology => {
          this.userTechnologiesName.push(technology.Name);
          this.userTechnologiesId.push(technology.ID);
        })
      },
      complete: () => {}, 
      error: (err) => {console.log(err)}
    })
  }

  addUserTechnologies(choosenTechnologies: number[]): void{
    const userID = decodeJWTToken().sub.low;

    this.userProfileService.addUserTechnology(userID, choosenTechnologies).subscribe({
      next: (data) => {console.log(data)},
      complete: () => {
        console.log("Dodano technologie"); 
        this.userTechToCreate.length = 0;
        this.geUserTechnologies();
      },
      error: (err) => {console.log(err);}
    })
  }

  deleteUserTechnologies(choosenTechnologies: number[]): void{
    const userID = decodeJWTToken().sub.low;

    this.userProfileService.deleteUserTechnology(userID, choosenTechnologies).subscribe({
      next: (data) => {console.log(data)},
      complete: () => {
        console.log("Usunięto technologie");
        this.userTechToDelete.length = 0;
        this.geUserTechnologies();
      },
      error: (err) => {console.log(err);}
    })
  }

  saveUserTechnologies(): void{

    this.userTechToCreate = this.userTechnologiesId.filter(tech => {
      const isKnowTechnology = this.userKnownTechnologies.find(data => data.ID === tech )
      const readyToDelete = this.userTechToDelete.includes(tech);

      if(readyToDelete === true){
        const indexToRemove = this.userTechToDelete.indexOf(tech);
        this.userTechToDelete.splice(indexToRemove, 1);
      }
      
      if(isKnowTechnology === undefined){
        return tech
      }else{ 
        return false
      };

    })

    this.userKnownTechnologies.filter(tech => {
      const techExists = this.userTechnologiesId.includes(tech.ID);

      const readyToDelete = this.userTechToDelete.includes(tech.ID);

      if(techExists === false && readyToDelete === false){
        this.userTechToDelete.push(tech.ID)
        return tech
      }else{
        return tech
      }
    })

    if(this.userTechToCreate.length > 0){
      this.addUserTechnologies(this.userTechToCreate);
    }

    if(this.userTechToDelete.length > 0){
      this.deleteUserTechnologies(this.userTechToDelete);
    }

    console.log(this.userTechToCreate);
    
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

    const userID = decodeJWTToken().sub.low;


    this.userProfileService.getUserData(userID).subscribe({
      next: (data) => {  this.userInformation = data; this.setValueInForm(data) },
      complete: () => {console.log("Zakończono pobieranie dnaych"); this.message = "posiadasz dostęp"},
      error: (err) => {console.log(err); this.message = "brak dostępu";}
    })

  }

  addUserData(): void{
    const userID = decodeJWTToken().sub.low;
    
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

    //this.addUserTechnologies(userID, this.choosenTechnologies);
  }

  getSenderInformation(invitationsArr: Invite[]): void{
    
    const idArray: number[] = [];
    let finish:boolean = false;

    invitationsArr.map(invitation => idArray.push(invitation.senderID));

    this.userProfileService.getUserArray(idArray).subscribe({
      next: (data) => {data.map(user => {this.invitationSenderInfoArr.push(user)})},
      complete: () => {
        finish = true; 
        if(finish){
          invitationsArr.forEach((invitation, index) => {
            const newInvitationSender: UserWithInvite = {
              senderInformation: this.invitationSenderInfoArr[index],
              invitationInformation: invitation
            }
            this.invitationSenders.push(newInvitationSender);
          })
        }
      },
      error: (err) => {console.log(err)}
    })
    
    
  }

  getInvitation(): void{
    const userID = decodeJWTToken().sub.low;

    this.friendsService.getFriendInvitation(userID).subscribe({
      next: (invitations) => {
        invitations.forEach(invitation => {
          this.invitationsArr.push(
            {
              invitationID: invitation.identity.low,
              senderID: invitation.start.low
            }
          )
        })
      },
      complete: () => {
        console.log("Pobrano zaproszenia");
        
        this.getSenderInformation(this.invitationsArr);
      },
      error: (err) => { console.log(err) }
    })

  }

  deleteInvitation(invitationID: number) :void{
    const userID = decodeJWTToken().sub.low;
    
    this.userProfileService.deleteInvitation(userID, invitationID).subscribe({
      next: (data) => {console.log(data)},
      complete: () => {console.log("usunięto relację");},
      error: (err) => {console.log(err)}
    })


  }

  getAllFriends(): void{
    const userID = decodeJWTToken().sub.low;
    const userFriendsID: number[] = [];

    this.userProfileService.getAllFriends(userID).subscribe({
        next: (data) => {data.map(relation => userFriendsID.push(relation.friendID))},
        complete: () => {
          this.userProfileService.getUserArray(userFriendsID).subscribe({
            next: (users) => {users.forEach((user, id) => {
              const newFriend :Friend = {
                userInformation: user,
                friendID: userFriendsID[id]
              }

              this.userFriends.push(newFriend)}
              )},
            complete: () => {console.log("Pobrano przyjaciół")},
            error: (err) => {console.log(err)}
          })
        },
        error: (err) => {console.log(err)}
    })
  }

  deleteFriend(friendID: number): void{
    const userID = decodeJWTToken().sub.low;

    this.userProfileService.deleteFriend(userID, friendID).subscribe({
      next: (data) => {console.log(data)},
      complete: () => {console.log("usunięto przyjaciela")},
      error: (err) => {console.log(err)}
    })
  }

  addToFriend(senderID: number): void{
    const userID = decodeJWTToken().sub.low;
    this.userProfileService.addFriend(senderID, userID).subscribe({
      next: (data) => {console.log(data)},
      complete: () => { console.log("dodano do znajomych"); this.deleteInvitation(senderID); window.location.reload();},
      error: (err) => { console.log(err)}
    })
  }

  sugestsFriends(): void{
    const userID = decodeJWTToken().sub.low;
    this.userProfileService.getSugestedUser(userID).subscribe({
      next: (data) => { this.sugestedFriendsFromFriends = data},
      complete: () => {},
      error: (err)=> {console.log(err)}
    })
  }
}
