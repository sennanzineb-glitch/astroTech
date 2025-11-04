import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../_globale/shared/shared.module';
import { MultiStepFormService } from '../../../../_services/multi-step-form.service';
import { FichiersService } from '../../../../_services/fichiers/fichiers.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-etape3',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './etape3.component.html',
  styleUrls: ['./etape3.component.css']
})
export class Etape3Component {
  form: FormGroup = new FormGroup({});
  files: File[] = [];
  isDragOver = false;

  constructor(
    private fb: FormBuilder,
    private formService: MultiStepFormService,
    private fichiersService: FichiersService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      fichiers: new FormControl([]),
      memoPiecesJointes: ['', Validators.required]
    });

    const savedData = this.formService.getFormData()['step3'];
    if (savedData) this.form.patchValue(savedData);
    this.form.valueChanges.subscribe(val => this.formService.setStepData('step3', val));
  }

  onDragOver(event: DragEvent) { event.preventDefault(); this.isDragOver = true; }
  onDragLeave(event: DragEvent) { event.preventDefault(); this.isDragOver = false; }
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) this.addFiles(event.dataTransfer.files);
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addFiles(input.files);
  }
  addFiles(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) this.files.push(fileList.item(i)!);
    this.form.get('fichiers')?.setValue([...this.files]);
  }

    /** 🔹 Supprimer un fichier avant upload */
  removeFileByIndex(index: number) {
    this.files.splice(index, 1);
    this.form.get('fichiers')?.setValue([...this.files]);
  }

  /** Upload files après création de l'affaire */
  async uploadFiles(idAffaire: number) {
    const uploadedFiles: any[] = [];
    for (const file of this.files) {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('idAffaire', idAffaire.toString());  // ✅ ID de l'affaire
      try {
        const res: any = await lastValueFrom(this.fichiersService.uploadFiles(formData));
        uploadedFiles.push(...res.data);
      } catch (err) { console.error(err); }
    }
    return uploadedFiles;
  }

}
