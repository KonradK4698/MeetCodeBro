import { Component, OnInit, ElementRef,  ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { CatalogService } from '../catalog.service';
import { limitSkip, SearchData } from '../catalog';
import { User } from '../user';
import { decodeJWTToken } from '../decodeToken';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { UserProfileService } from '../user-profile.service';
import { Technology } from '../technology';



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

  //wybór tehnologii
  separatorKeysCodes: number[] = [];
  userKnownTechnologies: Technology[] =[];
  userTechnologiesName:string[] = []; 
  userTechnologiesId:number[] = [];
  userTechToDelete:number[] = [];
  userTechToCreate:number[] = [];
  allTechnologies: Technology[] = [];

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

  //zakończenie sekcji wyszukiwania

  public userNumber: number = 0;
  public pageSize: number = 3;
  public showFirstLastButtons: boolean = true;
  public pageSizeOptions: number[] = [1, 3, 10, 25, 100, 1000];
  public pageIndex: number = 0;
  public usersToShow: User[] = [];
  public dataReady: boolean = false;
  page: number = this.pageIndex;
  limit: number = this.pageSize;


  constructor(private catalogService: CatalogService, private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    this.getUsers(this.page, this.limit, this.searchData);
    this.getTechnologies();
  }

  getUsers(page: number, limit: number, data: SearchData): void{
    this.catalogService.getUsers(page, limit, data).subscribe({
      next: (usersData) => {
        this.usersToShow= [];
        this.userNumber = usersData.userCount;
        this.usersToShow = usersData.users;
      },
      complete: () => {this.getUserTechnologies()},
      error: (err) => {console.log(err)}
    })
  }

  searchUsers(): void{
    this.searchData.name = this.userName.value; 
    this.searchData.surname = this.userSurname.value; 
    this.searchData.technologies = this.userTechnologiesId;
    this.searchData.socialMedia.github = this.userGithub.value;
    this.searchData.socialMedia.linkedin = this.userLinkedin.value;

    this.pageIndex = 0;
    
    this.dataReady = false;

    this.getUsers(this.page, this.limit, this.searchData);
  }

  getPageIndex(event: PageEvent): void{
    let currentPageIndex: number = this.pageIndex;
    let currentPageSize: number = this.pageSize;
    this.dataReady = false;

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

  getTechnologies(): void{
    this.userProfileService.getTechnologies().subscribe({
    next: (data) => {this.allTechnologies = data;},
    complete: () => {console.log("pobrano technologie");},
    error: (err) => {console.log(err);}
  })
}

getUserTechnologies() :void{
  this.usersToShow.map(user => {
    this.userProfileService.getUserTechnology(<number>user.id).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data))
        user.technologies = data;
      },
      complete: () => {},
      error: (err) => {console.log(err);}
    })
  })

  
  this.dataReady = true; 
}
}
