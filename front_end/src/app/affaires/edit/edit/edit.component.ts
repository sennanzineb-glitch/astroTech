import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Etape1Component } from '../components/etape1/etape1.component';
import { Etape2Component } from '../components/etape2/etape2.component';
import { Etape3Component } from '../components/etape3/etape3.component';
import { MultiStepFormService } from '../../../_services/multi-step-form.service';
import { AffairesService } from '../../../_services/affaires/affaires.service';
import { FichiersService } from '../../../_services/fichiers/fichiers.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Etape1Component,
    Etape2Component,
    Etape3Component
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  step = 1;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    public formService: MultiStepFormService,
    private affairesService: AffairesService,
    private fichiersService: FichiersService,
    private router: Router
  ) { }

  nextStep() { if (this.step < 3) this.step++; }
  previousStep() { if (this.step > 1) this.step--; }

  async submit() {
    const formData = this.formService.getFormData();
    const allData = { ...formData.step1, ...formData.step2, ...formData.step3 };
    //const referents = allData.referentId ? [Number(allData.referentId)] : [];
    //console.log(referents, allData.referentId);
    

    const affaireData = {
      reference: allData.reference || '',
      titre: allData.titre || '',
      zoneIntervention: allData.zoneIntervention || '',
      description: allData.description || '',
      clientId: allData.clientId ? Number(allData.clientId) : null,
      etatLogement: allData.etatLogement || '',
      technicienId: allData.technicienId ? Number(allData.technicienId) : null,
      equipeTechnicienId: allData.equipeTechnicienId ? Number(allData.equipeTechnicienId) : null,
      referents: allData.referentId,
      dateDebut: allData.dateDebut || null,
      dateFin: allData.dateFin || null,
      motsCles: Array.isArray(allData.motsCles) ? allData.motsCles.join(',') : allData.motsCles || '',
      dureePrevueHeures: allData.dureePrevueHeures || null,
      dureePrevueMinutes: allData.dureePrevueMinutes || null,
      memo: allData.memo || '',
      memoPiecesJointes: allData.memoPiecesJointes || ''
    };

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      // 1️⃣ Création de l'affaire
      const res: any = await lastValueFrom(this.affairesService.create(affaireData));
      const idAffaire = res.data.id;

      // 2️⃣ Upload fichiers de l'étape 3
      if (allData.fichiers && allData.fichiers.length > 0) {
        for (const file of allData.fichiers) {
          const formData = new FormData();
          formData.append('files', file);
          formData.append('idAffaire', idAffaire.toString());  // ✅ Utilisation de l'ID de l'affaire
          try { await lastValueFrom(this.fichiersService.uploadFiles(formData)); }
          catch (err) { console.error(err); }
        }
      }
      this.successMessage = '✅ Affaire et fichiers ajoutés avec succès !';
      this.router.navigate(['/affaires/list']);
    } catch (err) {
      console.error(err);
      this.errorMessage = '❌ Erreur lors de l\'ajout de l\'affaire.';
    } finally {
      this.loading = false;
    }
  }

}
