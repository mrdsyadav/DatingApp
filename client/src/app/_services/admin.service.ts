import { Photo } from 'src/app/_models/photo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl=environment.apiUrl;

  constructor(private http:HttpClient) { }

  getUserWithRoles(){
    return this.http.get<Partial<User[]>>(this.baseUrl+'admin/users-with-roles');
  }
  updateUserRoles(username:string,roles:string[]){
    return this.http.post(this.baseUrl+'admin/edit-roles/'+username+'?roles='+roles,{});
  }
  getPhotosForApproval(){
    return this.http.get<Photo[]>(this.baseUrl+'admin/photos-to-moderate');
  }
  approvePhoto(photoId:number){
    return this.http.post(this.baseUrl+"admin/approve-photo/"+photoId,{});
  }
  rejectPhoto(photoId:number){
    return this.http.post(this.baseUrl+"admin/reject-photo/"+photoId,{});
  }
}
