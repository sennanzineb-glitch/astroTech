import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterventionService } from '../../_services/affaires/intervention.service';
import { TechnicienService } from '../../_services/techniciens/technicien.service';
import { EquipeTechniciensService } from '../../_services/techniciens/equipe-techniciens.service';
import { SharedModule } from '../../_globale/shared/shared.module';

@Component({
  selector: 'app-details',
  standalone: true, // ✅ Indique que c'est un composant standalone
  imports: [
    CommonModule, // Pour *ngIf, *ngFor, pipes comme date
    FormsModule,  // Pour [(ngModel)]
    SharedModule
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  intervention: any;
  interventionId!: number;

  // Affectation
  typeAffectation: 'equipe' | 'techniciens' = 'techniciens';
  selectedEquipeId: number | null = null;
  selectedTechniciens: number[] = [];

  // Données
  equipes: any[] = [];
  techniciens: any[] = [];

  // Planning
  planning = { date: '', heure: '' };

  constructor(
    private technicienService: TechnicienService,
    private equipeTechniciensService: EquipeTechniciensService,
    private interventionService: InterventionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.interventionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadIntervention();
    this.loadTechniciens();
    this.loadEquipes();
  }

  loadIntervention() {
    this.interventionService.getItemById(this.interventionId).subscribe(res => {
      this.intervention = res;
      this.intervention.techniciens = this.intervention.techniciens || [];
      this.intervention.equipes = this.intervention.equipes || [];
    });
  }

  loadTechniciens() {
    this.technicienService.getAll().subscribe(res => {
      console.log("*** liste des techniciens ***",res);
      
      this.techniciens = res as any[]; // ✅ Assurer que c’est bien un tableau
    });
  }

  loadEquipes() {
    this.equipeTechniciensService.getAllEquipes().subscribe({
      next: (res: any) => this.equipes = res.data as any[],
      error: err => console.error('Erreur chargement équipes', err)
    });
  }

  assign() {
    if (this.typeAffectation === 'techniciens') {
      this.interventionService.assignTechniciens(this.interventionId, this.selectedTechniciens)
        .subscribe(() => {
          alert('Techniciens affectés avec succès !');  // ✅ Alerte
          this.loadIntervention();
        }, err => {
          console.error(err);
          alert('Erreur lors de l\'affectation des techniciens');
        });
    } else if (this.typeAffectation === 'equipe' && this.selectedEquipeId) {
      this.interventionService.assignEquipe(this.interventionId, this.selectedEquipeId)
        .subscribe(() => {
          alert('Équipe affectée avec succès !');  // ✅ Alerte
          this.loadIntervention();
        }, err => {
          console.error(err);
          alert('Erreur lors de l\'affectation de l\'équipe');
        });
    }
  }

  addPlanning() {
    if (!this.planning.date || !this.planning.heure) return;
    this.interventionService.addPlanning(this.interventionId, { ...this.planning })
      .subscribe(() => {
        alert('Planning ajouté avec succès');
        this.planning = { date: '', heure: '' };
        this.loadIntervention();
      });
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
        this.router.navigate(['/interventions/list']);
      },
      error: (err) => {
        console.error("Erreur lors de la suppression", err);
        alert("Erreur lors de la suppression ❌");
      }
    });
  }

  newEtat: string = '';   // valeur choisie dans le select
  updateEtat(): void {
    if (!this.newEtat) return;

    this.interventionService.updateType(this.intervention.id, this.newEtat)
      .subscribe({
        next: () => {
          this.intervention.etat = this.newEtat; // mise à jour immédiate
          this.newEtat = '';
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l’état :', err);
        }
      });
  }

  getBadgeClass(etat: string): string {
    switch (etat) {
      case 'en_cours':
        return 'bg-primary'; // bleu
      case 'terminee':
        return 'bg-success'; // vert
      case 'annulee':
        return 'bg-danger';  // rouge
      default:
        return 'bg-secondary'; // gris par défaut
    }
  }


}
