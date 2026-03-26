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

   // Pagination
  currentPage: number = 1;
  pageSize: number = 6;
  totalItems: number = 0;
  totalPages: number = 1;

  // Recherche
  searchTerm: string = '';

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

  // 🔄 Charger les référents avec pagination et filtre
  loadReferents(page: number = 1, search: string = '') {
    this.referentsService.apiGetAllWithPaginated(page, this.pageSize, search).subscribe(
      (res: any) => {
        this.referents = res.data || [];
        this.totalItems = res.total || 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.currentPage = page;
      },
      (err) => console.error('Erreur chargement référents', err)
    );
  }

  // 🔍 Recherche
  searchReferents() {
    this.loadReferents(1, this.searchTerm);
  }

  // 🔁 Changer de page
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadReferents(page, this.searchTerm);
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
