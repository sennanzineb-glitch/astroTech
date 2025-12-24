import { Component } from '@angular/core';
import { ReferentsService } from '../../_services/referents/referents.service';
import { FichiersService } from '../../_services/fichiers/fichiers.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  referents: any = [];
  loading = true;
  error: string | null = null;
  newFiles: File[] = [];
  url_upload = environment.url_upload;

  constructor(
    private referentsService: ReferentsService,
    private fichiersService: FichiersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReferents();
  }

  // 📄 Getter pour noms fichiers sélectionnés
  get newFilesNames(): string {
    return this.newFiles.length > 0
      ? this.newFiles.map(f => f.name).join(', ')
      : 'Aucun fichier sélectionné';
  }

  // 🔄 Charger tous les référents
  loadReferents() {
    this.referentsService.getAll().subscribe({
      next: data => {
        this.referents = data;
        this.loading = false;
      },
      error: err => {
        console.error('Erreur chargement référents', err);
        this.error = 'Impossible de charger les référents';
        this.loading = false;
      }
    });
  }

  // 🗑️ Supprimer un référent
  deleteReferent(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer ce référent ?')) return;

    this.referentsService.delete(id).subscribe({
      next: () => {
        this.referents = this.referents.filter((r:any) => r.id !== id);
        alert('Référent supprimé avec succès !');
      },
      error: err => {
        console.error(err);
        alert('Erreur lors de la suppression du référent');
      }
    });
  }

  // 📂 Sélectionner des fichiers avant upload
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.newFiles.push(files[i]);
    }
  }

  removeNewFile(index: number) {
    this.newFiles.splice(index, 1);
  }

  // 📤 Upload fichiers pour un référent spécifique
  async uploadFiles(ref: any) {
    if (!ref || this.newFiles.length === 0) return;

    try {
      for (const file of this.newFiles) {
        const fd = new FormData();
        fd.append('files', file);
        fd.append('idReferent', ref.id.toString());

        const res: any = await lastValueFrom(this.fichiersService.uploadFiles(fd));

        const uploadedFiles = Array.isArray(res.body?.files) ? res.body.files : [];

        if (!ref.fichiers) {
          ref.fichiers = [];
        }

        const nouveauxFichiers = uploadedFiles.map((f: any) => ({
          id: f.id,
          nom: f.originalname,
          chemin: f.filename,
          size: f.size,
          mimetype: f.mimetype
        }));

        ref.fichiers = [...ref.fichiers, ...nouveauxFichiers];
      }

      this.newFiles = [];
    } catch (err) {
      console.error('Erreur upload fichiers', err);
      alert('Erreur lors de l’upload des fichiers');
    }
  }

  // 🗑️ Supprimer un fichier uploadé pour un référent spécifique
  removeUploadedFile(fichierId: number, ref: any) {
    if (!confirm('Supprimer ce fichier ?')) return;

    this.fichiersService.deleteById(fichierId).subscribe({
      next: () => {
        if (ref.fichiers) {
          ref.fichiers = ref.fichiers.filter((f: any) => f.id !== fichierId);
        }
      },
      error: err => {
        console.error('Erreur suppression fichier', err);
        alert('Impossible de supprimer le fichier');
      }
    });
  }

  addReferent(){
    //alert("Bonjour !")
    this.router.navigate(['/referents/edit']);
  }

}
