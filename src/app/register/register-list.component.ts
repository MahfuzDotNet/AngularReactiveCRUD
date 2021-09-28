import { Component, OnInit } from '@angular/core';

import { RegisterService } from './register.service';
import { User } from './user';

@Component({
  selector: 'pm-register-list',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.css']
})
export class RegisterListComponent implements OnInit {
  pageTitle = 'User List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.users;
  }

  filteredUsers: User[] = [];
  users: User[] = [];

  constructor(private registerService: RegisterService) { }

  performFilter(filterBy: string): User[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((user: User) =>
      user.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {

 
    this.registerService.getUsers().subscribe({
      next: users => {
        
        this.users = users;
        this.filteredUsers = this.users;       
      },
      error: err => this.errorMessage = err
    });
  }
}
