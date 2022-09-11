import { AccountService } from './../_services/account.service';
import { Directive, TemplateRef, ViewContainerRef, OnInit, Input } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole:string[];
  user:User;
  
  constructor(private viewContainrRef:ViewContainerRef, private templateRef:TemplateRef<any>
    ,private accountService:AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user=>{
        this.user=user;
      })
     }
  ngOnInit(): void {
    if(!this.user?.roles || this.user==null){
      this.viewContainrRef.clear();
      return;
    }
    if(this.user?.roles.some(r=> this.appHasRole.includes(r))){
      this.viewContainrRef.createEmbeddedView(this.templateRef);
    }
  }
}
