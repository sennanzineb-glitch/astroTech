import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { FormsModule } from '@angular/forms';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

import { PlanningService } from '../../_services/affaires/planning.service';

declare var bootstrap: any;

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

  events: any[] = [];
  interventions: any[] = [];
  selectedEvent: any = null;

  newPlan = {
    intervention_id: null,
    date: '',
    heure: ''
  };

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    height: 600, // ← ici tu définis la hauteur en pixels
    firstDay: 1,
    weekNumbers: true,
    eventDisplay: 'block',
    eventClick: this.onEventClick.bind(this)
  };

  constructor(private planningService: PlanningService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadInterventions();
  }

  // 🔹 Charger toutes les planifications
  loadEvents(): void {
    this.planningService.getAll().subscribe((data: any) => {
      this.events = data.map((row : any) => ({
        id: row.planningId,
        title: row.interventionNumero,
        start: row.planningDate.split('T')[0],
        allDay: true,
        backgroundColor: '#79b7f2',
        borderColor: '#79b7f2',
        textColor: '#fff',
        extendedProps: row
      }));
    });
  }

  // 🔹 Charger toutes les interventions pour le select
  loadInterventions(): void {
    this.planningService.getAll().subscribe((data: any) => {
      this.interventions = data;
    });
  }

  // 🔹 Au clic sur un événement → ouvrir le modal
  onEventClick(clickInfo: EventClickArg) {
    this.selectedEvent = clickInfo.event;

    const modalEl = document.getElementById('eventModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl, {
        backdrop: 'static',
        keyboard: false
      });
      modal.show();
    }
  }

  // 🔹 Ajouter une planification
  addPlanification() {
    if (!this.newPlan.intervention_id || !this.newPlan.date || !this.newPlan.heure) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.planningService.addPlanning(this.newPlan.intervention_id, this.newPlan).subscribe({
      next: () => {
        alert('Planification ajoutée');
        this.loadEvents();
        this.newPlan = { intervention_id: null, date: '', heure: '' };
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l\'ajout de la planification');
      }
    });
  }

}
