import { Component } from '@angular/core';
import { InterventionService } from '../../_services/affaires/intervention.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [SharedModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  interventions: any = [];

  constructor(
    private interventionService: InterventionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInterventions();
  }

  loadInterventions() {
    this.interventionService.getAll().subscribe({
      next: data => this.interventions = data,
      error: err => console.error(err)
    });
  }

  openDetail(id: number) {
    this.router.navigate(['/interventions/details', id]);
  }

    addIntervention() {
    this.router.navigate(['/interventions/edit']);
  }

  editIntervention(id: number) {
    this.router.navigate(['/interventions/edit', id]);
  }

}
