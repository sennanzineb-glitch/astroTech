import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../_globale/shared/shared.module';

@Component({
  selector: 'app-choix-intervention',
  imports: [SharedModule],
  templateUrl: './choix-intervention.component.html',
  styleUrl: './choix-intervention.component.css'
})
export class ChoixInterventionComponent {

 typeCreation: 'rapide' | 'affaire' | null = null;

  constructor(private router: Router) {}

  continuer() {
    if (this.typeCreation === 'rapide') {
      this.router.navigate(['/interventions/edit']);
    } else if (this.typeCreation === 'affaire') {
      this.router.navigate(['/affaires/list']);
    }
  }

}
