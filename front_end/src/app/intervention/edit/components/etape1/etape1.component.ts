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
import { startWith } from 'rxjs/operators';
import { skip } from 'rxjs/operators';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
  selector: 'app-etape1',
  standalone: true,
  imports: [SharedModule, ModalSaveComponent],
  templateUrl: './etape1.component.html',
  styleUrls: ['./etape1.component.css']
})
export class Etape1Component implements OnInit {

  @Input() form!: FormGroup;

  @ViewChild('modalSave') modalSave!: ModalSaveComponent;

  clients: any[] = [];
  clientSelected: any = null;
  zoneSelected: any = null;
  typeZone: 'meme_zone' | 'autre_zone' | '' = '';

  typesIntervention: string[] = [
    'Auto-contrôle Electricité',
    'Auto-contrôle FLOCAGE',
    'Auto-contrôle Faience',
    'Auto-contrôle ISOLATION DES COMBLES',
    'Auto-contrôle Peinture',
    'Auto-contrôle Plomberie Sanitaire',
    'Auto-contrôle Plâtrerie',
    'Auto-contrôle Remplacement colonne WC',
    'Auto-contrôle SCIAGE',
    'Auto-contrôle Sol Souple',
    'Auto-contrôle VMC comble',
    'Auto-contrôle calorifuge logement',
    'Auto-contrôle carrelage hall d’entrée',
    'Auto-contrôle peinture hall d’entrée',
    'Auto-contrôle pose des MEXT',
    'Auto-contrôle réseau sous-sol rcu',
    'Auto-contrôle travaux d’électricité partie commune',
    'Auto-contrôle travaux intratone',
    'Doléance Demathieu Bard',
    'Doléances',
    'Décharge Locataire Remise Clefs',
    'Décharge responsabilité',
    'Levée de Pré OPR',
    'Opr CLIENT',
    'Pre-Opr Demathieu Bard',
    'Quitus Asservissement',
    'Quitus Bascule',
    'Quitus Carottage',
    'Quitus Carrelage hall d’entré',
    'Quitus Couverture',
    'Quitus Descente EP Balcon',
    'Quitus Désenfumage',
    'Quitus Détalonnage des portes de distribution',
    'Quitus Interphonie',
    'Quitus Mise en peinture hall d’entrée'
  ];

  constructor(
    public formService: InterventionFormService,
    private clientsService: ClientsService,
    private habitationService: HabitationService,
    private secteurService: SecteurService,
    private interventionService: InterventionService
  ) { }

  ngOnInit(): void {
    if (!this.form) {
      console.error('❌ FormGroup non reçu dans Etape1');
      return;
    }

    const numeroControl = this.form.get('numero');
    if (!numeroControl || Number(numeroControl.value) === 0) {
      // 🔹 Le control n'existe pas OU vaut 0
      this.getNextNumero();   // ⬅️ appelle ta fonction ici
    } else {
      // 🔹 Le control existe et sa valeur ≠ 0
      numeroControl.valueChanges.subscribe(val => {
        console.log('Numero changé:', val);
      });
    }


    const clientControl = this.form.get('client_id');
    clientControl?.valueChanges
      .pipe(
        map((id: number | string | null) => Number(id)), // 🔹 conversion sûre
        filter((id: number) => Number.isInteger(id) && id > 0), // 🔹 bloquer 0, null, NaN
        distinctUntilChanged() // 🔹 éviter les doublons
      )
      .subscribe((id: number) => {
        this.getClient(id);
      });
    
    //
    this.loadClients();
  }

  onClientSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const clientId = Number(value);
    if (clientId) this.getClient(clientId);
  }

  saveStep() {
    if (this.form.valid) {
      this.formService.setStepData('step1', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

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

  loadClients() {
    this.clientsService.getAll().subscribe({
      next: (data: any[]) => this.clients = data,
      error: err => console.error('Erreur chargement clients', err)
    });
  }

  async getClient(id: number) {
    try {

      if (!id || id == 0) {
        return;
      }
      else {
        const res: any = await lastValueFrom(this.clientsService.getRecordDetails(id));
        this.clientSelected = res?.data ?? null;
        if (!this.clientSelected) return;

        const adresseClient = this.clientSelected?.adresse?.id ?? null;
        const adresseForm = this.form.get('adresse_facturation_id')?.value ?? null;

        if (adresseClient && adresseClient === adresseForm) {
          this.zoneSelected = this.clientSelected;
          this.typeZone = 'meme_zone';
          return;
        }

        this.typeZone = 'autre_zone';

        const clientAdresseId = this.form.get('client_adresse_id')?.value;
        const typeClientAdresse = this.form.get('type_client_adresse')?.value;

        if (!clientAdresseId) {
          this.zoneSelected = null;
          return;
        }

        let res2: any;
        switch (typeClientAdresse) {
          case 'habitation':
            res2 = await lastValueFrom(this.habitationService.getRecordDetails(clientAdresseId));
            break;
          case 'secteur':
            res2 = await lastValueFrom(this.secteurService.getRecordDetails(clientAdresseId));
            break;
          default:
            res2 = await lastValueFrom(this.clientsService.getRecordDetails(clientAdresseId));
        }

        this.zoneSelected = res2?.data ?? null;
      }

    } catch (error) {
      console.error('Erreur lors du chargement du client', error);
    }
  }

  onZoneChange(type: 'meme_zone' | 'autre_zone') {
    this.typeZone = type;

    if (!this.clientSelected) return;

    if (type === 'meme_zone') {
      this.zoneSelected = this.clientSelected;
      this.form.patchValue({
        adresse_facturation_id: this.clientSelected?.adresse?.id ?? null,
        client_adresse_id: null,
        type_client_adresse: null
      });
    }

    if (type === 'autre_zone') {
      this.zoneSelected = null;
      this.modalSave.addZoneIntervention(
        this.clientSelected.type_client,
        this.clientSelected.id
      );
      this.modalSave.openModal();
    }
  }

  onClientAdded(client: any) {
    if (!client) return;

    this.zoneSelected = client;
    this.typeZone = 'autre_zone';

    this.form.patchValue({
      adresse_facturation_id: client.adresse?.id ?? null,
      client_adresse_id: client.id,
      type_client_adresse: client.type_client
    });
  }
}
