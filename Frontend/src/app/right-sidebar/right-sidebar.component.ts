import { Component } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.css'
})
export class RightSidebarComponent {
  dropdownVisible = false;

  // Holds the list of users and posts fetched from the server
  users: any[] = [];
  posts: any[] = [];

  // Holds the list of users filtered by search query
  usersSearch: any[] = [];

  // Holds the list of posts filtered by search query
  postsSearch: any[] = [];

  constructor(private sharedService: SharedService) { }

  // On component initialization,
  ngOnInit() {
    this.fetchUsers();  // Fetch users
    this.fetchPosts();  // Fetch posts
  }

  fetchUsers() {
    this.sharedService.getAllUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchPosts() {
    this.sharedService.getAllPosts().subscribe(
      (response) => {
        this.posts = response;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }


  //
  //onKeydown(event: KeyboardEvent) {
  //  let query = (event.target as HTMLInputElement).value;
  //  if (query.length > 0) {
  //    this.userService.searchUsers(query).subscribe(users => {
  //      this.users = users;
  //      this.dropdownVisible = true;
  //    });
  //  } else {
  //    this.dropdownVisible = false;
  //  }
  //}

  onKeydown(event: KeyboardEvent) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query.length > 0) {
      this.usersSearch = this.users.filter(user => user.username.toLowerCase().startsWith(query));
      this.postsSearch = this.posts.filter(post => post.content.toLowerCase().includes(query));
      this.dropdownVisible = true;
    } else {
      this.usersSearch = [];
      this.postsSearch = [];
      this.dropdownVisible = false;
    }
  }



  showDropdown() {
    this.dropdownVisible = true;
  }

  hideDropdown() {
    // Delay hiding to allow click events on dropdown items
    setTimeout(() => {
      this.dropdownVisible = false;
    }, 200);
  }

  //onKeydown(event: KeyboardEvent) {
  //  if (event.key === 'Enter') {
  //    console.log('searching...');
  //  }
  //}
}
