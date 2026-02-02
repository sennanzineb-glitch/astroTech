import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Etape1Component } from '../components/etape1/etape1.component';
import { Etape2Component } from '../components/etape2/etape2.component';

import { InterventionService } from '../../../_services/affaires/intervention.service';
import { FichiersService } from '../../../_services/fichiers/fichiers.service';
import { lastValueFrom } from 'rxjs';
import { InterventionFormService } from '../../../_services/affaires/intervention-form.service';
import { AffairesService } from '../../../_services/affaires/affaires.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    Etape1Component,
    Etape2Component
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  step = 1;
  loading = false;
  isEdit = false;
  interventionId!: number;
  affaireId: number | null = null;
  formReady = false; // pour afficher les enfants après patch
  

  constructor(
    public formService: InterventionFormService,
    private interventionService: InterventionService,
    private fichiersService: FichiersService,
    private affairesService: AffairesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.formService.resetAllForms();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.interventionId = Number(id);
      await this.loadInterventionData();
    }

    const affaireIdParam = this.route.snapshot.queryParamMap.get('affaireId');
    this.affaireId = affaireIdParam ? Number(affaireIdParam) : null;
    if (this.affaireId) {
      await this.loadAffaireDataForIntervention();
    }

    this.formReady = true;
  }

  nextStep() { if (this.step < 2) this.step++; }
  previousStep() { if (this.step > 1) this.step--; }


  async loadAffaireDataForIntervention() {
    try {
      const res: any = await lastValueFrom(this.affairesService.getItemById(this.affaireId!));
      const a = res.data;
      const formatDate = (d: string | null) => d ? d.split('T')[0] : null;

      this.formService.formStep1.patchValue({
        titre: a.titre || '',
        description: a.description || '',
        client_id: a.client_id || 0,
        type_id: a.type_id || 0,
        zone_intervention_client_id: a.zone_intervention_client_id || 0,
        type_client_zone_intervention: a.type_client_zone_intervention || 'autre_zone'
      });

      this.formService.formStep2.patchValue({
        referent_ids: Array.isArray(a.referents) ? a.referents : [],
        mots_cles: a.motsCles ? a.motsCles.split(',') : [],
        date_butoir_realisation: formatDate(a.dateFin),
        date_cloture_estimee: formatDate(a.dateFin)
      });

      console.log(this.formService);


    } catch (err) {
      console.error('Erreur chargement affaire', err);
    }
  }

  async loadInterventionData() {
    try {
      const formatDate = (d: string | null) => d ? d.split('T')[0] : '';
      const res: any = await lastValueFrom(this.interventionService.getItemById(this.interventionId));
      const i = res;
      if (!i) return;

      this.formService.formStep1.patchValue({
        numero: i.numero != null ? Number(i.numero) : 0,
        titre: i.titre || '',
        type: i.type || '',
        type_id: i.type_id || 0,  
        client_id: i.client_id || 0,
        zone_intervention_client_id: i.zone_intervention_client_id || 0,
        type_client_zone_intervention: i.type_client_zone_intervention || 'autre_zone',
        description: i.description || ''
      });

      this.formService.formStep2.patchValue({
        priorite: i.priorite || '',
        referent_ids: Array.isArray(i.referent_ids) ? i.referent_ids : [],
        etat: i.etat || '',
        date_butoir_realisation: formatDate(i.date_butoir_realisation),
        date_cloture_estimee: formatDate(i.date_cloture_estimee),
        mots_cles: i.mots_cles ? i.mots_cles.split(',') : [],
        montant_intervention: i.montant_intervention || 0,
        montant_main_oeuvre: i.montant_main_oeuvre || 0,
        montant_fournitures: i.montant_fournitures || 0
      });

    } catch (err) {
      console.error('Erreur chargement intervention', err);
    }
  }

  async submit() {

    const formatDate = (d: string | null) => d ? d.split('T')[0] : null;
    const data = this.formService.getFormData();
    const all = { ...data.step1, ...data.step2 };
    

    if (!all.numero || Number(all.numero) === 0 ||
      !all.titre || all.titre.trim() === '' ||
      !all.type_id || Number(all.type_id) === 0) {
      alert("⚠️ Les champs numéro, titre et type sont obligatoires.");
      return;
    }
    
    const interventionData = {
      numero: Number(all.numero),
      titre: all.titre.trim(),
      client_id: all.client_id ? Number(all.client_id) : 0,
      type_id: all.type_id ? Number(all.type_id) : 0,  
      zone_intervention_client_id: all.zone_intervention_client_id ? Number(all.zone_intervention_client_id) : 0,
      type_client_zone_intervention: all.type_client_zone_intervention || 'autre_zone',
      description: all.description || '',
      priorite: all.priorite || '',
      referent_ids: Array.isArray(all.referent_ids) ? all.referent_ids : [],
      etat: all.etat || '',
      date_butoir_realisation: formatDate(all.date_butoir_realisation),
      date_cloture_estimee: formatDate(all.date_cloture_estimee),
      mots_cles: Array.isArray(all.mots_cles) ? all.mots_cles.join(',') : '',
      montant_intervention: Number(all.montant_intervention || 0),
      montant_main_oeuvre: Number(all.montant_main_oeuvre || 0),
      montant_fournitures: Number(all.montant_fournitures || 0)
    };

    this.loading = true;

    try {
      let interventionId = this.interventionId;
      if (!this.isEdit) {
        const res: any = await lastValueFrom(this.interventionService.create(interventionData));
        interventionId = res.data.id;
      } else {
        await lastValueFrom(this.interventionService.update(interventionId, interventionData));
      }

      this.formService.resetAllForms();
      this.router.navigate(['/interventions/details', interventionId]);

    } catch (err) {
      console.error('Erreur sauvegarde intervention', err);
      alert('Une erreur est survenue lors de la sauvegarde.');
    } finally {
      this.loading = false;
    }
  }

  annuler() {
    this.router.navigate(['/interventions/list']);
  }
}
