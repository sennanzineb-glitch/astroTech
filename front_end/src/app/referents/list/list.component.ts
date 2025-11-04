import { Component } from '@angular/core';
import { ReferentsService } from '../../_services/referents/referents.service';
import { SharedModule } from '../../_globale/shared/shared.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  referents: any = [];

  constructor(private referentsService: ReferentsService) { }

  ngOnInit() {
    this.getAllReferents();
  }

  getAllReferents() {
    this.referentsService.getAll().subscribe(data => {
      this.referents = data;
    });
  }

deleteReferent(id: number) {
  const confirmDelete = confirm("Voulez-vous vraiment supprimer ce référent ?");
  if (!confirmDelete) return;

  this.referentsService.delete(id).subscribe({
    next: () => {
      this.getAllReferents();
      alert("Référent supprimé avec succès !");
    },
    error: (err) => {
      console.error("Erreur lors de la suppression du référent :", err);
    }
  });
}


}
