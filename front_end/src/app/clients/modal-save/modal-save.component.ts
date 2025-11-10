
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
  isEditMode = false;

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

  async save() {
    this.truncateFields();
    console.log(this.isEditMode);
    try {

      if (this.isEditMode) {
        // 1️⃣ Créer le client
        await lastValueFrom(this.clientsService.update(this.singleClient));
        // 2️⃣ Créer les entités liées selon le type de client
        if (this.typeClient === 'organisation') {
          await lastValueFrom(this.organisationsService.update(this.singleOrganisation));
        } else if (this.typeClient === 'particulier') {
          await lastValueFrom(this.adressesService.update(this.singleAdresse));
          await lastValueFrom(this.particuliersService.update(this.singleParticulier));
        } else { // agence
          await lastValueFrom(this.adressesService.update(this.singleAdresse));
          await lastValueFrom(this.agencesService.update(this.singleAgence));
        }
      }
      else {
        // 1️⃣ Créer le client
        const result: any = await lastValueFrom(this.clientsService.create(this.singleClient));
        this.singleClient.id = result.data.id;
        // 2️⃣ Créer les entités liées selon le type de client
        if (this.typeClient === 'organisation') {
          this.singleOrganisation.idClient = this.singleClient.id;
          const resOrg: any = await lastValueFrom(this.organisationsService.create(this.singleOrganisation));
          this.singleOrganisation.id = resOrg.data.id;
        } else if (this.typeClient === 'particulier') {
          this.singleParticulier.idClient = this.singleClient.id;
          const resAdresse: any = await lastValueFrom(this.adressesService.create(this.singleAdresse));
          this.singleParticulier.idAdresse = resAdresse.data.id;

          const resPart: any = await lastValueFrom(this.particuliersService.create(this.singleParticulier));
          this.singleParticulier.id = resPart.data.id;

        } else { // agence
          this.singleAgence.idClient = this.singleClient.id;
          const resAdresse: any = await lastValueFrom(this.adressesService.create(this.singleAdresse));
          this.singleAgence.idAdresse = resAdresse.data.id;

          const resAgence: any = await lastValueFrom(this.agencesService.create(this.singleAgence));
          this.singleAgence.id = resAgence.data.id;
        }

        // 3️⃣ Sauvegarder tous les contacts et leurs emails / téléphones
        //await this.saveAllContacts(this.singleClient.id);
      }

      // 3️⃣ Sauvegarder tous les contacts et leurs emails / téléphones
      await this.saveAllContacts(this.singleClient.id);

      // 4️⃣ Émettre l’événement pour que la liste se rafraîchisse
      this.clientAdded.emit();

      // 5️⃣ Fermer le modal correctement
      const modalEl = document.getElementById('saveModal');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
      }

      // Supprimer le backdrop et nettoyer le body
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');

      // 6️⃣ Réinitialiser les formulaires
      this.clear();

    } catch (err) {
      console.error('Erreur lors de la sauvegarde du client :', err);
      alert('Une erreur est survenue lors de la sauvegarde du client.');
    }
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

  // async saveAllContacts(idClient: number) {
  //   for (const contact of this.listContacts) {
  //     contact.idClient = idClient;
  //     try {
  //       const result: any = await lastValueFrom(this.contactsService.create(contact));
  //       contact.id = result.data.id;
  //       await this.saveAllEmails([...contact.listEmails], contact.idClient, contact.id);
  //       await this.saveAllTels([...contact.listTels], contact.idClient, contact.id);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }

  async saveAllContacts(idClient: number) {
    for (const contact of this.listContacts) {
      contact.idClient = idClient;

      try {
        // 🔍 Vérification du contact (nom + poste)
        let record: any = {
          nomComplet: contact.nomComplet,
          poste: contact.poste
        };
        console.log("***",record);
        
        const existing: any = await lastValueFrom(
          this.contactsService.getByNameAndPoste(idClient,record)
        );

        if (existing && existing.data) {
          contact.id = existing.data.id;
          await lastValueFrom(this.contactsService.update(contact));
        } else {
          const result: any = await lastValueFrom(this.contactsService.create(contact));
          contact.id = result.data.id;
        }

        // ✅ Vérification des emails avant insertion
        for (const email of contact.listEmails) {
          const existsEmail: any = await lastValueFrom(
            this.adresseEmailService.getByEmailAndContact(contact.id, email.email)
          );

          if (existsEmail && existsEmail.data) {
            // Email déjà existant → on ignore
            console.log(`Email déjà existant : ${email.email}`);
          } else {
            await lastValueFrom(this.adresseEmailService.create({
              idContact: contact.id,
              idClient: contact.idClient,
              email: email.email,
              type: email.type
            }));
          }
        }

        // ✅ Vérification des téléphones avant insertion
        for (const tel of contact.listTels) {
          const existsTel: any = await lastValueFrom(
            this.numTelService.getByTelAndContact(contact.id, tel.tel)
          );

          if (existsTel && existsTel.data) {
            // Tel déjà existant → on ignore
            console.log(`Téléphone déjà existant : ${tel.tel}`);
          } else {
            await lastValueFrom(this.numTelService.create({
              idContact: contact.id,
              idClient: contact.idClient,
              tel: tel.tel,
              type: tel.type
            }));
          }
        }

      } catch (err) {
        console.error('Erreur lors de la sauvegarde du contact :', err);
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
    this.isEditMode = false;
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

  private getEmptyAdresse() {
    return {
      id: null, adresse: null, codePostal: null, ville: null, province: null,
      pays: null, etage: null, appartementLocal: null, batiment: null,
      interphoneDigicode: null, escalier: null, porteEntree: null
    };
  }

  editClient(client: any) {
    console.log('***', client);

    this.isEditMode = true;
    this.isFirstVisible = true;

    this.singleClient = { id: client.id || null, numero: client.numero || '', compte: client.compte || '' };

    switch (client.typeClient) {
      case 'organisation':
        this.typeClient = 'organisation';
        this.singleOrganisation = {
          id: client.organisationId || client.organisation?.id || null,
          idClient: client.id || null,
          nomEntreprise: client.nomClient || client.organisation?.nomEntreprise || ''
        };
        this.singleAdresse = client.adresse ? { ...client.adresse } : this.getEmptyAdresse();
        break;

      case 'particulier':
        this.typeClient = 'particulier';
        this.singleParticulier = {
          id: client.particulierId || client.particulier?.id || null,
          idClient: client.id || null,
          nomComplet: client.nomClient || '',
          email: client.email || '',
          telephone: client.telephone || '',
          idAdresse: client.adresse?.id || null
        };
        this.singleAdresse = client.adresse ? { ...client.adresse } : this.getEmptyAdresse();
        break;

      case 'agence':
        this.typeClient = 'agence';
        this.singleAgence = {
          id: client.agenceId || client.agence?.id || null,
          idClient: client.id || null,
          nomAgence: client.nomClient || client.agence?.nomAgence || '',
          idAdresse: client.adresse?.id || null
        };
        this.singleAdresse = client.adresse ? { ...client.adresse } : this.getEmptyAdresse();
        break;

      default:
        this.typeClient = 'inconnu';
        this.singleAdresse = this.getEmptyAdresse();
        break;
    }

    this.listContacts = client.contacts?.map((c: any) => ({
      ...c,
      listEmails: c.listEmails?.length ? [...c.listEmails] : [{ ...this.singleAdresseEmail }],
      listTels: c.listTels?.length ? [...c.listTels] : [{ ...this.singleNumTel }]
    })) || [];

    if (this.listContacts.length === 0) {
      this.listEmails = [{ ...this.singleAdresseEmail }];
      this.listTels = [{ ...this.singleNumTel }];
    }

    const modalEl = document.getElementById('saveModal');
    if (modalEl) {
      const modalInstance = new bootstrap.Modal(modalEl);
      modalInstance.show();
    }
  }





}