import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentListingComponent } from './document-listing.component';

describe('DocumentComponent', () => {
  let component: DocumentListingComponent;
  let fixture: ComponentFixture<DocumentListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
