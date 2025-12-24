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

    // Création depuis une affaire
    const affaireIdParam = this.route.snapshot.queryParamMap.get('affaireId');
    this.affaireId = affaireIdParam ? Number(affaireIdParam) : null;

    if (this.affaireId) {
      await this.loadAffaireDataForIntervention();
    }
  }

  nextStep() { if (this.step < 2) this.step++; }
  previousStep() { if (this.step > 1) this.step--; }

  async loadAffaireDataForIntervention() {
    try {
      const res: any = await lastValueFrom(
        this.affairesService.getItemById(this.affaireId!)
      );

      const a = res.data;

      const formatDate = (d: string | null) => d ? d.split('T')[0] : null;

      // STEP 1 – Infos générales
      this.formService.formStep1.patchValue({
        titre: a.titre || '',
        description: a.description || '',
        referent_ids: Array.isArray(a.referent_ids) ? a.referent_ids : [],
        client_id: a.clientId || null,
        adresse_facturation_id: a.adresse_id || null,
        client_adresse_id: a.client_adresse_id || null,
        type_client_adresse: a.type_client_adresse || ''
      });

      // STEP 2 – Planification
      this.formService.formStep2.patchValue({
        mots_cles: a.mots_cles ? a.mots_cles.split(',') : [],
        date_butoir_realisation: formatDate(a.dateFin),
        date_cloture_estimee: formatDate(a.dateFin)
      });

    } catch (err) {
      console.error('Erreur chargement affaire', err);
    }
  }

  /** Charger les données en mode édition */
  async loadInterventionData() {

    try {
      const formatDate = (d: string | null) => d ? d.split('T')[0] : '';

      const res: any = await lastValueFrom(this.interventionService.getItemById(this.interventionId));
      const i = res;

      if (!i) return;

      // STEP 1
      this.formService.formStep1.patchValue({
        numero: i.numero != null ? Number(i.numero) : null,
        titre: i.titre || '',
        type: i.type || '',
        client_id: i.client_id || null,
        adresse_facturation_id: i.adresse_facturation_id || null,
        client_adresse_id: i.client_adresse_id || null,
        type_client_adresse: i.type_client_adresse || '',
        description: i.description || ''
      });

      // STEP 2
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

  /** Ajouter ou modifier */
  // async submit() {
  //   const formatDate = (d: string | null) => d ? d.split('T')[0] : '';

  //   const data = this.formService.getFormData();
  //   const all = { ...data.step1, ...data.step2 };

  //   const interventionData = {
  //     numero: all.numero != null ? Number(all.numero) : 0,
  //     titre: all.titre || '',
  //     type: all.type || '',
  //     client_id: all.client_id ? Number(all.client_id) : 0,
  //     adresse_facturation_id: all.adresse_facturation_id ? Number(all.adresse_facturation_id) : 0,
  //     client_adresse_id: all.client_adresse_id ? Number(all.client_adresse_id) : 0,
  //     type_client_adresse: all.type_client_adresse || '',
  //     description: all.description || '',

  //     priorite: all.priorite || '',
  //     referents: Array.isArray(all.referents) ? all.referents : [],
  //     etat: all.etat || '',
  //     date_butoir_realisation: formatDate(all.date_butoir_realisation) || null,
  //     date_cloture_estimee: formatDate(all.date_cloture_estimee) || null,
  //     mots_cles: Array.isArray(all.mots_cles) ? all.mots_cles.join(',') : '',

  //     montant_intervention: Number(all.montant_intervention || 0),
  //     montant_main_oeuvre: Number(all.montant_main_oeuvre || 0),
  //     montant_fournitures: Number(all.montant_fournitures || 0)
  //   };

  //   this.loading = true;

  //   try {
  //     let interventionId = this.interventionId;

  //     if (!this.isEdit) {
  //       const res: any = await lastValueFrom(this.interventionService.create(interventionData));
  //       interventionId = res.data.id;
  //     } else {
  //       await lastValueFrom(this.interventionService.update(interventionId, interventionData));
  //     }

  //     this.formService.resetAllForms();
  //     this.router.navigate(['/interventions/details', interventionId]);

  //   } catch (err) {
  //     console.error('Erreur sauvegarde intervention', err);
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  async submit() {
    const formatDate = (d: string | null) => d ? d.split('T')[0] : null;

    const data = this.formService.getFormData();
    const all = { ...data.step1, ...data.step2 };

    // 🔴 VALIDATION OBLIGATOIRE
    if (
      !all.numero || Number(all.numero) === 0 ||
      !all.titre || all.titre.trim() === '' ||
      !all.type || all.type.trim() === ''
      //!all.adresse_facturation_id || all.adresse_facturation_id.trim() === '' || 
      //!all.client_adresse_id || all.client_adresse_id.trim() === '' ||
      //!all.description || all.description.trim() === ''
    ) {
      alert("⚠️ Les champs numéro, titre, type, adresse de facturation, zone d’intervention et description sont obligatoires.");
      return; // ⛔ STOP
    }

    const interventionData = {
      numero: Number(all.numero),
      titre: all.titre.trim(),
      type: all.type.trim(),
      client_id: all.client_id ? Number(all.client_id) : null,
      adresse_facturation_id: all.adresse_facturation_id ? Number(all.adresse_facturation_id) : null,
      client_adresse_id: all.client_adresse_id ? Number(all.client_adresse_id) : null,
      type_client_adresse: all.type_client_adresse || null,
      description: all.description || null,

      priorite: all.priorite || null,
      referents: Array.isArray(all.referents) ? all.referents : [],
      etat: all.etat || null,
      date_butoir_realisation: formatDate(all.date_butoir_realisation),
      date_cloture_estimee: formatDate(all.date_cloture_estimee),
      mots_cles: Array.isArray(all.mots_cles) ? all.mots_cles.join(',') : null,

      montant_intervention: Number(all.montant_intervention || 0),
      montant_main_oeuvre: Number(all.montant_main_oeuvre || 0),
      montant_fournitures: Number(all.montant_fournitures || 0)
    };

    this.loading = true;

    try {
      let interventionId = this.interventionId;

      if (!this.isEdit) {
        console.log("Bonjour c'est l'ajout d'une intervention !");
        
        const res: any = await lastValueFrom(
          this.interventionService.create(interventionData)
        );
        interventionId = res.data.id;
      } else {
        console.log("Bonjour c'est la modification d'une nouveau intervention !");
        
        await lastValueFrom(
          this.interventionService.update(interventionId, interventionData)
        );
      }

      this.formService.resetAllForms();
      this.router.navigate(['/interventions/details', interventionId]);

    } catch (err) {
      console.error('Erreur sauvegarde intervention', err);
      alert('Une erreur est survenue lors de la sauvegarde.');
    } finally {
      this.loading = false;
    }


    //console.log(this.isEdit);
    
  }

}
