import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgressPageComponent } from './progress-page.component';
import { SharedService } from '../shared.service'; 

describe('ProgressPageComponent', () => {
  let component: ProgressPageComponent;
  let fixture: ComponentFixture<ProgressPageComponent>;
  let sharedService: SharedService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressPageComponent],
      imports: [HttpClientTestingModule],
      providers: [SharedService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressPageComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.inject(SharedService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();  // Ensure no pending HTTP requests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch progress records on init', () => {
    const mockProgressRecords = [
      { workoutType: 'Running', currentProgress: '5', progressGoal: '10' },
      { workoutType: 'Cycling', currentProgress: '3', progressGoal: '5' }
    ];

    component.getProgressRecords();
    const req = httpMock.expectOne(`${sharedService.APIUrl}/progress/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProgressRecords);

    expect(component.progressRecords).toEqual(mockProgressRecords);
  });

  it('should update progress record', () => {
    const workoutType = 'Running';
    const currentProgress = 6;

    component.updateProgress(workoutType, currentProgress);
    const req = httpMock.expectOne(`${sharedService.APIUrl}/progress/`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ workout_type: workoutType, current_progress: currentProgress });
    req.flush({ success: true });

  });
});
