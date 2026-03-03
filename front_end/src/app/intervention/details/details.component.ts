import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterventionService } from '../../_services/affaires/intervention.service';
import { TechnicienService } from '../../_services/techniciens/technicien.service';
import { EquipeTechniciensService } from '../../_services/techniciens/equipe-techniciens.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { ModalSaveComponent } from '../modal-save/modal-save.component';

@Component({
  selector: 'app-details',
  standalone: true, // ✅ Indique que c'est un composant standalone
  imports: [
    CommonModule, // Pour *ngIf, *ngFor, pipes comme date
    FormsModule,  // Pour [(ngModel)]
    SharedModule,
    ModalSaveComponent
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @ViewChild('modalSave') modalSave!: ModalSaveComponent;
  @Output() clientAdded = new EventEmitter<void>();
  @Output() clientUpdated = new EventEmitter<void>();

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
    this.loadData();
  }

  loadData(){
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
        return 'bg-primary';                 // 🔵 En cours
      case 'terminee':
        return 'bg-success';                 // ✅ Terminée
      case 'annulee':
        return 'bg-danger';                  // ❌ Annulée
      case 'prevue':
        return 'bg-info';                    // 📅 Prévue
      case 'terminee_avec_interruption':
        return 'bg-warning text-dark';       // ⚠ Terminée avec interruption
      case 'terminee_avec_succes':
        return 'bg-success';                 // 🎉 Terminée avec succès
      case 'trajet_en_cours':
        return 'bg-info';                    // 🚗 Trajet en cours
      case 'pause':
        return 'bg-secondary';               // ⏸ Pause
      case 'refusee':
        return 'bg-danger';                  // ❌ Refusée
      default:
        return 'bg-secondary';               // ℹ️ Inconnu
    }
  }

  // Si tu veux afficher l'icône à côté du badge
  getEtatIcon(etat: string): string {
    switch (etat) {
      case 'en_cours': return 'mdi mdi-timer-sand';        // sablier
      case 'terminee': return 'mdi mdi-check-circle';      // check
      case 'annulee': return 'mdi mdi-close-circle';       // close
      case 'prevue': return 'mdi mdi-calendar';            // calendrier
      case 'terminee_avec_interruption': return 'mdi mdi-alert-circle'; // warning
      case 'terminee_avec_succes': return 'mdi mdi-star-circle';         // succès
      case 'trajet_en_cours': return 'mdi mdi-car';        // voiture
      case 'pause': return 'mdi mdi-pause-circle';         // pause
      case 'refusee': return 'mdi mdi-cancel';             // refus
      default: return 'mdi mdi-help-circle';               // inconnu
    }
  }


  formatEtat(etat: string | null | undefined): string {
    if (!etat) return '—';
    return etat
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
  }

  interventionItems: any = [
    { date: '12 févr. 2026 à 7:54', title: 'DÉBUT DE L’INTERVENTION', type: 'text', content: 'Bonjour tous le monde (contient text)' },
    { date: '12 févr. 2026 à 7:54', title: 'PHOTO DU NUMÉRO DE MODULE', type: 'photo', content: ['https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'] },
    { date: '12 févr. 2026 à 8:09', title: 'ZONE DE TRAVAUX DÉBARRASSÉE ?', type: 'text', content: 'Oui' },
    { date: '12 févr. 2026 à 8:09', title: 'PHOTO AVANT TRAVAUX', type: 'photo', content: ['https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D', 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'] },
    { date: '12 févr. 2026 à 8:10', title: 'MISE EN PLACE DE LA BAIGNOIRE / DOUCHE', type: 'photo', content: ['https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'] },
    { date: '12 févr. 2026 à 14:50', title: 'NETTOYAGE', type: 'text', content: 'Conforme' },
    { date: '12 févr. 2026 à 14:51', title: 'SIGNATURE', type: 'signature', content: ['https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'] },
    {
      date: '12 févr. 2026 à 14:51',
      title: 'FIN DE L’INTERVENTION',
      type: 'table',
      content: ['Intervention', 'Trajet Aller', 'Trajet Retour'],
      checked: [true, false, false]
    }
  ];


  modePlanification(intervention :any){
    if (this.modalSave) {
      this.modalSave.initializeModal(intervention);
    } else {
      console.error('ModalSaveComponent non initialisé !');
    }
  }

  editPlanning(){
    this.router.navigate(['/interventions/planning']);
  }

}
