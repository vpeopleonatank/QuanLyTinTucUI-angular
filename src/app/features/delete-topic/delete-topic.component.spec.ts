import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTopicComponent } from './delete-topic.component';

describe('DeleteTopicComponent', () => {
  let component: DeleteTopicComponent;
  let fixture: ComponentFixture<DeleteTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteTopicComponent]
    });
    fixture = TestBed.createComponent(DeleteTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
