import { Component, OnInit } from '@angular/core';
import { EquipeTechniciensService } from '../../_services/techniciens/equipe-techniciens.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../_globale/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TechnicienService } from '../../_services/techniciens/technicien.service';

@Component({
  imports: [SharedModule, RouterModule],
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']  // <-- corrigé
})
export class EquipeComponent implements OnInit {
  formEquipe!: FormGroup;
  techniciens: any = [];
  equipes: any = [];
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private equipeService: EquipeTechniciensService,
    private technicienService: TechnicienService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTechniciens();
    this.loadEquipes();
  }

  initForm() {
    this.formEquipe = this.fb.group({
      nomEquipe: ['', Validators.required],
      chefId: ['', Validators.required],
      techniciensIds: [[], Validators.required] // liste de techniciens
    });
  }

  loadEquipes() {
    this.equipeService.getAllEquipes().subscribe((res:any) =>{
      this.equipes = res.data;
    })
  }

  loadTechniciens() {
    this.technicienService.getAll().subscribe(res =>{
      this.techniciens = res;
    })
  }

  onSubmit() {
    if (this.formEquipe.invalid) {
      // Show a warning message
      alert("⚠️ Veuillez remplir tous les champs obligatoires avant de soumettre le formulaire !");
      return;
    } 

    this.loading = true;
    const formValue = this.formEquipe.value;

    // Étape 1 : Créer l’équipe
    const equipeData = {
      nom: formValue.nomEquipe,
      chefId: formValue.chefId
    };

    this.equipeService.createEquipe(equipeData).subscribe({
      next: (equipe: any) => {
        const equipeId = equipe.data.id;
        // Étape 2 : Ajouter les techniciens sélectionnés
        const ajoutPromises = formValue.techniciensIds.map((techId: number) =>
          this.equipeService.addTechnicienToEquipe(equipeId, techId).toPromise()
        );

        Promise.all(ajoutPromises).then(() => {
          this.message = '✅ Équipe créée avec succès et techniciens affectés !';
          this.formEquipe.reset();
          this.loadEquipes();
        }).catch(err => {
          console.error('Erreur affectation techniciens', err);
          this.message = '⚠️ Erreur lors de l’affectation des techniciens';
        }).finally(() => this.loading = false);
      },
      error: (err) => {
        console.error('Erreur création équipe', err);
        this.message = '❌ Erreur lors de la création de l’équipe';
        this.loading = false;
      }
    });
  }


  deleteEquipe(id: number) {
  const confirmed = window.confirm('Voulez-vous vraiment supprimer cette équipe de techniciens ?');

  if (confirmed) {
    this.equipeService.delete(id).subscribe({
      next: () => {
        this.loadEquipes(); // Recharge la liste des équipes après suppression
        console.log('Équipe supprimée avec succès !');
        alert('Équipe supprimée avec succès !'); // Optionnel
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        alert('Impossible de supprimer cette équipe.');
      }
    });
  }
}





}
