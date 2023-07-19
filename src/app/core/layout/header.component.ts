import { Component, inject } from '@angular/core';
// import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { ShowAuthedDirective } from '../../shared/show-authed.directive';

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
  ],
  standalone: true,
})
export class HeaderComponent {
  // currentUser$ = inject(UserService).currentUser;
}
