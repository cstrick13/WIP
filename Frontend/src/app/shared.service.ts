import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  readonly APIUrl = "http://127.0.0.1:8000";
  constructor(private http: HttpClient) { }
  getTestList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/tests/`);
  }
  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/posts/`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/users/`);
  }
  
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.APIUrl}/create-user/`, userData);  // Change the URL to your actual endpoint
  }

  createPost(postData: any): Observable<any> {
    return this.http.post<any>(`${this.APIUrl}/create-post/`, postData);  
  }
  likePost(postId: number): Observable<any> {
    return this.http.post<any>(`${this.APIUrl}/posts/${postId}/like/`, {});
  }

}
