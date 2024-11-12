import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-progress-page',
  templateUrl: './progress-page.component.html',
  styleUrls: ['./progress-page.component.css']
})
export class ProgressPageComponent implements OnInit {
  progressRecords: any[] = [];
  isUpdating = false;
  showNewProgressForm = false;  
  newProgress = { 
    workoutType: '',
    progressGoal: 0,
    currentProgress: 0
  };

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getProgressRecords();
  }

  getProgressRecords(): void {
    this.sharedService.getProgress().subscribe(
      (data) => {
        this.progressRecords = data.map((record: any) => ({
          ...record,
          newProgress: record.currentProgress  
        }));
      },
      (error) => {
        console.error('Error fetching progress records:', error);
      }
    );
  }

  getProgressPercentage(currentProgress: number, progressGoal: number): number {
    return progressGoal > 0 ? (currentProgress / progressGoal) * 100 : 0;
  }

  createNewProgress(): void {
    const newProgressData = {
      workoutType: this.newProgress.workoutType,
      progressGoal: this.newProgress.progressGoal,
      currentProgress: this.newProgress.currentProgress,
      userid: 1  // Ensure this is set correctly
    };
  
    console.log('Sending new progress data:', newProgressData);  // Log the data being sent
  
    this.sharedService.createProgress(newProgressData).subscribe({
      next: (response) => {
        console.log('New progress created:', response);
        this.getProgressRecords();  // Refresh the progress records
        this.showNewProgressForm = false;
        this.newProgress = { workoutType: '', progressGoal: 0, currentProgress: 0 };
      },
      error: (error) => {
        console.error('Error creating progress:', error);
      }
    });
  }
  


  updateProgress(workoutType: string, newProgress: number): void {
    this.isUpdating = true;

    this.sharedService.updateProgress(workoutType, newProgress).subscribe({
      next: (response) => {
        console.log('Progress updated:', response);
        this.getProgressRecords();
      },
      error: (error) => {
        console.error('Error updating progress:', error);
      },
      complete: () => {
        this.isUpdating = false;
      }
    });
  }
}
