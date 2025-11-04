import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../_globale/shared/shared.module';
import { MultiStepFormService } from '../../../../_services/multi-step-form.service';
import { ClientsService } from '../../../../_services/clients/clients.service';

@Component({
  selector: 'app-etape1',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './etape1.component.html',
  styleUrl: './etape1.component.css'
})
export class Etape1Component {

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder, 
    private formService: MultiStepFormService,
    private clientsService:ClientsService
  ) {}

  form: FormGroup = new FormGroup({});
  selectedZone: string = '';
  //clientId:Number | null = null;
  clients: any[] = [];
  clientSelected:any;

  loadClients() {
    this.clientsService.getAll().subscribe(data => {
      this.clients = data;
    });
  }

  onClientChange(event: Event) {
    let clientId = Number((event.target as HTMLSelectElement).value);
    this.clientsService.getRecordDetails(clientId).subscribe(res =>{
      this.clientSelected =res.data;
      console.log(this.clientSelected);
    })
  }

  open(content: any) {
    this.modalService.open(content);
    this.selectedZone = "";
  }

  onZoneChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedZone = value;
  }

  ngOnInit() {
    this.form = this.fb.group({
      reference: ['', Validators.required],
      titre: ['', Validators.required],
      clientId: ['', Validators.required],
      zoneIntervention: ['', Validators.required],
      description: ['', Validators.required]
    });

    const savedData = this.formService.getFormData()['step1'];
    if (savedData) this.form.patchValue(savedData);

    this.form.valueChanges.subscribe(val => this.formService.setStepData('step1', val));

    // Charger la liste des clients au démarrage
    this.loadClients();
  }

  saveStep() {
    if (this.form.valid) this.formService.setStepData('step1', this.form.value);
  }

}
