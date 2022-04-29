import { Component, OnInit, ElementRef,  ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { CatalogService } from '../catalog.service';
import { limitSkip, SearchData } from '../catalog';
import { User } from '../user';
import jwt_decode from 'jwt-decode';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';




@Component({
  selector: 'app-user-catalog',
  templateUrl: './user-catalog.component.html',
  styleUrls: ['./user-catalog.component.scss']
})


export class UserCatalogComponent implements OnInit {

  //zmienne niezbędne do wyszukiwarki
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  userName = new FormControl('');
  userSurname = new FormControl('');
  userTechnologies = new FormControl('');
  userLinkedin = new FormControl('');
  userGithub = new FormControl('');

  searchData: SearchData = {
    name: '',
    surname: '',
    technologies: [],
    socialMedia: {
      github: false,
      linkedin: false
    }
  };

  separatorKeysCodes: number[] = [ENTER, COMMA];
  technologies:string[] = []; 
  allTechnologies = ["JavaScript", "C++", "C#"];
  filteredTechnologies: Observable<string[]>;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.technologies.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.userTechnologies.setValue(null);
  }

  remove(technology: string): void {
    const index = this.technologies.indexOf(technology);

    if (index >= 0) {
      this.technologies.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.technologies.push(event.option.viewValue);
    this.userTechnologies.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTechnologies.filter(technology => technology.toLowerCase().includes(filterValue));
  }

  //zakończenie sekcji wyszukiwania

  public userNumber: number = 0;
  public pageSize: number = 3;
  public showFirstLastButtons: boolean = true;
  public pageSizeOptions: number[] = [1, 3, 10, 25, 100, 1000];
  public pageIndex: number = 0;
  public usersToShow: User[] = [];
  page: number = this.pageIndex;
  limit: number = this.pageSize;


  constructor(private catalogService: CatalogService) { 
    this.filteredTechnologies = this.userTechnologies.valueChanges.pipe(
      startWith(null),
      map((technology: string | null) => (technology ? this._filter(technology) : this.allTechnologies.slice())),
    );
  }

  ngOnInit(): void {
    // this.usersCount();
    this.getUsers(this.page, this.limit, this.searchData);
  }

  // usersCount(): void{
  //   this.catalogService.getUsersCount().subscribe({
  //     next: (data) => {this.userNumber = data},
  //     complete: () => {console.log("pobrano liczbę użytkowników " + this.userNumber)},
  //     error: (err) => {console.log(err)}
  //   })
  // }

  // getUsers(data: limitSkip): void{
  //   this.catalogService.getUserPerPage(data).subscribe({
  //     next: (users) => {this.usersToShow = users},
  //     complete: () => {console.log(this.usersToShow)},
  //     error: (err) => {console.log(err)}
  //   })
  // }

  getUsers(page: number, limit: number, data: SearchData): void{
    this.catalogService.getUsers(page, limit, data).subscribe({
      next: (users) => {
        this.userNumber = users.userCount;
        this.usersToShow = users.users;
      },
      complete: () => {console.log(this.usersToShow)},
      error: (err) => {console.log(err)}
    })
  }

  searchUsers(): void{
    this.searchData.name = this.userName.value; 
    this.searchData.surname = this.userSurname.value; 
    this.searchData.technologies = this.technologies;
    this.searchData.socialMedia.github = this.userGithub.value;
    this.searchData.socialMedia.linkedin = this.userLinkedin.value;

    this.pageIndex = 0;

    this.getUsers(this.page, this.limit, this.searchData);
  }

  getPageIndex(event: PageEvent): void{
    let currentPageIndex: number = this.pageIndex;
    let currentPageSize: number = this.pageSize;

    if(currentPageIndex !== event.pageIndex){
      console.log("Zmieniono stronę " + event.pageIndex);
      this.page = (event.pageIndex * this.pageSize);
      this.pageIndex = event.pageIndex;
    }else{
      console.log("Strona bez zmian " + currentPageIndex)
    }

    if(currentPageSize !== event.pageSize){
      console.log("Zmieniono ilość: " + event.pageSize);
      this.limit = event.pageSize;
      this.pageSize = event.pageSize;
    }else{
      console.log("Ilość bez zmian: " + currentPageSize);
    }

    
    this.getUsers(this.page, this.limit, this.searchData);
  }
}
