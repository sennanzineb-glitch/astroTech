import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../_globale/shared/shared.module';
import { ReferentsService } from '../../../../_services/referents/referents.service';
import { InterventionFormService } from '../../../../_services/affaires/intervention-form.service';
import { ModalSaveComponent } from '../../../../annuaire/modal-save/modal-save.component';

@Component({
  selector: 'app-etape2',
  imports: [SharedModule],
  templateUrl: './etape2.component.html',
  styleUrl: './etape2.component.css'
})
export class Etape2Component {
  @Input() form!: FormGroup;  // Reçu du parent
  referentsList: any[] = []; // Liste des référents
  keywords: string[] = [];
  enteredKeyword: string = '';

  constructor(
    private fb: FormBuilder,
    private formService: InterventionFormService,
    private referentService: ReferentsService
  ) { }

  loadReferents() {
    this.referentService.getAll().subscribe({
      next: (res: any) => {
        this.referentsList = res || [];
      },
      error: (err) => console.error(err)
    });
  }

  ngOnInit() {
    // Charger les données enregistrées si elles existent
    const savedData = this.formService.getFormData()['step2'];
    if (savedData) {
      this.form.patchValue(savedData);
    }

    // Sauvegarde automatique des données à chaque changement
    this.form.valueChanges.subscribe(val => {
      this.formService.setStepData('step2', val);
    });

    // 🔹 Initialiser keywords depuis le FormControl mots_cles
    this.keywords = [];
    const mots = this.form.get('mots_cles')?.value;

    if (Array.isArray(mots)) {
      this.keywords = [...mots];
    }

    //liste des referents
    this.loadReferents();
  }

  saveStep() {
    if (this.form.valid) {
      this.formService.setStepData('step2', this.form.value);
      console.log('Données enregistrées :', this.form.value);
    } else {
      console.log('Formulaire invalide');
      this.form.markAllAsTouched();
    }
  }

  addKeyword() {
    if (this.enteredKeyword.trim() !== '') {
      this.keywords.push(this.enteredKeyword.trim());
      this.form.get('mots_cles')?.setValue([...this.keywords]);
      this.enteredKeyword = '';
    }
  }

  deleteKeyword(index: number) {
    this.keywords.splice(index, 1);
    this.form.get('mots_cles')?.setValue([...this.keywords]);
    this.enteredKeyword = '';
  }

}
