import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../_globale/shared/shared.module';
import { FichiersService, Fichier as FichierModel } from '../../_services/fichiers/fichiers.service';
import { ReferentsService } from '../../_services/referents/referents.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  referentForm!: FormGroup;
  fichiers: FichierModel[] = [];       // fichiers existants dans la BD
  selectedFiles: File[] = [];          // nouveaux fichiers à uploader
  deletedFiles: number[] = [];         // fichiers supprimés côté backend
  progress = 0;
  idReferent!: number;
  isDragOver = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fichiersService: FichiersService,
    private referentsService: ReferentsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idReferent = +this.route.snapshot.params['id'];

    this.referentForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: [''],
      adresse: [''],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      poste: ['']
    });

    if (this.idReferent) {
      this.loadReferent();
      this.loadFichiers();
    }
  }

  // 🔹 Charger infos du référent
  loadReferent() {
    this.referentsService.getItemById(this.idReferent).subscribe(data => {
      const dateNaissance = data.dateNaissance
        ? new Date(data.dateNaissance).toISOString().split('T')[0]
        : null;

      this.referentForm.patchValue({ ...data, dateNaissance });
    });
  }

  // 🔹 Charger fichiers liés
  loadFichiers() {
    this.fichiersService.getRecordsByReferent(this.idReferent).subscribe({
      next: (data) => {
        this.fichiers = data || [];
        console.log("📂 Fichiers liés au référent :", this.fichiers);
      },
      error: (err) => console.error("Erreur chargement fichiers :", err)
    });
  }

  // 🔹 Sélection de nouveaux fichiers
  onFileSelected(event: any) {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files) as File[];
      this.selectedFiles.push(...newFiles);
    }
  }

  // 🔹 Drag & Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }
  onDragLeave(event: DragEvent) {
    this.isDragOver = false;
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      this.selectedFiles.push(...droppedFiles);
    }
  }

  // 🔹 Supprimer un fichier existant (backend)
  deleteExistingFile(file: FichierModel) {
    if (!confirm('Voulez-vous vraiment supprimer ce fichier ?')) return;
    if (file.id != null) {
      this.deletedFiles.push(file.id);
      this.fichiers = this.fichiers.filter(f => f.id !== file.id);
    }
  }

  // 🔹 Supprimer un fichier avant upload
  removeFileByIndex(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  // 🔹 Sauvegarde globale
  save() {
    if (this.referentForm.invalid){
      // Show a warning message
      alert("⚠️ Veuillez remplir tous les champs obligatoires avant de soumettre le formulaire !");
      return;
    }

    if (this.idReferent) this.editReferent();
    else this.addReferent();
  }

  // 🔹 Ajouter un référent + fichiers
  addReferent() {
    this.referentsService.create(this.referentForm.value).subscribe(result => {
      this.idReferent = result.data.id;
      this.uploadFiles();
      this.router.navigate(['/referents/list']);
    });

  }

  // 🔹 Modifier le référent + synchro fichiers
  editReferent() {
    this.referentsService.update(this.referentForm.value, this.idReferent).subscribe(() => {
      console.log('✅ Référent mis à jour');

      // 🗑️ Supprimer les fichiers supprimés
      const deletePromises = this.deletedFiles.map(id =>
        this.fichiersService.deleteById(id).toPromise()
      );

      // // 📂 Upload des fichiers restants ou nouveaux
      // Promise.all(deletePromises).then(() => {
      //   if (this.selectedFiles.length > 0) {
      //     this.uploadFiles();
      //   } else {
      //     alert('✅ Modifications enregistrées');
      //     this.router.navigate(['/referents/list']);
      //   }
      // });

      this.router.navigate(['/referents/list']);
    });
  }

  // 🔹 Upload fichiers
  uploadFiles() {
    if (this.selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append('idReferent', String(this.idReferent));
    this.selectedFiles.forEach(file => formData.append('files', file));

    this.fichiersService.uploadFiles(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        this.progress = Math.round((100 * event.loaded) / event.total);
      } else if (event.type === HttpEventType.Response) {
        alert('📂 Upload terminé !');
        this.selectedFiles = [];
        this.progress = 0;
        this.loadFichiers();
        //this.router.navigate(['/referents/list']);
      }
    });
  }

  annuler() {
    this.router.navigate(['/referents/list']);
  }
}
