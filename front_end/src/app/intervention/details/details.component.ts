import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InterventionService } from '../../_services/affaires/intervention.service';
import { TechnicienService } from '../../_services/techniciens/technicien.service';
import { SharedModule } from '../../_globale/shared/shared.module';

@Component({
  selector: 'app-details',
  imports: [SharedModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})

export class DetailsComponent {
  intervention: any;
  techniciens: any = [];
  assignForm: FormGroup;
  planningForm: FormGroup;
  interventionId!: number;

  constructor(
    private interventionService: InterventionService,
    private technicienService:TechnicienService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.assignForm = this.fb.group({
      selectedTechniciens: [[]]
    });

    this.planningForm = this.fb.group({
      date: [''],
      heure: ['']
    });
  }

  ngOnInit(): void {
    this.interventionId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.loadIntervention();
    this.loadTechniciens();
  }

  loadIntervention() {
    this.interventionService.getItemById(this.interventionId).subscribe(res => {
      this.intervention = res;
    });
  }

  loadTechniciens() {
    this.technicienService.getAll().subscribe(res => {
      this.techniciens = res;
    });
  }

  assignTechniciens() {
    const techniciens = this.assignForm.value.selectedTechniciens;
    this.interventionService.assignTechniciens(this.interventionId, techniciens).subscribe(res => {
      console.log('Techniciens affectés avec succès');
      this.loadIntervention();
    });
  }

  addPlanning() {
    const planning = this.planningForm.value;
    this.interventionService.addPlanning(this.interventionId, planning).subscribe(res => {
      alert('Planning ajouté avec succès');
      this.loadIntervention();
    });
  }

}
