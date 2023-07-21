import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { UserService } from './core/services/user.service';
import { map } from 'rxjs/operators';
import { AuthGuard } from './core/auth/auth.guard';
import { Role } from './core/models/role.model';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/auth.component').then((m) => m.AuthComponent),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/auth/auth.component').then((m) => m.AuthComponent),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: 'topic-management',
    loadComponent: () =>
      import('./features/topic-management/topic-management.component').then(
        (m) => m.TopicManagementComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [Role.Writer, Role.Admin] },
  },
  {
    path: 'article-management',
    loadComponent: () =>
      import('./features/article-management/article-management.component').then(
        (m) => m.ArticleManagementComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [Role.Writer, Role.Admin] },
  },
  {
    path: 'article/:slug',
    loadComponent: () =>
      import('./features/article/article.component').then(
        (m) => m.ArticleComponent
      ),
  },
  {
    path: 'editor',
    canActivate: [AuthGuard],
    data: { roles: [Role.Writer, Role.Admin] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/editor/editor.component').then(
            (m) => m.EditorComponent
          ),
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('./features/editor/editor.component').then(
            (m) => m.EditorComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
