import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import jwt_decode from 'jwt-decode';
import { decodeJWTToken } from '../decodeToken';
import { Observable } from 'rxjs';
import { UserProfileService } from '../user-profile.service';
import { ActivatedRoute } from '@angular/router';
import { Technology } from '../technology';
import { Invite } from '../invitations';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-show-user',
  templateUrl: './show-user.component.html',
  styleUrls: ['./show-user.component.scss']
})
export class ShowUserComponent implements OnInit {

  userInformation: User = {};
  private friendID: number = Number(this.route.snapshot.paramMap.get('id'));
  public userTechnologies: Technology[] = [];
  public isFriend: boolean = false;
  public isInvited: boolean = false; 
  public acceptInvitation: boolean = false;
  public sendInvitation: boolean = false;

  constructor(private userProfileService: UserProfileService, private route: ActivatedRoute, private friendService: FriendsService) { }

  ngOnInit(): void {
    this.getUser();
    this.getTechnologies();
    this.checkRelation();
  }

  getUser(): void{ 
    this.userProfileService.getUserData(this.friendID).subscribe({
      next: (user) => {this.userInformation = user}, 
      complete: () => {},
      error: (err) => {console.log(err)}
    })
  }

  getTechnologies(): void{
    this.userProfileService.getUserTechnology(this.friendID).subscribe({
      next: (data)=>{this.userTechnologies = data},
      complete: () => {},
      error: (err) => {console.log(err)}
    })
  }


  private firend1 = 718879;
  private friend2 = 137;
  private invite1 = 809237;
  private invite2 = 153;

  private checkInvitationType(userID: number, start: number, end: number): void{
    if(start === userID) this.isInvited = true;
    if(end === userID)  this.acceptInvitation = true;
  }

  private checkDataRelation(userID: number, data: Invite[]) : void{
    if(data.length === 0){
      this.sendInvitation = true;
      this.isFriend = false;
      this.isInvited = false; 
      this.acceptInvitation = false;
    }else{
      data.map(relation => {
        switch(relation.type){
          case "IsFriend": {
            this.isFriend = true;
            this.sendInvitation = false;
            this.acceptInvitation = false;
            break;
          }
          case "InviteToFriends": {
            const relationStart: number = relation.start.low;
            const relationEnd: number = relation.end.low;
            this.sendInvitation = false;
            this.checkInvitationType(userID, relationStart, relationEnd);
            break;
          }
          default: {
            this.sendInvitation = true;
            this.isFriend = false;
            this.isInvited = false; 
            this.acceptInvitation = false;
            break;
          }
        }
      })
    }

    if(userID === this.friendID){
      this.sendInvitation = false;
    }
  }

  checkRelation(): void{
    const userID = decodeJWTToken().sub.low;
    this.userProfileService.checkRelation(userID, this.friendID).subscribe({
      next: (data)=>{
        console.log(`Relacje ${JSON.stringify(data)}`)
        this.checkDataRelation(userID, data);
    },
      complete: () => {console.log(`isFriend - ${this.isFriend} isInvited - ${this.isInvited} acceptInvitation - ${this.acceptInvitation} sendInvitation - ${this.sendInvitation}`)},
      error: (err) => {console.log(err)}
    })
  }

  inviteUser(): void{ 
    const userID = decodeJWTToken().sub.low;

    this.friendService.sendInvitation(userID, this.friendID).subscribe({
      next: (data)=>{console.log(data)},
      complete: ()=>{this.checkRelation()},
      error: (err)=>{console.log(err)}
    })
  }

  inviteRemove(): void{
    const userID = decodeJWTToken().sub.low;

    this.userProfileService.deleteInvitation(userID, this.friendID).subscribe({
      next: (data)=>{console.log(data)},
      complete: ()=>{this.checkRelation()},
      error: (err)=>{console.log(err)}
    })
  }

  addToFriend() :void{
    const userID = decodeJWTToken().sub.low;
    this.inviteRemove();

    this.userProfileService.addFriend(userID, this.friendID).subscribe({
      next: (data)=>{console.log(data)},
      complete: ()=>{this.checkRelation()},
      error: (err)=>{console.log(err)}
    })
  }

  friendDelete() :void{
    const userID = decodeJWTToken().sub.low;

    this.userProfileService.deleteFriend(userID, this.friendID).subscribe({
      next: (data)=>{console.log(data)},
      complete: ()=>{this.checkRelation()},
      error: (err)=>{console.log(err)}
    })
  }
}
