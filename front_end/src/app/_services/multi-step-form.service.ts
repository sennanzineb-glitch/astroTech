import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultiStepFormService {
  constructor() { }

  private formData = new BehaviorSubject<any>({});
  formData$ = this.formData.asObservable();

  setStepData(step: string, data: any) {
    const current = this.formData.getValue();
    this.formData.next({ ...current, [step]: data });
  }

  getFormData() {
    return this.formData.getValue();
  }

}
