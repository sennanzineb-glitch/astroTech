import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  private readonly pathSubject = new BehaviorSubject<NavStep[]>([]);
  public readonly path$: Observable<NavStep[]> =
    this.pathSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Pour le type "secteur", l'unicité est basée sur le label.
   * Pour les autres types, l'unicité est basée sur l'id.
   */
  private getStepKey(step: NavStep): string {
    if (step.type === 'secteur') {
      return `${step.type}_${step.label.trim().toLowerCase()}`;
    }

    return `${step.type}_${step.id}`;
  }

  /**
   * Charger depuis le sessionStorage
   */
  private loadFromStorage(): void {
    const savedPath = sessionStorage.getItem(this.STORAGE_KEY);

    if (!savedPath) {
      return;
    }

    try {
      const parsedPath: NavStep[] = JSON.parse(savedPath);

      if (Array.isArray(parsedPath)) {
        this.path = this.removeDuplicates(parsedPath);
        this.updateState();
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement du breadcrumb :',
        error
      );
      this.reset();
    }
  }

  /**
   * Supprimer les doublons
   */
  private removeDuplicates(steps: NavStep[]): NavStep[] {
    const uniqueSteps: NavStep[] = [];
    const seen = new Set<string>();

    for (const step of steps) {
      const key = this.getStepKey(step);

      if (!seen.has(key)) {
        seen.add(key);
        uniqueSteps.push({
          id: step.id,
          label: step.label,
          type: step.type
        });
      }
    }

    return uniqueSteps;
  }

  /**
   * Sauvegarder
   */
  private saveToStorage(): void {
    sessionStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.path)
    );
  }

  /**
   * Mettre à jour l'état
   */
  private updateState(): void {
    this.path = this.removeDuplicates(this.path);
    this.saveToStorage();
    this.pathSubject.next([...this.path]);
  }

  /**
   * Ajouter une étape
   */
  pushStep(
    id: number | string,
    label: string,
    type: string
  ): void {
    if (
      id === null ||
      id === undefined ||
      !label?.trim() ||
      !type?.trim()
    ) {
      return;
    }

    const newStep: NavStep = {
      id,
      label: label.trim(),
      type: type.trim()
    };

    const stepKey = this.getStepKey(newStep);

    const existingIndex = this.path.findIndex(
      step => this.getStepKey(step) === stepKey
    );

    if (existingIndex !== -1) {
      this.path[existingIndex] = newStep;

      if (existingIndex < this.path.length - 1) {
        this.path = this.path.slice(0, existingIndex + 1);
      }

      this.updateState();
      return;
    }

    this.path.push(newStep);
    this.updateState();
  }

  /**
   * Supprimer la dernière étape
   */
  popStep(): void {
    if (this.path.length === 0) {
      return;
    }

    this.path.pop();
    this.updateState();
  }

  /**
   * Réinitialiser
   */
  reset(): void {
    this.path = [];
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.pathSubject.next([]);
  }

  /**
   * Naviguer vers une étape
   */
  navigateTo(step: NavStep): void {
    const stepKey = this.getStepKey(step);

    const index = this.path.findIndex(
      item => this.getStepKey(item) === stepKey
    );

    if (index !== -1) {
      this.path = this.path.slice(0, index + 1);
      this.updateState();
    }
  }

  /**
   * Retourner le chemin
   */
  getCurrentPath(): NavStep[] {
    return [...this.path];
  }

  /**
   * Dernière étape
   */
  getLastStep(): NavStep | null {
    return this.path.length > 0
      ? this.path[this.path.length - 1]
      : null;
  }

  /**
   * Vérifier l'existence
   */
  hasStep(
    id: number | string,
    type: string,
    label?: string
  ): boolean {
    const key = this.getStepKey({
      id,
      type,
      label: label ?? ''
    });

    return this.path.some(
      step => this.getStepKey(step) === key
    );
  }
}