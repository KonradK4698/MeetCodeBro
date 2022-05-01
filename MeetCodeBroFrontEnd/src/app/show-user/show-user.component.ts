import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { UserProfileService } from '../user-profile.service';

@Component({
  selector: 'app-show-user',
  templateUrl: './show-user.component.html',
  styleUrls: ['./show-user.component.scss']
})
export class ShowUserComponent implements OnInit {

  userInformation: User = {};
  private userID: number = 0;

  constructor(private userProfileService: UserProfileService) { }

  ngOnInit(): void {
  }

  getUser(): void{ 
    this.userProfileService.getUserData(this.userID).subscribe({
      next: (user) => {console.log(user)}, 
      complete: () => {console.log("dane zostały pobrane")},
      error: (err) => {console.log(err)}
    })
  }

}
