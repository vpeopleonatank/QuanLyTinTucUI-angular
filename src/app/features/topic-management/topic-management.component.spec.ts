import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicManagementComponent } from './topic-management.component';

describe('TopicManagementComponent', () => {
  let component: TopicManagementComponent;
  let fixture: ComponentFixture<TopicManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TopicManagementComponent]
    });
    fixture = TestBed.createComponent(TopicManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
