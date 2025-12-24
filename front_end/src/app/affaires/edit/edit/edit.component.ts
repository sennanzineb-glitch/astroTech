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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
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
  isEdit = false;
  affaireId!: number;

  constructor(
    public formService: MultiStepFormService,
    private affairesService: AffairesService,
    private fichiersService: FichiersService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.formService.resetAllForms();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.affaireId = Number(idParam);
      await this.loadAffaireData();
    }
  }

  nextStep() { if (this.step < 3) this.step++; }
  previousStep() { if (this.step > 1) this.step--; }

  /** Charger l'affaire en modification */
  async loadAffaireData() {
    try {
      const res: any = await lastValueFrom(this.affairesService.getItemById(this.affaireId));
      const a = res.data;

      const formatDate = (d: string | null) => d ? d.split('T')[0] : '';

      // Patcher directement les FormGroup du service
      this.formService.formStep1.patchValue({
        reference: a.reference || null,
        titre: a.titre || null,
        clientId: a.clientId || null,
        adresse_id: Number(a.adresse_id) || null,
        type_client_adresse: a.type_client_adresse || null,
        client_adresse_id: Number(a.client_adresse_id) || null,
        description: a.description || null
      });

      this.formService.formStep2.patchValue({
        etatLogement: a.etatLogement || null,
        referentId: a.referents || [],
        motsCles: a.motsCles ? a.motsCles.split(',') : [],
        technicienId: Number(a.technicienId) || null,
        equipeTechnicienId: Number(a.equipeTechnicienId) || null,
        dateDebut: formatDate(a.dateDebut),
        dateFin: formatDate(a.dateFin),
        dureePrevueHeures: a.dureePrevueHeures || null,
        dureePrevueMinutes: a.dureePrevueMinutes || null,
        memo: a.memo || null
      });


      this.formService.formStep3.patchValue({
        fichiers: a.fichiers || [],
        memoPiecesJointes: a.memoPiecesJointes || null
      });

    } catch (err) {
      console.error(err);
    }
  }

  /** Ajouter ou modifier */
  async submit() {
    const data = this.formService.getFormData();
    const all = { ...data.step1, ...data.step2, ...data.step3 };

    const affaireData = {
      reference: all.reference,
      titre: all.titre,
      clientId: Number(all.clientId),
      adresse_id: Number(all.adresse_id),
      client_adresse_id: Number(all.client_adresse_id),
      type_client_adresse: all.type_client_adresse,
      description: all.description,

      etatLogement: all.etatLogement,
      technicienId: Number(all.technicienId),
      equipeTechnicienId: Number(all.equipeId),
      referents: all.referentId,

      dateDebut: all.dateDebut,
      dateFin: all.dateFin,
      motsCles: Array.isArray(all.motsCles) ? all.motsCles.join(',') : '',
      dureePrevueHeures: all.dureePrevueHeures,
      dureePrevueMinutes: all.dureePrevueMinutes,
      memo: all.memo,

      memoPiecesJointes: all.memoPiecesJointes
    };

    this.loading = true;

    try {
      let affaireId = this.affaireId;


      if (!this.isEdit) {
        const res: any = await lastValueFrom(this.affairesService.create(affaireData));
        affaireId = res.data.id;
        // Upload fichiers
        if (all.fichiers && all.fichiers.length > 0) {
          for (const file of all.fichiers) {
            const fd = new FormData();
            fd.append('files', file);
            fd.append('idAffaire', affaireId.toString());
            await lastValueFrom(this.fichiersService.uploadFiles(fd));
          }
        }
      } else {
        await lastValueFrom(this.affairesService.update(affaireId, affaireData));
      }

      this.formService.resetAllForms();
      this.router.navigate(['/affaires/list']);

    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }


}
