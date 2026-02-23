import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InterventionFormService {

  formStep1: FormGroup;
  formStep2: FormGroup;

  private formData = new BehaviorSubject<any>({});
  formData$ = this.formData.asObservable();

  constructor(private fb: FormBuilder) {

    // 🔹 Étape 1 : Informations générales de l'intervention
    this.formStep1 = this.fb.group({
      numero: [0],
      titre: [''],
      client_id: [0],   // nombre, pas tableau
      type_id: [0],              
      zone_intervention_client_id: [0],
      type_client_zone_intervention: [''],
      description: ['']
    });

    // 🔹 Étape 2 : Détails supplémentaires et financiers
    this.formStep2 = this.fb.group({
      priorite: [''],
      referent_ids: [[]],
      etat: [''],
      date_butoir_realisation: [''],
      date_cloture_estimee: [''],
      mots_cles: [[]],
      montant_intervention: [0],
      montant_main_oeuvre: [0],
      montant_fournitures: [0]
    });

    // Synchroniser automatiquement les FormGroups vers formData
    this.formStep1.valueChanges.subscribe(val => this.setStepData('step1', val));
    this.formStep2.valueChanges.subscribe(val => this.setStepData('step2', val));
  }

  /** Mettre à jour les données d'une étape */
  setStepData(step: string, data: any) {
    const current = this.formData.getValue();
    this.formData.next({ ...current, [step]: data });
  }

  /** Récupérer toutes les données du formulaire multi-step */
  getFormData() {
    return {
      step1: this.formStep1.value,
      step2: this.formStep2.value
    };
  }

  /** Réinitialiser tous les formulaires et vider le formData */
  resetAllForms() {
    this.formStep1.reset({
      numero: 0,
      titre: '',
      client_id: 0,
      type_id: 0,  
      zone_intervention_client_id: 0,
      type_client_zone_intervention: '',
      description: ''
    });

    this.formStep2.reset({
      priorite: '',
      referent_ids: [],
      etat: '',
      date_butoir_realisation: '',
      date_cloture_estimee: '',
      mots_cles: [],
      montant_intervention: 0,
      montant_main_oeuvre: 0,
      montant_fournitures: 0
    });

    this.formData.next({
      step1: {},
      step2: {}
    });
  }
}
