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
import { Friend } from '../friend';

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
  private choosenTechnologies: Technology[] = [];
  public invitationSenderInfoArr: User[] = []; 
  private invitationsArr: Invite[] = [];
  public invitationSenders: UserWithInvite[] = [];
  public userFriends: Friend[] = [];

  userInformation: User = {};


  userProfileForm = new FormGroup({
    userName: new FormControl(''),
    userSurname: new FormControl(''),
    userDescription: new FormControl(''),
    userGithub: new FormControl(''),
    userLinkedin: new FormControl('')
  })

  technologies = new FormControl();
  
  

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
  

  constructor(private userProfileService: UserProfileService,private authService: AuthService, private friendsService: FriendsService){}
  
  ngOnInit(): void {
    this.getUserData();
    if(this.authService.isLoggedOut()){
      this.authService.logout();
    }
    
    this.getTechnologies();

    this.getInvitation();

    this.getAllFriends();
  }

  ngAfterViewInit(): void{
    console.log("inicjalizacja")
  }

  getTechnologies(): void{
      this.userProfileService.getTechnologies().subscribe({
      next: (data) => {this.result = data; console.log(data)},
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

  addToFriend(senderID: number, invitationID: number): void{
    const userID = decodeJWTToken().sub.low;
    this.userProfileService.addFriend(senderID, userID).subscribe({
      next: (data) => {console.log(data)},
      complete: () => { console.log("dodano do znajomych"); this.deleteInvitation(invitationID); window.location.reload();},
      error: (err) => { console.log(err)}
    })
  }
}
