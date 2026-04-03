import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NavStep {
  id: number | string;
  label: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly STORAGE_KEY = 'navigation_path';
  private path: NavStep[] = [];
  
  // On initialise le Subject avec une valeur vide par défaut
  private pathSubject = new BehaviorSubject<NavStep[]>([]);
  path$ = this.pathSubject.asObservable();

  constructor() {
    // AU CHARGEMENT : On tente de récupérer l'historique sauvegardé
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const savedPath = sessionStorage.getItem(this.STORAGE_KEY);
    if (savedPath) {
      try {
        this.path = JSON.parse(savedPath);
        this.pathSubject.next([...this.path]);
      } catch (e) {
        console.error("Erreur lors de la lecture du fil d'Ariane", e);
        this.path = [];
      }
    }
  }

  private saveToStorage() {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.path));
  }

  pushStep(id: number | string, label: string, type: string) {
    // Sécurité : évite d'ajouter des étapes vides
    if (!id || !label) return;

    const stepKey = `${type}_${id}`;
    const lastStep = this.path[this.path.length - 1];

    // 1. Vérification : Étape strictement identique à la dernière
    if (lastStep && `${lastStep.type}_${lastStep.id}` === stepKey) {
      return;
    }

    // 2. Recherche d'un éventuel retour en arrière (élément déjà présent dans la pile)
    const index = this.path.findIndex(step => step.id === id && step.type === type);

    if (index !== -1) {
      // CAS : RETOUR ARRIÈRE
      // On conserve l'élément et on coupe tout ce qu'il y avait après
      this.path = this.path.slice(0, index + 1);
      this.path[index].label = label; // Mise à jour du label au cas où
    } else {
      // CAS : NOUVELLE ÉTAPE
      // Si le dernier élément est du même TYPE (ex: passage d'une Agence A à une Agence B)
      // On remplace le dernier par le nouveau au lieu d'empiler.
      if (lastStep && lastStep.type === type) {
        this.path[this.path.length - 1] = { id, label, type };
      } else {
        // Sinon, c'est une plongée dans la hiérarchie, on ajoute.
        this.path.push({ id, label, type });
      }
    }

    // 3. Persistance et Diffusion
    this.saveToStorage();
    this.pathSubject.next([...this.path]);
  }

  reset() {
    this.path = [];
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.pathSubject.next([]);
  }

  // Optionnel : supprimer uniquement la dernière étape
  popStep() {
    if (this.path.length > 0) {
      this.path.pop();
      this.saveToStorage();
      this.pathSubject.next([...this.path]);
    }
  }
}