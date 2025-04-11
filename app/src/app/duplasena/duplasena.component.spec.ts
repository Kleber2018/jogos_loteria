import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplasenaComponent } from './duplasena.component';

describe('RelatorioComponent', () => {
  let component: DuplasenaComponent;
  let fixture: ComponentFixture<DuplasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplasenaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DuplasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
