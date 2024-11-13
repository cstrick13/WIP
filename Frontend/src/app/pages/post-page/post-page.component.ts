import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.css'
})
export class PostPageComponent implements OnInit {
  posts: any[] = [];
  replies: any[] = [];
  filteredReplies: any[] = [];
  users: any[] = [];
  post: any = null; // Change to hold a single post object
  postId: number | null = null;

  constructor(private router: Router, private route:ActivatedRoute, private sharedService: SharedService) {}

  ngOnInit(): void {
    //this.fetchPosts();

    this.route.params.subscribe(params => {
      this.postId = parseInt(params['id'], 10);
      if (this.postId) {
        this.fetchPosts();
        this.fetchReplies();
        this.fetchUsers();
      }
    });
  }

  fetchPosts() {
    this.sharedService.getAllPosts().subscribe(
      (response) => {
        this.posts = response;
        if (this.postId) {
          this.getPost(this.postId); // Filter posts after fetching
        }
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  getPost(postId: number) {
    this.post = this.posts.find(post => post.id === postId);
  }

  fetchReplies() {
    this.sharedService.getAllReplies().subscribe(
      (response) => {
        this.replies = response;
        if (this.postId) {
          this.filteredReplies = this.replies.filter(reply => reply.post === this.postId);
          this.mapUsernamesToReplies();
          //this.getReplies(this.postId); // Filter replies after
        }
      },
      (error) => {
        console.error('Error fetching replies:', error);
      }
    );
  }

  fetchUsers() {
    this.sharedService.getAllUsers().subscribe(
      (response) => {
        this.users = response;
        this.mapUsernamesToReplies();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  mapUsernamesToReplies() {
    if (this.users.length > 0 && this.filteredReplies.length > 0) {
      this.filteredReplies.forEach(reply => {
        const user = this.users.find(user => user.userid === reply.userid);
        if (user) {
          reply.username = user.username;
        }
      });
    }
  }

  getReplies(postId: number) {
    this.replies.filter(reply => reply.post === postId);
  }
}
