import { Component, OnInit, inject } from '@angular/core';
// import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { ShowAuthedDirective } from '../../shared/show-authed.directive';
import { UserService } from '../services/user.service';
import { ShowRoleBasedViewDirective } from 'src/app/shared/show-roles-based-view.directive';
import { Role } from '../models/role.model';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    ShowAuthedDirective,
    ShowRoleBasedViewDirective,
  ],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  // currentUser$ = inject(UserService).currentUser;
  constructor(private userService: UserService) {}

  adminRoles: string[] = [Role.Admin, Role.Writer];
  userRole: string = '';

  ngOnInit(): void {
    this.userService.currentUser.subscribe({
      next: (user) => {
        if (user) {
          this.userRole = user.role;
        }
      },
    });
  }

  logOut() {
    this.userService.logout();
  }
}
