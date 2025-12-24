import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../../_globale/shared/shared.module';
import { MultiStepFormService } from '../../../../_services/multi-step-form.service';
import { ClientsService } from '../../../../_services/clients/clients.service';
import { ModalSaveComponent } from '../../../../annuaire/modal-save/modal-save.component';
import { lastValueFrom } from 'rxjs';
import { HabitationService } from '../../../../_services/clients/habitation.service';
import { SecteurService } from '../../../../_services/clients/secteur.service';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-etape1',
  standalone: true,
  imports: [SharedModule, ModalSaveComponent],
  templateUrl: './etape1.component.html',
  styleUrls: ['./etape1.component.css']
})
export class Etape1Component implements OnInit {

  @Input() form!: FormGroup;  // Reçu du parent
  @ViewChild('modalSave') modalSave!: ModalSaveComponent;

  clients: any[] = [];
  clientSelected: any;
  zoneSelected: any;
  typeZone: string = '';

  constructor(
    private fb: FormBuilder,
    private formService: MultiStepFormService,
    private clientsService: ClientsService,
    private habitationService: HabitationService,
    private secteurService: SecteurService
  ) { }

  ngOnInit() {
    console.log("*** Bonjour c'est la fonction ngOnInit ***");

    this.loadClients();

    if (!this.form) return;

    const clientControl = this.form.get('clientId');
    clientControl?.valueChanges
      .pipe(startWith(clientControl.value))
      .subscribe(id => {
        if (id) {
          this.getClient(id);
        }
      });

  }

  loadClients() {
    this.clientsService.getAll().subscribe(data => {
      this.clients = data;
    });
  }

  async getClient(id: number) {
    console.log("*** Bonjour c'est la fonction getClient ***");

    try {
      // Récupération du client principal
      const res: any = await lastValueFrom(this.clientsService.getRecordDetails(id));
      this.clientSelected = res.data;

      // Vérification de la zone
      const adresseClient = this.clientSelected?.adresse?.id ?? null;
      const adresseAffaire = this.form.get('adresse_id')?.value ?? null;

      if (adresseClient === adresseAffaire) {
        this.zoneSelected = this.clientSelected;
        this.typeZone = 'meme_zone';
      } else {
        this.typeZone = 'autre_zone';

        // Récupération du client à partir de client_adresse_id si différent
        const clientAdresseId = this.form.get('client_adresse_id')?.value;
        const typeClientAdresse = this.form.get('type_client_adresse')?.value;

        if (clientAdresseId) {
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
        } else {
          this.zoneSelected = null;
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du client :', error);
    }
  }

  onZoneChange(type: string) {
    this.typeZone = type;

    if (!this.clientSelected) {
      console.warn('Aucun client sélectionné');
      return;
    }

    if (!this.modalSave) {
      console.error('ModalSaveComponent non initialisé !');
      return;
    }

    if (type === 'autre_zone') {
      this.modalSave.addZoneIntervention(this.clientSelected.type_client, this.clientSelected.id);
      this.modalSave.openModal();
      this.zoneSelected = null;
    }

    if (type === 'meme_zone') {
      this.formService.formStep1.get('adresse_id')?.setValue(this.clientSelected?.adresse?.id);
      this.zoneSelected = this.clientSelected;
    }
  }

  addClient() {
    if (this.modalSave) {
      this.modalSave.openModal();
    }
  }

  saveStep() {
    if (this.form.valid) {
      this.formService.setStepData('step1', this.form.value);
    } else {
      console.warn('Formulaire invalide !');
      this.form.markAllAsTouched();
    }
  }

  onClientAdded(client: any) {
    //this.clientSelected = client;
    this.zoneSelected = client;

    if (client?.adresse?.id) {
      this.formService.formStep1.get('adresse_id')?.setValue(client.adresse.id);
      this.formService.formStep1.get('client_adresse_id')?.setValue(client.id);
      this.formService.formStep1.get('type_client_adresse')?.setValue(client.type_client);
    }
  }
}