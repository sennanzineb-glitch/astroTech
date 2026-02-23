import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(public auth: AuthService) { }
  currentUser: any; initials:any;

  getCurrentUser() {
    this.auth.fetchMe().subscribe(result => {
      this.currentUser = result.user;
      const parts = this.currentUser.full_name.split(' ');
      this.initials = parts.map((p: string) => p[0]).join('').toUpperCase();
    });
  }



  ngOnInit(): void {
    this.getCurrentUser();
  }

}
