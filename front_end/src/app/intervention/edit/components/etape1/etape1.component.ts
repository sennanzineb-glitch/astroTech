import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SharedModule } from '../../../../_globale/shared/shared.module';
import { ModalSaveComponent } from '../../../../annuaire/modal-save/modal-save.component';
import { ClientsService } from '../../../../_services/clients/clients.service';
import { HabitationService } from '../../../../_services/clients/habitation.service';
import { SecteurService } from '../../../../_services/clients/secteur.service';
import { InterventionService } from '../../../../_services/affaires/intervention.service';
import { InterventionFormService } from '../../../../_services/affaires/intervention-form.service';
import { AdressesService } from '../../../../_services/clients/adresses.service';

@Component({
  selector: 'app-etape1',
  standalone: true,
  imports: [SharedModule, ModalSaveComponent],
  templateUrl: './etape1.component.html',
  styleUrls: ['./etape1.component.css']
})
export class Etape1Component implements OnInit {

  private _form!: FormGroup;

  @Input()
  set form(fg: FormGroup) {
    if (fg) {
      this._form = fg;
      this.loadData();
    }
  }

  get form(): FormGroup {
    return this._form;
  }

  @ViewChild('modalSave') modalSave!: ModalSaveComponent;

  clients: any[] = [];
  clientSelected: any = null;
  zoneSelected: any = null;
  typeZone: 'meme_zone' | 'autre_zone' | '' = '';
  interventionTypes:any = [];

  constructor(
    public formService: InterventionFormService,
    private clientsService: ClientsService,
    private habitationService: HabitationService,
    private secteurService: SecteurService,
    private interventionService: InterventionService
  ) { }

  ngOnInit(): void {
    this.loadClients();
    this.loadTypes();
  }

  /** Charger les données depuis le FormGroup (client_id) */
  async loadData() {
    if (!this.form) return;

    const clientId = this.form.get('client_id')?.value;
    if (clientId && clientId !== 0) {
      await this.getClient(clientId);
    }

    const numero = this._form.get('numero')?.value;
    if (numero === 0 || !numero) this.getNextNumero();
  }

 
  async loadTypes(){
    this.interventionService.getInterventionTypes().subscribe({
      next: (res: any) => {
        this.interventionTypes = res.data;
      },
      error: (err) => {
        console.error('Erreur chargement types', err);
      }
    });
  }

  /** Sélection d'un client dans le select */
  onClientSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const clientId = Number(value);
    if (clientId) this.getClient(clientId);
  }

  /** Sauvegarder l'étape dans le service */
  saveStep() {
    if (this.form.valid) {
      this.formService.setStepData('step1', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  /** Récupérer le prochain numéro */
  getNextNumero() {
    this.interventionService.getNextNumero().subscribe({
      next: (res: any) => {
        if (res?.nextNumero) {
          this.form.get('numero')?.setValue(res.nextNumero);
        }
      },
      error: err => console.error('Erreur récupération numéro', err)
    });
  }

  /** Charger tous les clients */
  loadClients() {
    this.clientsService.getAll().subscribe({
      next: (data: any[]) => this.clients = data,
      error: err => console.error('Erreur chargement clients', err)
    });
  }

  /** Charger un client et sa zone */
  async getClient(id: number) {
    if (!id || id === 0) return;

    try {
      const res: any = await lastValueFrom(this.clientsService.getRecordDetails(id));
      this.clientSelected = res?.data ?? null;
      if (!this.clientSelected) return;

      //const clientId = this.clientSelected?.adresse?.id ?? null;
      const clientId = this.clientSelected?.id ?? null;
      const zoneClientId = this.form.get('zone_intervention_client_id')?.value ?? null;
      const typeClientZone = this.form.get('type_client_zone_intervention')?.value;
      
      if (clientId === zoneClientId) {
        this.zoneSelected = this.clientSelected;
        this.typeZone = 'meme_zone';
        return;
      }
      else if (zoneClientId != null && zoneClientId !== clientId) {
        
        this.typeZone = 'autre_zone';

        let res2: any;
        switch (typeClientZone) {
          case 'habitation':
            res2 = await lastValueFrom(this.habitationService.getRecordDetails(zoneClientId));
            break;
          case 'secteur':
            res2 = await lastValueFrom(this.secteurService.getRecordDetails(zoneClientId));
            break;
          default:
            res2 = await lastValueFrom(this.clientsService.getRecordDetails(zoneClientId));
        }
        this.zoneSelected = res2?.data ?? null;
      }
      else{
        this.zoneSelected = null;
        return;
      }

    } catch (error) {
      console.error('Erreur lors du chargement du client', error);
    }
  }

  /** Changer la zone d'intervention */
  onZoneChange(type: 'meme_zone' | 'autre_zone') {
    this.typeZone = type;

    if (!this.clientSelected) return;

    if (type === 'meme_zone') {
      this.zoneSelected = this.clientSelected;
      this.form.patchValue({
        zone_intervention_client_id: this.clientSelected?.id ?? null,
        type_client_zone_intervention: 'client'
      });
    }

    if (type === 'autre_zone') {
      this.zoneSelected = null;
      this.modalSave.addZoneIntervention(
        this.clientSelected.type_client,
        this.clientSelected.client_id
      );
      this.modalSave.openModal();
    }
  }

  /** Ajouter un client depuis le modal */
  onClientAdded(client: any) {
    if (!client) return;

    this.zoneSelected = client;
    this.typeZone = 'autre_zone';

    // this.form.patchValue({
    //   adresse_facturation_id: client.adresse?.id ?? null,
    //   client_adresse_id: client.id,
    //   type_client_adresse: client.type_client
    // });

    this.form.patchValue({
      zone_intervention_client_id: client.id ?? null,
      type_client_zone_intervention: client.type_client
    });
  }
}