import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InterventionService } from '../../_services/affaires/intervention.service';
import { EquipeTechniciensService } from '../../_services/techniciens/equipe-techniciens.service';
import { TechnicienService } from '../../_services/techniciens/technicien.service';
import { PlanningService } from '../../_services/affaires/planning.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { SharedModule } from '../../_globale/shared/shared.module';

@Component({
  selector: 'app-modal-save',
  imports: [SharedModule],
  templateUrl: './modal-save.component.html',
  styleUrls: ['./modal-save.component.css'] // correction typo styleUrls
})
export class ModalSaveComponent {
  @Output() clientAdded = new EventEmitter<any>();
  modalInstance: any;

  quickActions = [
    { action: 'date', title: 'Planifier une date', description: 'Choisir une date prévisionnelle', icon: 'fa fa-calendar' },
    { action: 'tech', title: 'Affecter technicien', description: 'Ajouter un technicien ou une équipe', icon: 'fa fa-users' },
    { action: 'planning', title: 'Ajouter au planning', description: 'Programmer l’intervention', icon: 'fa fa-map' },
    { action: 'etat', title: 'Modifier l’état', description: 'Mettre à jour l’état', icon: 'fa fa-edit' },
  ];

  selectedAction: string | null = null;
  intervention: any;

  // ==== Formulaire Date prévisionnelle ====
  formPrevision = {
    date_debut_prevue: '',
    date_fin_prevue: '',
    heures: 0,
    minutes: 0
  };
  previsionAjoutee: any = null;

  // ==== Affectation techniciens ====
  typeAffectation: 'equipe' | 'techniciens' | null = null;
  equipes: any[] = [];
  techniciens: any[] = [];
  selectedEquipeId: number | null = null;
  selectedTechniciens: number[] = [];
  affectationResult: any = null;

  // ==== Planning ====
  planning: any = {
    dateDebut: '',
    dateFin: '',
    heureDebutH: null,
    heureDebutM: null,
    heureFinH: null,
    heureFinM: null,
    tempsTrajetEstimeH: null,
    tempsTrajetEstimeMin: null
  };
  planningAjoute: any = null;

  // ==== Modification état ====
  etat: string = '';

  constructor(
    private interventionService: InterventionService,
    private equipeTechniciensService: EquipeTechniciensService,
    private technicienService: TechnicienService,
    private planningService: PlanningService
  ) {
    this.loadEquipes();
    this.loadTechniciens();
  }

  // ======================= ACTIONS =======================
  selectAction(action: string) {
    this.selectedAction = action;
    //this.previsionAjoutee = null;
    //this.affectationResult = null;
    //this.planningAjoute = null;
  }

  annuler() {
    this.selectedAction = null;
    this.formPrevision = { date_debut_prevue: '', date_fin_prevue: '', heures: 0, minutes: 0 };
    this.typeAffectation = null;
    this.selectedEquipeId = null;
    this.selectedTechniciens = [];
    //this.etat = '';
  }

  // ===================== DATE PREVISIONNELLE =====================
  validerPrevision() {
    if (!this.formPrevision.date_debut_prevue) {
      alert('Veuillez saisir la date de début prévue');
      return;
    }

    const payload = {
      date_debut: this.formPrevision.date_debut_prevue,
      date_fin: this.formPrevision.date_fin_prevue,
      duree_heures: this.formPrevision.heures,
      duree_minutes: this.formPrevision.minutes
    };

    this.interventionService.addPrevision(this.intervention.id, payload)
      .subscribe({
        next: (res: any) => {
          alert('Date prévisionnelle ajoutée avec succès !');
          this.previsionAjoutee = { ...payload };
          this.clientAdded.emit();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l’ajout de la date prévisionnelle');
        }
      });
  }

  // ===================== PLANNING =====================
  addPlanning() {
    if (!this.planning.dateDebut) {
      alert('La date de début est obligatoire !');
      return;
    }

    const heureDebutH = Number(this.planning.heureDebutH) || 0;
    const heureDebutM = Number(this.planning.heureDebutM) || 0;
    const heureFinH = Number(this.planning.heureFinH) || 0;
    const heureFinM = Number(this.planning.heureFinM) || 0;

    const dateDebut = new Date(this.planning.dateDebut);
    const dateFin = this.planning.dateFin ? new Date(this.planning.dateFin) : dateDebut;

    const payload = {
      date_debut_intervention: dateDebut.toISOString().split('T')[0],
      heure_debut_intervention_h: heureDebutH,
      heure_debut_intervention_min: heureDebutM,
      date_fin_intervention: dateFin.toISOString().split('T')[0],
      heure_fin_intervention_h: heureFinH,
      heure_fin_intervention_min: heureFinM,
      temps_trajet_estime_heures: Number(this.planning.tempsTrajetEstimeH) || 0,
      temps_trajet_estime_minutes: Number(this.planning.tempsTrajetEstimeMin) || 0
    };

    this.planningService.addPlanning(this.intervention.id, payload)
      .subscribe({
        next: () => {
          this.planningAjoute = payload;
          alert('Planning ajouté avec succès !');
          this.clientAdded.emit();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l’ajout du planning');
        }
      });
  }

  // ===================== MODIFICATION ETAT =====================
  updateEtat(): void {
    if (!this.etat) {
      alert('Veuillez sélectionner un état avant de valider.');
      return;
    }

    this.interventionService.updateType(this.intervention.id, this.etat)
      .subscribe({
        next: () => {
          this.intervention.etat = this.etat; // mise à jour immédiate côté UI
          alert(`L'état a bien été modifié en "${this.etat}" !`);
          this.clientAdded.emit();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l’état :', err);
          alert('Erreur lors de la mise à jour de l’état. Veuillez réessayer.');
        }
      });
  }

  // ===================== UTILS =====================
  getBadgeClass(etat: string) {
    switch (etat) {
      case 'annulee': return 'bg-danger text-white';
      case 'en_cours': return 'bg-warning text-dark';
      case 'prevue': return 'bg-info text-dark';
      case 'terminee_avec_interruption': return 'bg-secondary text-white';
      case 'terminee_avec_succes': return 'bg-success text-white';
      case 'trajet_en_cours': return 'bg-primary text-white';
      case 'pause': return 'bg-muted text-dark';
      case 'refusee': return 'bg-dark text-white';
      default: return 'bg-light text-dark';
    }
  }

  formatEtat(etat: string) {
    return etat?.replace(/_/g, ' ') || '';
  }

  handleQuickAction(action: string) {
    console.log('Action déclenchée :', action);
  }

  loadTechniciens() {
    this.technicienService.getAll().subscribe(res => {
      this.techniciens = res;
    });
  }

  loadEquipes() {
    this.equipeTechniciensService.getAllEquipes().subscribe({
      next: (res: any) => this.equipes = res.data || [],
      error: err => console.error('Erreur chargement équipes', err)
    });
  }

  assign() {
    if (this.typeAffectation === 'techniciens') {
      this.interventionService.assignTechniciens(this.intervention.id, this.selectedTechniciens)
        .subscribe(() => {
          alert('Techniciens affectés avec succès !');
          const techniciensAffectes = this.techniciens
            .filter(t => this.selectedTechniciens.includes(t.id))
            .map(t => ({ nom: t.nom, prenom: t.prenom }));

          this.affectationResult = {
            type: 'techniciens',
            techniciens: techniciensAffectes
          };

          this.clientAdded.emit();
        }, err => {
          console.error(err);
          alert('Erreur lors de l\'affectation des techniciens');
        });
    } else if (this.typeAffectation === 'equipe' && this.selectedEquipeId) {
      this.interventionService.assignEquipe(this.intervention.id, this.selectedEquipeId)
        .subscribe(() => {
          alert('Équipe affectée avec succès !');
          const equipe = this.equipes.find(e => e.id === this.selectedEquipeId);
          this.affectationResult = {
            type: 'equipe',
            equipe: equipe
          };
          this.clientAdded.emit();
        }, err => {
          console.error(err);
          alert('Erreur lors de l\'affectation de l\'équipe');
        });
    }
  }


  initializeModal(intervention: any) {
    this.intervention = intervention;
    //*** Prevision ***
    this.loadPrevision(intervention);
    //*** Planning ***
    this.loadPlanning(intervention);
    /*** Etat ***/
    this.etat = intervention.etat;
    /*** Affectation ***/
    this.loadAffectation(intervention);

    this.openModal();
  }

  loadPrevision(intervention: any) {
    if (!intervention) return;

    const formatDate = (d: string | null) => d ? d.split('T')[0] : null;
    this.formPrevision = {
      date_debut_prevue: formatDate(intervention.date_debut_prevue) || '',
      date_fin_prevue: formatDate(intervention.date_fin_prevue) || '',
      heures: intervention.duree_prevue_heures || 0,
      minutes: intervention.duree_prevue_minutes || 0
    };
    this.previsionAjoutee = {
      date_debut: this.formPrevision.date_debut_prevue,
      date_fin: this.formPrevision.date_fin_prevue,
      duree_heures: this.formPrevision.heures,
      duree_minutes: this.formPrevision.minutes
    };
  }

  loadPlanning(intervention: any) {
    if (!intervention) return;
    const formatDate = (d: string | null) => d ? d.split('T')[0] : null;
    this.planningAjoute = this.planning = {
      date_debut_intervention: formatDate(intervention.date_debut_intervention),
      heure_debut_intervention_h: intervention.heure_debut_intervention_h,
      heure_debut_intervention_min: intervention.heure_debut_intervention_min,
      date_fin_intervention: formatDate(intervention.date_fin_intervention),
      heure_fin_intervention_h: intervention.heure_fin_intervention_h,
      heure_fin_intervention_min: intervention.heure_fin_intervention_min,
      temps_trajet_estime_heures: Number(intervention.temps_trajet_estime_heures) || 0,
      temps_trajet_estime_minutes: Number(intervention.temps_trajet_estime_minutes) || 0
    };

    // Obtenir la date d'aujourd'hui
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    this.planning = {
      dateDebut: formatDate(intervention.date_debut_intervention) ?? todayFormatted,
      dateFin: formatDate(intervention.date_fin_intervention) ?? todayFormatted,
      heureDebutH: intervention.heure_debut_intervention_h,
      heureDebutM: intervention.heure_debut_intervention_min,
      heureFinH: intervention.heure_fin_intervention_h,
      heureFinM: intervention.heure_fin_intervention_min,
      tempsTrajetEstimeH: Number(intervention.temps_trajet_estime_heures) || 0,
      tempsTrajetEstimeMin: Number(intervention.temps_trajet_estime_minutes) || 0
    };
  }

 loadAffectation(intervention: any) {

  if (!intervention) return;

  // 🔵 CAS 1 : Équipe affectée
  if (intervention.equipe_id) {

    this.typeAffectation = 'equipe';
    this.selectedEquipeId = intervention.equipe_id;
    this.selectedTechniciens = [];

    // Trouver l’équipe complète dans la liste equipes[]
    const equipeTrouvee = this.equipes.find(
      (e: any) => e.id === intervention.equipe_id
    );

    this.affectationResult = {
      type: 'equipe',
      equipe: equipeTrouvee || { nom: 'Équipe #' + intervention.equipe_id }
    };
  }

  // 🔵 CAS 2 : Techniciens affectés
  else if (intervention.techniciens && intervention.techniciens.length > 0) {

    this.typeAffectation = 'techniciens';
    this.selectedTechniciens = intervention.techniciens.map((t: any) => t.id);
    this.selectedEquipeId = null;

    this.affectationResult = {
      type: 'techniciens',
      techniciens: intervention.techniciens
    };
  }

  // 🔵 CAS 3 : Aucun affectation
  else {
    this.typeAffectation = null;
    this.selectedEquipeId = null;
    this.selectedTechniciens = [];
    this.affectationResult = null;
  }
}


  openModal() {
    const modalEl = document.getElementById('saveModal');
    if (modalEl) this.modalInstance = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
    this.modalInstance.show();
  }





}
