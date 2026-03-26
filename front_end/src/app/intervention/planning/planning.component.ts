import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { PlanningService } from '../../_services/affaires/planning.service';
import { InterventionService } from '../../_services/affaires/intervention.service';
import { DateClickArg } from '@fullcalendar/interaction';


declare var bootstrap: any;

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule, RouterModule],
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('miniCalendar') miniCalendarComponent!: FullCalendarComponent;

  interventions: any[] = [];
  selectedEvent: any = null;
  typesIntervention: any;

  allEvents: any[] = [];
  events: any[] = [];

  // Mini calendrier : date début/fin sélectionnées
  search = {
    dateDebut: null as string | null,
    dateFin: null as string | null,
    etat: '',
    type: ''
  };

  intervention: any = null;

  planning = {
    dateDebut: '',
    heureDebutH: null,
    heureDebutM: null,
    dateFin: '',
    heureFinH: null,
    heureFinM: null,
    tempsTrajetEstimeH: 0,
    tempsTrajetEstimeMin: 0,
    interventionId: 0
  };

  etatsConfig = [
    { value: 'en_cours', label: 'En cours', class: 'bg-primary', icon: 'mdi mdi-timer-sand' },
    { value: 'annulee', label: 'Annulée', class: 'bg-danger', icon: 'mdi mdi-close-circle' },
    { value: 'prevue', label: 'Prévue', class: 'bg-info', icon: 'mdi mdi-calendar' },
    { value: 'trajet_en_cours', label: 'Trajet en cours', class: 'bg-info', icon: 'mdi mdi-car' },
    { value: 'pause', label: 'Pause', class: 'bg-secondary', icon: 'mdi mdi-pause-circle' },
    { value: 'refusee', label: 'Refusée', class: 'bg-danger', icon: 'mdi mdi-cancel' },
    { value: 'terminee_avec_succes', label: 'Terminée avec succès', class: 'bg-success', icon: 'mdi mdi-star-circle' },
    { value: 'terminee_avec_interruption', label: 'Terminée avec interruption', class: 'bg-warning text-dark', icon: 'mdi mdi-alert-circle' }
  ];

  calendarOptions: any = {};
  miniCalendarOptions: any = {};

  constructor(
    private router: Router,
    private planningService: PlanningService,
    private interventionService: InterventionService
  ) { }

  ngOnInit(): void {
    this.loadInterventions();
    this.loadTypes();
    this.loadEvents();

    // Calendrier principal
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'dayGridMonth',
      locale: frLocale,
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridDay,timeGridWeek' },
      height: 710,
      firstDay: 1,
      weekNumbers: true,
      eventClick: this.onEventClick.bind(this),
      dateClick: this.onDateClick.bind(this),
      nowIndicator: true,  // montre l'heure actuelle sur la vue semaine/jour
      slotMinTime: '05:00:00', // début de la journée
      slotMaxTime: '20:00:00', // fin de la journée
    };

    //Mini-calendrier avec sélection de plage
    this.miniCalendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: frLocale,
      height: 'auto',            // 🔥 fixe une hauteur plus petite
      aspectRatio: 1.2,         // 🔥 réduit l'espace vertical
      headerToolbar: { left: 'prev', center: 'title', right: 'next' },
      selectable: true,
      selectMirror: true,
      select: this.onMiniCalendarSelect.bind(this)
    };
  }

  loadInterventions() {
    this.interventionService.getAll().subscribe((res: any) => {
      this.interventions = Array.isArray(res) ? res : res.data;
    });
  }

  loadTypes() {
    this.interventionService.getInterventionTypes().subscribe({
      next: (res: any) => this.typesIntervention = res.data,
      error: (err) => console.error(err)
    });
  }

  // ✅ La fonction getColor DOIT être dans la classe
  getColor(className: string): string {
    // On peut extraire la couleur directement depuis class Bootstrap
    switch (className) {
      case 'bg-primary': return '#0d6efd';
      case 'bg-danger': return '#dc3545';
      case 'bg-info': return '#0dcaf0';
      case 'bg-secondary': return '#6c757d';
      case 'bg-success': return '#198754';
      case 'bg-warning text-dark': return '#ffc107';
      default: return '#79b7f2';
    }
  }

  loadEvents() {
    this.planningService.getAll().subscribe((res: any) => {
      const rows = res.data || [];

      this.allEvents = rows.map((row: any) => {
        // Trouver la couleur basée sur l'état
        const etatConfig = this.etatsConfig.find(e => e.value === row.extendedProps?.etat);
        const color = etatConfig ? this.getColor(etatConfig.class) : '#79b7f2';

        // Formater l'heure pour l'afficher dans le titre
        const startTime = row.start ? new Date(row.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const endTime = row.end ? new Date(row.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const titleWithTime = startTime && endTime ? `${row.title} (${startTime} - ${endTime})` : row.title;

        return {
          id: row.id?.toString(),
          title: titleWithTime,
          start: row.start ? new Date(row.start) : new Date(),
          end: row.end ? new Date(row.end) : new Date(),
          allDay: true,               // ✅ occupe toute la journée
          display: 'block',           // ✅ supprime le point
          backgroundColor: color,
          borderColor: color,
          textColor: 'white',
          etat: row.extendedProps.etat,
          extendedProps: { ...row.extendedProps }
        };
      });

      this.events = [...this.allEvents];
    });
  }


  // Mini-calendrier sélection de plage
  onMiniCalendarSelect(selectInfo: { start: Date; end: Date }) {
    const endDate = new Date(selectInfo.end);
    endDate.setDate(endDate.getDate() - 1);

    this.search.dateDebut = selectInfo.start.toISOString().split('T')[0];
    this.search.dateFin = endDate.toISOString().split('T')[0];

    this.applyFilters();

    // Mettre en surbrillance la plage sélectionnée
    this.highlightMiniCalendarRange(selectInfo.start, endDate);
  }

  // Tableau pour stocker les événements de surbrillance
  selections: any[] = [];

  // Stocke l'événement en cours
  currentHighlight: any = null;

  // Méthode pour surligner la plage
  highlightMiniCalendarRange(start: Date, end: Date) {
    const calendarApi = this.miniCalendarComponent.getApi();
    if (!calendarApi) return;

    // Supprimer l'ancienne surbrillance
    if (this.currentHighlight) {
      this.currentHighlight.remove();
      this.currentHighlight = null;
    }

    // Ajouter la nouvelle surbrillance
    this.currentHighlight = calendarApi.addEvent({
      start: start,
      end: new Date(end.getTime() + 24 * 60 * 60 * 1000),
      display: 'background',
      backgroundColor: '#cce5ff',
      allDay: true,
      extendedProps: { isRangeHighlight: true }
    });
  }

  // --------------------------
  // Boutons rapides
  // --------------------------
  goToDate(period: string) {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case 'hier':
        start = new Date(today); start.setDate(today.getDate() - 1); end = new Date(start); break;
      case 'aujourdhui':
        start = new Date(today); end = new Date(today); break;
      case 'demain':
        start = new Date(today); start.setDate(today.getDate() + 1); end = new Date(start); break;
      case 'semaine_cours':
        start = new Date(today); start.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
        end = new Date(start); end.setDate(start.getDate() + 6); break;
      case 'semaine_prochaine':
        start = new Date(today); start.setDate(today.getDate() + (8 - (today.getDay() || 7)));
        end = new Date(start); end.setDate(start.getDate() + 6); break;
      default:
        start = new Date(today); end = new Date(today); break;
    }

    this.search.dateDebut = start.toISOString().split('T')[0];
    this.search.dateFin = end.toISOString().split('T')[0];
    this.applyFilters();

    // Aller sur le mini-calendrier
    this.gotoMiniCalendar(this.search.dateDebut);
    // Aller sur le calendrier principal
    this.gotoMainCalendar(this.search.dateDebut);
  }

  // --------------------------
  // Appliquer filtre
  // --------------------------
  applyFilters() {
    this.events = this.allEvents.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      if (this.search.dateDebut && this.search.dateFin) {
        // Convertir la plage de filtre en début et fin de journée
        const startFilter = new Date(this.search.dateDebut);
        startFilter.setHours(0, 0, 0, 0); // début de journée
        const endFilter = new Date(this.search.dateFin);
        endFilter.setHours(23, 59, 59, 999); // fin de journée

        // Vérifie si l'événement est **en dehors** de la plage => exclure
        if (eventEnd < startFilter || eventStart > endFilter) return false;
      }

      if (this.search.etat && event.extendedProps?.etat !== this.search.etat) return false;
      if (this.search.type && event.extendedProps?.type !== this.search.type) return false;

      return true;
    });
  }

  resetFilters() {
    this.search = { dateDebut: null, dateFin: null, etat: '', type: '' };
    this.events = [...this.allEvents];
  }

  // --------------------------
  // Calendrier principal
  // --------------------------
  gotoMainCalendar(dateStr: string | null) {
    if (!dateStr) return;
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(dateStr);
  }

  gotoMiniCalendar(dateStr: string | null) {
    if (!dateStr) return;
    const miniApi = this.miniCalendarComponent.getApi();
    miniApi.gotoDate(dateStr);
  }

  // --------------------------
  // Modal événement
  // --------------------------
  onEventClick(clickInfo: any) {
    this.selectedEvent = clickInfo.event;

    const modalEl = document.getElementById('eventDetailModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false });
      modal.show();
    }
  }

  getEtatConfig(etat: string) {
    return this.etatsConfig.find(e => e.value === etat);
  }

  annuler() {
    const modalEl = document.getElementById('addPlanningModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    this.intervention = null;
    this.planning = {
      dateDebut: '',
      heureDebutH: null,
      heureDebutM: null,
      dateFin: '',
      heureFinH: null,
      heureFinM: null,
      tempsTrajetEstimeH: 0,
      tempsTrajetEstimeMin: 0,
      interventionId: 0
    };
  }

  addPlanning() {
    if (!this.planning.dateDebut) { alert('La date de début est obligatoire !'); return; }

    const payload = {
      date_debut_intervention: this.planning.dateDebut,
      heure_debut_intervention_h: Number(this.planning.heureDebutH) || 0,
      heure_debut_intervention_min: Number(this.planning.heureDebutM) || 0,
      date_fin_intervention: this.planning.dateFin || this.planning.dateDebut,
      heure_fin_intervention_h: Number(this.planning.heureFinH) || 0,
      heure_fin_intervention_min: Number(this.planning.heureFinM) || 0,
      temps_trajet_estime_heures: Number(this.planning.tempsTrajetEstimeH) || 0,
      temps_trajet_estime_minutes: Number(this.planning.tempsTrajetEstimeMin) || 0
    };

    this.planningService.addPlanning(this.planning.interventionId, payload)
      .subscribe({
        next: () => { alert('Planning ajouté avec succès !'); this.loadEvents(); this.annuler(); },
        error: (err) => { console.error(err); alert('Erreur lors de l’ajout du planning'); }
      });
  }

  // Clic sur une date pour ajouter planning
  onDateClick(arg: { date: Date; dateStr: string; allDay: boolean }) {
    this.planning.dateDebut = arg.dateStr;
    this.planning.dateFin = arg.dateStr;
    const modalEl = document.getElementById('addPlanningModal');
    if (modalEl) new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false }).show();
  }


  goToDetails(id: number) {
    // Fermer le modal avant redirection
    const modalEl = document.getElementById('eventDetailModal');
    modalEl?.classList.remove('show');
    document.body.classList.remove('modal-open');
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }

    // naviguer vers la page
    this.router.navigate(['/interventions/details', id]);
  }

}