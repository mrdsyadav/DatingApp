import { Group } from './../_models/group';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginatedRessult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl=environment.apiUrl;
  hubUrl=environment.hubUrl;
  private hubConnection:HubConnection;
  private messageThreadSource=new BehaviorSubject<Message[]>([]);
  messageThread$=this.messageThreadSource.asObservable();

  constructor(private http:HttpClient) { }

  createHubConnection(user:User, otherUsername:string){
    this.hubConnection=new HubConnectionBuilder()
    .withUrl(this.hubUrl+'message?user='+otherUsername,{
      accessTokenFactory:()=>user.token
    })
    .withAutomaticReconnect()
    .build()

    this.hubConnection.start().catch(error=>console.log(error));
    this.hubConnection.on("ReceiveMessageThread",message=>{
      this.messageThreadSource.next(message);
    });

    this.hubConnection.on("NewMessage",message=>{
      this.messageThread$.pipe(take(1)).subscribe(messages=>{
        this.messageThreadSource.next([...messages,message]);
      })
    })

    this.hubConnection.on("UpdatedGroup",(group:Group)=>{
      if(group.connections.some(x=>x.username===otherUsername)){
        this.messageThread$.pipe(take(1)).subscribe(messages=>{
          messages.forEach(message=>{
            if(!message.dateRead){
              message.dateRead=new Date(Date.now());
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    })
  }

  stopConnection(){
    if(this.hubConnection){
      this.hubConnection.stop();
    }    
  }

  getMessage(pageNumber,pageSize,container){
    let params=getPaginationHeaders(pageNumber,pageSize);
    params=params.append('Container',container);
    return getPaginatedRessult<Message[]>(this.baseUrl+'messages',params,this.http);
  }

  getMessageThread(username:string){
    return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+username);
  }

  async sendMessage(username:string,content:string){
    return this.hubConnection.invoke("SendMessage",{recipientUsername:username,content})
    .catch(error=>console.log(error));
  }

  deleteMessage(id:number){
    return this.http.delete(this.baseUrl+'messages/'+id);
  }
}