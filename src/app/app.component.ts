import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isAuthRoute = false;
  loading = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuthRoute(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkAuthRoute(event.url);
      }
    });
  }

  private checkAuthRoute(url: string): void {
    this.isAuthRoute = ['/login', '/register'].some((authRoute) =>
      url.startsWith(authRoute)
    );
    this.loading = false;
  }
}
