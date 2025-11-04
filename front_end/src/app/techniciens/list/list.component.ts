import { Component } from '@angular/core';
import { SharedModule } from '../../_globale/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TechnicienService } from '../../_services/techniciens/technicien.service';

@Component({
  selector: 'app-list',
  imports: [SharedModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  techniciens: any = [];

  constructor(
    private technicienService: TechnicienService
  ) {
    this.getAllTechniciens();
  }

  getAllTechniciens() {
    this.technicienService.getAll().subscribe((data: any) => {
      this.techniciens = (data as any[]).map(t => ({
        ...t,
        showPassword: false
      }));
    });
  }

  togglePassword(technicien: any) {
    technicien.showPassword = !technicien.showPassword;
  }

  deleteTechnicien(id: number) {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer ce technicien ?');

    if (confirmed) {
      this.technicienService.delete(id).subscribe({
        next: () => {
          this.getAllTechniciens();
          console.log('Technicien supprimé avec succès !');
          alert('Technicien supprimé avec succès !'); // Optionnel
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Impossible de supprimer ce technicien.');
        }
      });
    }
  }


}
