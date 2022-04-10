import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  message: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.protectTest();
  }

  ngAfterViewInit(): void{
    console.log("inicjalizacja")
  }

  protectTest(): void{

    this.http.get('/api/login/protected').subscribe(
      (response) => {
        if(response) {
          console.log(response)
          this.message = "Posiadasz dostęp"
        }
      },
      (error) => {
        if( error.status === 401) {
          this.message = "Brak dostępu";
        }
      },
      () => {
        console.log("Koniec http")
      }
    )
  }

}
