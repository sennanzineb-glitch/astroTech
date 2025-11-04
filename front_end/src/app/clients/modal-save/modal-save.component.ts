import { Component, Renderer2, EventEmitter, Output } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { SharedModule } from '../../_globale/shared/shared.module';
import { ClientsService } from '../../_services/clients/clients.service';
import { AdressesService } from '../../_services/clients/adresses.service';
import { AdresseEmailService } from '../../_services/clients/adresse-email.service';
import { AgencesService } from '../../_services/clients/agences.service';
import { ContactsService } from '../../_services/clients/contacts.service';
import { NumTelService } from '../../_services/clients/num-tel.service';
import { OrganisationsService } from '../../_services/clients/organisations.service';
import { ParticuliersService } from '../../_services/clients/particuliers.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-modal-save',
  imports: [SharedModule],
  templateUrl: './modal-save.component.html',
  styleUrls: ['./modal-save.component.css']
})
export class ModalSaveComponent {

  @Output() clientAdded: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private clientsService: ClientsService,
    private adressesService: AdressesService,
    private adresseEmailService: AdresseEmailService,
    private agencesService: AgencesService,
    private contactsService: ContactsService,
    private numTelService: NumTelService,
    private organisationsService: OrganisationsService,
    private particuliersService: ParticuliersService,
    private renderer: Renderer2
  ) {
    this.addItem('tous');
  }

  // les variables
  singleAdresse: any = { id: null, adresse: null, codePostal: null, ville: null, province: null, pays: null, etage: null, appartementLocal: null, batiment: null, interphoneDigicode: null, escalier: null, porteEntree: null };
  singleClient: any = { id: null, numero: null, compte: null };
  singleParticulier: any = { id: null, nomComplet: null, email: null, telephone: null, idAdresse: null, idClient: null };
  singleAgence: any = { id: null, idClient: null, nomAgence: null, idAdresse: null };
  singleOrganisation: any = { id: null, idClient: null, nomEntreprise: null };

  singleContact: any = { id: null, nomComplet: null, poste: null, dateDu: null, dateAu: null, memoNote: null, idClient: null, listEmails: [], listTels: [] };
  singleAdresseEmail: any = { id: null, email: null, type: 'personnel', idContact: null };
  singleNumTel: any = { id: null, tel: null, type: 'personnel', idContact: null };

  typeClient: string = 'organisation';
  listContacts: any[] = [];
  listEmails: any[] = [];
  listTels: any[] = [];

  isFirstVisible = false;
  isContactValidate = true;

  addItem(type: string) {
    if (type === 'tous') {
      this.listEmails.push({ ...this.singleAdresseEmail });
      this.listTels.push({ ...this.singleNumTel });
    } else if (type === 'email') {
      this.listEmails.push({ ...this.singleAdresseEmail });
    } else {
      this.listTels.push({ ...this.singleNumTel });
    }
  }

  removeItem(type: string, index: number) {
    if (type === 'email') this.listEmails.splice(index, 1);
    else if (type === 'tel') this.listTels.splice(index, 1);
    else this.listContacts.splice(index, 1);
  }

  save() {
    this.truncateFields();

    this.clientsService.create(this.singleClient).subscribe(result => {
      this.singleClient.id = result.data.id;

      // Your existing logic
      if (this.typeClient === 'organisation') {
        this.singleOrganisation.idClient = this.singleClient.id;
        this.organisationsService.create(this.singleOrganisation).subscribe(res => {
          this.singleOrganisation.id = res.data.id;
        });
      } else if (this.typeClient === 'particulier') {
        this.singleParticulier.idClient = this.singleClient.id;
        this.adressesService.create(this.singleAdresse).subscribe(res => {
          this.singleParticulier.idAdresse = res.data.id;
          this.particuliersService.create(this.singleParticulier).subscribe(res => {
            this.singleParticulier.id = res.data.id;
          });
        });
      } else {
        this.singleAgence.idClient = this.singleClient.id;
        this.adressesService.create(this.singleAdresse).subscribe(res => {
          this.singleAgence.idAdresse = res.data.id;
          this.agencesService.create(this.singleAgence).subscribe(res => {
            this.singleAgence.id = res.data.id;
          });
        });
      }

      this.saveAllContacts(result.data.id);

      // Emit event to parent
      this.clientAdded.emit();

      // Close the modal
      const modalEl = document.getElementById('saveModal');
      if (modalEl) {
        const modalInstance =
          bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
      }

      // ✅ Remove remaining backdrop manually
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // ✅ Also remove body class if still present
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');

      this.clear();
    });
  }


  toggleDiv() {
    this.isFirstVisible = !this.isFirstVisible;
  }

  addContact() {
    if (this.singleContact.nomComplet && this.singleContact.poste) {
      this.listContacts.push({
        ...this.singleContact,
        listEmails: [...this.listEmails],
        listTels: [...this.listTels]
      });
      this.toggleDiv();
      this.clearContact();
      this.isContactValidate = true;
    } else this.isContactValidate = false;
  }

  async saveAllContacts(idClient: number) {
    for (const contact of this.listContacts) {
      contact.idClient = idClient;
      try {
        const result: any = await lastValueFrom(this.contactsService.create(contact));
        contact.id = result.data.id;
        await this.saveAllEmails([...contact.listEmails], contact.idClient, contact.id);
        await this.saveAllTels([...contact.listTels], contact.idClient, contact.id);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async saveAllEmails(emails: any[], idClient: number, idContact: number) {
    for (const email of emails) {
      email.idClient = idClient;
      email.idContact = idContact;
      try { await lastValueFrom(this.adresseEmailService.create(email)); }
      catch (err) { console.error(err); }
    }
  }

  async saveAllTels(listTels: any[], idClient: number, idContact: number) {
    for (const tel of listTels) {
      tel.idClient = idClient;
      tel.idContact = idContact;
      try { await lastValueFrom(this.numTelService.create(tel)); }
      catch (err) { console.error(err); }
    }
  }

  truncateFields() {
    if (this.singleClient.numero) this.singleClient.numero = this.singleClient.numero.substring(0, 50);
    if (this.singleClient.compte) this.singleClient.compte = this.singleClient.compte.substring(0, 50);
    if (this.singleAdresse.codePostal) this.singleAdresse.codePostal = this.singleAdresse.codePostal.substring(0, 10);
    if (this.singleAdresse.adresse) this.singleAdresse.adresse = this.singleAdresse.adresse.substring(0, 255);
    if (this.singleAdresse.ville) this.singleAdresse.ville = this.singleAdresse.ville.substring(0, 100);
    if (this.singleAdresse.province) this.singleAdresse.province = this.singleAdresse.province.substring(0, 100);
    if (this.singleAdresse.pays) this.singleAdresse.pays = this.singleAdresse.pays.substring(0, 100);
    if (this.singleAdresse.appartementLocal) this.singleAdresse.appartementLocal = this.singleAdresse.appartementLocal.substring(0, 50);
    if (this.singleAdresse.batiment) this.singleAdresse.batiment = this.singleAdresse.batiment.substring(0, 50);
    if (this.singleAdresse.interphoneDigicode) this.singleAdresse.interphoneDigicode = this.singleAdresse.interphoneDigicode.substring(0, 20);
    if (this.singleAdresse.escalier) this.singleAdresse.escalier = this.singleAdresse.escalier.substring(0, 20);
    if (this.singleAdresse.porteEntree) this.singleAdresse.porteEntree = this.singleAdresse.porteEntree.substring(0, 20);

    this.listEmails.forEach(e => {
      if (e.email) e.email = e.email.substring(0, 255);
      if (e.type) e.type = e.type.substring(0, 20);
    });

    this.listTels.forEach(t => {
      if (t.tel) t.tel = t.tel.substring(0, 20);
      if (t.type) t.type = t.type.substring(0, 20);
    });
  }

  clear() {
    this.singleAdresse = { id: null, adresse: null, codePostal: null, ville: null, province: null, pays: null, etage: null, appartementLocal: null, batiment: null, interphoneDigicode: null, escalier: null, porteEntree: null };
    this.singleContact = { id: null, nomComplet: null, poste: null, dateDu: null, dateAu: null, memoNote: null, idClient: null };
    this.singleParticulier = { id: null, nomComplet: null, email: null, telephone: null, idAdresse: null, idClient: null };
    this.singleAgence = { id: null, idClient: null, nomAgence: null, idAdresse: null };
    this.singleOrganisation = { id: null, idClient: null, nomEntreprise: null };
    this.singleNumTel = { id: null, tel: null, type: 'personnel', idContact: null };
    this.singleAdresseEmail = { id: null, email: null, type: 'personnel', idContact: null };
    this.singleClient = { numero: null, compte: null };
    this.listContacts = [];
    this.listEmails = [{ ...this.singleAdresseEmail }];
    this.listTels = [{ ...this.singleNumTel }];
  }

  clearContact() {
    this.singleContact = { id: null, nomComplet: null, poste: null, dateDu: null, dateAu: null, memoNote: null, idClient: null, listEmails: [], listTels: [] };
    this.listEmails = [{ ...this.singleAdresseEmail }];
    this.listTels = [{ ...this.singleNumTel }];
  }
}
