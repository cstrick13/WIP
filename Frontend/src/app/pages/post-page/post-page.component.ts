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
  post: any = null; // Change to hold a single post object
  postId: number | null = null;

  constructor(private router: Router, private route:ActivatedRoute, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.fetchPosts();

    this.route.params.subscribe(params => {
      this.postId = parseInt(params['id'], 10);
      if (this.postId) {
        this.fetchPosts();
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
}
