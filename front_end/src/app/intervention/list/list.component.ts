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

deleteIntervention(id: number) {
  if (!id) {
    console.error("ID invalide");
    return;
  }

  const confirmation = confirm("Voulez-vous vraiment supprimer cette intervention ?");
  if (!confirmation) return;

  this.interventionService.delete(id).subscribe({
    next: () => {
      alert("Intervention supprimée avec succès ✅");

      // 🔄 Recharger la liste des interventions
      this.loadInterventions();
    },
    error: (err) => {
      console.error("Erreur lors de la suppression", err);
      alert("Erreur lors de la suppression ❌");
    }
  });
}


}
