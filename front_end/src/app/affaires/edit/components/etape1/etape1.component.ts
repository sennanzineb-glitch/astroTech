import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SharedModule } from '../../../../_globale/shared/shared.module';
import { ModalSaveComponent } from '../../../../annuaire/modal-save/modal-save.component';
import { ClientsService } from '../../../../_services/clients/clients.service';
import { HabitationService } from '../../../../_services/clients/habitation.service';
import { SecteurService } from '../../../../_services/clients/secteur.service';
import { MultiStepFormService } from '../../../../_services/multi-step-form.service';
import { InterventionService } from '../../../../_services/affaires/intervention.service';

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

  constructor(
    private formService: MultiStepFormService,
    private clientsService: ClientsService,
    private habitationService: HabitationService,
    private secteurService: SecteurService,
    private interventionService: InterventionService
  ) { }

  ngOnInit(): void {
    this.loadClients();

    if (!this.form) return;
  }


  /** Charger tous les clients */
  loadClients() {
    this.clientsService.getAll().subscribe({
      next: (data: any[]) => this.clients = data,
      error: err => console.error('Erreur chargement clients', err)
    });
  }

  /** Charger les données depuis le FormGroup (client_id) */
  async loadData() {
    if (!this.form) return;

    const clientId = this.form.get('client_id')?.value;
    if (clientId && clientId !== 0) {
      await this.getClient(clientId);
    }
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
      } else if (zoneClientId != null && zoneClientId !== clientId) {
        this.typeZone = 'autre_zone';
        switch (typeClientZone) {
          case 'habitation': {
            const res = await lastValueFrom(
              this.habitationService.getRecordDetails(zoneClientId)
            );
            this.zoneSelected = res?.data ?? null;
            break;
          }

          case 'secteur': {
            const res = await lastValueFrom(
              this.secteurService.getRecordDetails(zoneClientId)
            );
            this.zoneSelected = res ?? null;
            break;
          }

          default: {
            const res = await lastValueFrom(
              this.clientsService.getRecordDetails(zoneClientId)
            );
            this.zoneSelected = res?.data ?? null;
          }
        }

      
      
    

    } else {
      this.zoneSelected = null;
      this.typeZone = '';
    }
  } catch(error) {
    console.error('Erreur lors du chargement du client', error);
  }

}

/** Sélection d'un client dans le select */
onClientSelect(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  const clientId = Number(value);
  if (clientId) this.getClient(clientId);
}

/** Changer la zone d’intervention */
onZoneChange(type: 'meme_zone' | 'autre_zone') {
  this.typeZone = type;
  if (!this.clientSelected) return;

  if (type === 'meme_zone') {
    this.zoneSelected = this.clientSelected;
    this.form.patchValue({
      zone_intervention_client_id: this.clientSelected.id,
      type_client_zone_intervention: 'client'
    });
  }

  if (type === 'autre_zone' && this.modalSave) {
    this.zoneSelected = null;
    this.modalSave.addZoneIntervention(this.clientSelected.type_client, this.clientSelected.client_id);
    this.modalSave.openModal();
  }
}

/** Ajouter un client depuis le modal */
onClientAdded(client: any) {
  if (!client) return;
  this.zoneSelected = client;
  this.typeZone = 'autre_zone';
  this.form.patchValue({
    zone_intervention_client_id: client.id ?? null,
    type_client_zone_intervention: client.type_client
  });
}

/** Sauvegarder l’étape */
saveStep() {
  if (this.form.valid) {
    this.formService.setStepData('step1', this.form.value);
  } else {
    this.form.markAllAsTouched();
    console.warn('Formulaire invalide');
  }
}

/** Ouvrir le modal pour ajouter un client */
addClient() {
  if (this.modalSave) {
    this.modalSave.openModal();
  } else {
    console.warn('ModalSaveComponent non initialisé !');
  }
}


}
