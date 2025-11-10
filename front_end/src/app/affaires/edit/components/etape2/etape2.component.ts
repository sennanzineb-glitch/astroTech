import { Component } from '@angular/core';
import { SharedModule } from '../../../../_globale/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MultiStepFormService } from '../../../../_services/multi-step-form.service';
import { TechnicienService } from '../../../../_services/techniciens/technicien.service';
import { ReferentsService } from '../../../../_services/referents/referents.service';
import { EquipeTechniciensService } from '../../../../_services/techniciens/equipe-techniciens.service';

@Component({
  selector: 'app-etape2',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './etape2.component.html',
  styleUrl: './etape2.component.css'
})
export class Etape2Component {

  constructor(
    private fb: FormBuilder,
    private formService: MultiStepFormService,
    private technicienService: TechnicienService,
    private referentsService: ReferentsService,
    private equipeService: EquipeTechniciensService
  ) { }

  selectedTechnicien: string = '';
  selectedType: string = 'individuel'; // par défaut
  enteredKeyword: string = '';
  keywords: string[] = [];
  form: FormGroup = new FormGroup({});
  selectedEquipe: any = null;

  referents: any = [];
  techniciens: any = [];
  equipes: any = [];

  loadTechnicien() {
    this.technicienService.getAll().subscribe(data => {
      this.techniciens = data;

    });
  }

  loadReferent() {
    this.referentsService.getAll().subscribe(data => {
      this.referents = data;
    });
  }

  loadEquipes() {
    this.equipeService.getAllEquipes().subscribe((res: any) => {
      this.equipes = res.data;
    })
  }

  ngOnInit() {
    this.form = this.fb.group({
      etatLogement: ['', Validators.required],
      referentId: new FormControl([], Validators.required),
      motsCles: new FormControl([]),
      technicienId: [''],
      equipeId: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      dureePrevueHeures: ['', Validators.required],
      dureePrevueMinutes: ['', Validators.required],
      memo: ['', Validators.required]
    });

    const savedData = this.formService.getFormData()['step2'];
    if (savedData) this.form.patchValue(savedData);

    this.form.valueChanges.subscribe(val => this.formService.setStepData('step2', val));

    this.loadTechnicien();
    this.loadReferent();
    this.loadEquipes();
  }


  onTechnicienChange(event: any): void {
    this.selectedType = event.target.value;
    this.selectedEquipe = null;
  }

  addKeyword() {
    if (this.enteredKeyword.trim() !== '') {
      this.keywords.push(this.enteredKeyword.trim());
      this.form.get('motsCles')?.setValue([...this.keywords]);
      this.enteredKeyword = '';
    }
  }

  deleteKeyword(index: number) {
    this.keywords.splice(index, 1);
    this.form.get('motsCles')?.setValue([...this.keywords]);
    this.enteredKeyword = '';
  }

  onEquipeSelect(event: any) {
    const selectedId = Number(event.target.value);
    this.selectedEquipe = this.equipes.find((eq: any) => eq.id === selectedId) || null;
  }

}
