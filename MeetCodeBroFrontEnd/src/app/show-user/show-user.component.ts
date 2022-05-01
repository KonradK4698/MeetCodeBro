import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { UserProfileService } from '../user-profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-user',
  templateUrl: './show-user.component.html',
  styleUrls: ['./show-user.component.scss']
})
export class ShowUserComponent implements OnInit {

  userInformation: User = {};
  private userID: number = Number(this.route.snapshot.paramMap.get('id'));

  constructor(private userProfileService: UserProfileService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void{ 
    this.userProfileService.getUserData(this.userID).subscribe({
      next: (user) => {this.userInformation = user}, 
      complete: () => {console.log("dane zostały pobrane")},
      error: (err) => {console.log(err)}
    })
  }

}
