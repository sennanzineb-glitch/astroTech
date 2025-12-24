import { Component } from '@angular/core';
import { AffairesService } from '../../_services/affaires/affaires.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { FichiersService } from '../../_services/fichiers/fichiers.service';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  affaires: any = [];
  selectedAffaire: any | null = null;
  loading = true;
  error: string | null = null;
  newFiles: File[] = [];
  url_upload = environment.url_upload;

  constructor(
    private affaireService: AffairesService,
    private fichiersService: FichiersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAffaires();
  }

  // ✅ Getter pour afficher les noms des fichiers
  get newFilesNames(): string {
    return this.newFiles.length > 0
      ? this.newFiles.map(f => f.name).join(', ')
      : 'Aucun fichier choisi';
  }

  loadAffaires() {
    this.affaireService.getAll().subscribe({
      next: (data) => {
        this.affaires = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des affaires', err);
        this.error = 'Impossible de charger les affaires';
        this.loading = false;
      }
    });
  }

  selectAffaire(affaire: any): void {
    this.selectedAffaire = affaire;
  }

  deleteAffaire(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette affaire ?')) {
      this.affaireService.delete(id).subscribe({
        next: () => {
          // Supprimer l'affaire du tableau local pour mise à jour UI instantanée
          this.loadAffaires();
          alert('Affaire supprimé avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Impossible de supprimer cette affaire.');
        }
      });
    }
  }

  /** Fichiers sélectionnés avant upload */
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.newFiles.push(files[i]);
    }
  }

  removeNewFile(index: number) {
    this.newFiles.splice(index, 1);
  }

  /** Upload fichiers vers backend */
  async uploadFiles() {
    if (!this.selectedAffaire || !this.newFiles || this.newFiles.length === 0) return;

    try {
      for (const file of this.newFiles) {
        const fd = new FormData();
        fd.append('files', file);
        fd.append('idAffaire', this.selectedAffaire.affaireId.toString());

        // Envoi au backend
        const res: any = await lastValueFrom(this.fichiersService.uploadFiles(fd));

        console.log("Réponse backend :", res.body);

        // Sécurité : vérifier que res.files est bien un tableau
        const uploadedFiles = Array.isArray(res.body.files) ? res.body.files : [];

        if (!this.selectedAffaire.fichiers) {
          this.selectedAffaire.fichiers = [];
        }

        // Ajouter les fichiers uploadés dans la liste affichée
        const nouveauxFichiers = uploadedFiles.map((f: any) => ({
          id: f.id,
          nom: f.originalname,
          chemin: f.filename,
          size: f.size,
          mimetype: f.mimetype
        }));

        //console.log('** nouveauxFichiers **',uploadedFiles);

        // ⚡ Créer une nouvelle référence pour déclencher la détection Angular
        this.selectedAffaire.fichiers = [...(this.selectedAffaire.fichiers || []), ...nouveauxFichiers];
      }

      // Vider la liste des fichiers sélectionnés
      this.newFiles = [];
    } catch (err) {
      console.error('Erreur upload', err);
      alert('Erreur lors de l\'upload des fichiers');
    }
  }



  /** Supprimer un fichier uploadé */
  removeUploadedFile(fichierId: number) {
    if (!confirm('Voulez-vous supprimer ce fichier ?')) return;

    this.fichiersService.deleteById(fichierId).subscribe({
      next: () => {
        if (this.selectedAffaire && this.selectedAffaire.fichiers) {
          this.selectedAffaire.fichiers = this.selectedAffaire.fichiers.filter((f: any) => f.id !== fichierId);
        }
      },
      error: err => {
        console.error('Erreur suppression fichier', err);
        alert('Impossible de supprimer le fichier');
      }
    });
  }

  // navigation vers le formulaire d'ajout
  goToAddAffaire() {
    this.router.navigate(['/affaires/edit']);
  }

  // navigation vers le formulaire de modification
  goToEditAffaire(affaire: any) {
    this.router.navigate(['/affaires/edit', affaire.affaireId]);
  }

  goToAddLinkedAffaire(affaire: any) {
  this.router.navigate(
    ['/interventions/edit'],
    { queryParams: { affaireId: affaire.affaireId } }
  );
}

}