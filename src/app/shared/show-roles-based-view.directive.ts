import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from '../core/services/user.service';

@Directive({
  selector: '[appShowRoleBasedView]',
  standalone: true,
})
export class ShowRoleBasedViewDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef
  ) {}

  roles: string = '';

  ngOnInit() {
    const user = this.userService.userValue;
    if (user) {
      if (this.roles.includes(user.role)) {
        if (this.viewContainer.length === 0) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      }
    } else {
      this.viewContainer.clear();
    }
  }

  @Input() set appShowRoleBasedView(roles: string) {
    this.roles = roles;
  }
}
