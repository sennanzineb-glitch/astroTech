import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixInterventionComponent } from './choix-intervention.component';

describe('ChoixInterventionComponent', () => {
  let component: ChoixInterventionComponent;
  let fixture: ComponentFixture<ChoixInterventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixInterventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
