import { Message } from './../../_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from './../../_services/presence.service';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],

})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;
  message: Message[];
  count: number=10;
  constructor(private memberService: MembersService,
    private toastr: ToastrService, public presence: PresenceService, private messageService: MessageService) { }

  ngOnInit(): void {
    
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success('You have liked ' + member.username);
    })
  }

  getCountUnreadMessage(username:string){
    this.messageService.getMessageThread(username).subscribe(message => {
      this.message = message;
      this.count = 10;
      return 10;
    })
  }
}
