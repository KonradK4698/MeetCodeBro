import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

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

  public userNumber: number = 0;
  public pageSize: number = 1;
  public showFirstLastButtons: boolean = true;
  public pageSizeOptions: number[] = [1, 3, 10, 25, 100, 1000];
  public pageIndex: number = 0;
  public usersToShow: User[] = [];
  private paginationData: limitSkip = {
    skip: this.pageIndex, 
    limit: this.pageSize
  }


  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.usersCount();
    this.getUsers(this.paginationData);
  }

  usersCount(): void{
    this.catalogService.getUsersCount().subscribe({
      next: (data) => {this.userNumber = data},
      complete: () => {console.log("pobrano liczbę użytkowników " + this.userNumber)},
      error: (err) => {console.log(err)}
    })
  }

  getUsers(data: limitSkip): void{
    this.catalogService.getUserPerPage(data).subscribe({
      next: (users) => {this.usersToShow = users},
      complete: () => {console.log(this.usersToShow)},
      error: (err) => {console.log(err)}
    })
  }

  getPageIndex(event: PageEvent): void{
    let currentPageIndex: number = this.pageIndex;
    let currentPageSize: number = this.pageSize;

    if(currentPageIndex !== event.pageIndex){
      console.log("Zmieniono stronę " + event.pageIndex);
      this.paginationData.skip = (event.pageIndex * this.pageSize);
      this.pageIndex = event.pageIndex;
    }else{
      console.log("Strona bez zmian " + currentPageIndex)
    }

    if(currentPageSize !== event.pageSize){
      console.log("Zmieniono ilość: " + event.pageSize);
      this.paginationData.limit = event.pageSize;
      this.pageSize = event.pageSize;
    }else{
      console.log("Ilość bez zmian: " + currentPageSize);
    }

    this.getUsers(this.paginationData);
  }
}
