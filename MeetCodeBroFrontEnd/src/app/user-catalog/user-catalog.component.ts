import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { CatalogService } from '../catalog.service';
import { limitSkip } from '../catalog';
import { User } from '../user';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-user-catalog',
  templateUrl: './user-catalog.component.html',
  styleUrls: ['./user-catalog.component.scss']
})
export class UserCatalogComponent implements OnInit {

  private userNumber: Number = 0;
  public usersToShow: User[] = [];

  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.usersCount();
    this.getUsers();
  }

  usersCount(): void{
    this.catalogService.getUsersCount().subscribe({
      next: (data) => {this.userNumber = data},
      complete: () => {console.log("pobrano liczbę użytkowników " + this.userNumber)},
      error: (err) => {console.log(err)}
    })
  }

  getUsers(): void{
    const data: limitSkip = {
      skip: 0,
      limit: 10
    }
    this.catalogService.getUserPerPage(data).subscribe({
      next: (data) => {this.usersToShow = data},
      complete: () => {console.log(this.usersToShow)},
      error: (err) => {console.log(err)}
    })
  }
}
