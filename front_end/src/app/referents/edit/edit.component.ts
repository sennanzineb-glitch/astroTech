import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { SharedModule } from '../../_globale/shared/shared.module';
import { FichiersService, Fichier as FichierModel } from '../../_services/fichiers/fichiers.service';
import { ReferentsService } from '../../_services/referents/referents.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  referentForm!: FormGroup;
  fichiers: FichierModel[] = [];       // Fichiers déjà en base
  selectedFiles: File[] = [];          // Nouveaux fichiers à uploader
  deletedFilesIds: number[] = [];      // IDs des fichiers à supprimer au submit
  progress = 0;
  idReferent!: number;
  isDragOver = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fichiersService: FichiersService,
    private referentsService: ReferentsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idReferent = Number(this.route.snapshot.params['id']);

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

  loadReferent() {
    this.referentsService.getItemById(this.idReferent).subscribe(data => {
      const dateVal = data.dateNaissance ? new Date(data.dateNaissance).toISOString().split('T')[0] : '';
      this.referentForm.patchValue({ ...data, dateNaissance: dateVal });
    });
  }

  loadFichiers() {
    this.fichiersService.getRecordsByReferent(this.idReferent).subscribe({
      next: (data) => this.fichiers = data || [],
      error: (err) => console.error("Erreur chargement fichiers :", err)
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles.push(...Array.from(files) as File[]);
    }
  }

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
      this.selectedFiles.push(...Array.from(event.dataTransfer.files));
    }
  }

  removeExistingFile(file: FichierModel) {
    if (confirm('Supprimer ce fichier définitivement à l\'enregistrement ?')) {
      if (file.id) {
        this.deletedFilesIds.push(file.id);
        this.fichiers = this.fichiers.filter(f => f.id !== file.id);
      }
    }
  }

  // CETTE MÉTHODE A ÉTÉ RENOMMÉE POUR CORRESPONDRE AU HTML
  removeFileByIndex(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  save() {
    if (this.referentForm.invalid) {
      alert("⚠️ Veuillez remplir tous les champs obligatoires.");
      return;
    }

    this.isSubmitting = true;
    if (this.idReferent) {
      this.editReferent();
    } else {
      this.addReferent();
    }
  }

  addReferent() {
    this.referentsService.create(this.referentForm.value).subscribe({
      next: (res) => {
        this.idReferent = res.id || res.data?.id;
        if (this.selectedFiles.length > 0) {
          this.uploadFiles();
        } else {
          this.router.navigate(['/referents/list']);
        }
      },
      error: () => this.isSubmitting = false
    });
  }

  editReferent() {
    this.referentsService.update(this.referentForm.value, this.idReferent).subscribe({
      next: () => {
        const deleteRequests = this.deletedFilesIds.map(id => 
          this.fichiersService.deleteById(id).pipe(catchError(err => of(null)))
        );

        if (deleteRequests.length > 0) {
          forkJoin(deleteRequests).subscribe(() => this.finalizeSave());
        } else {
          this.finalizeSave();
        }
      },
      error: () => this.isSubmitting = false
    });
  }

  private finalizeSave() {
    if (this.selectedFiles.length > 0) {
      this.uploadFiles();
    } else {
      this.router.navigate(['/referents/list']);
    }
  }

  uploadFiles() {
    const formData = new FormData();
    formData.append('idReferent', String(this.idReferent));
    this.selectedFiles.forEach(file => formData.append('files', file));

    this.fichiersService.uploadFiles(formData).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.router.navigate(['/referents/list']);
        }
      },
      error: (err) => {
        console.error("Erreur upload:", err);
        alert("Erreur lors de l'upload des fichiers.");
      }
    });
  }

  annuler() {
    this.router.navigate(['/referents/list']);
  }
}