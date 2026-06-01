import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './user.component.html'
})
export class UserComponent {
  // Plus besoin de charger fetchMe() ici, géré au niveau du parent (Sidebar)
  constructor() { }
}