import { Component } from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.css'
})
export class RightSidebarComponent {
  dropdownVisible = false;

  showDropdown() {
    this.dropdownVisible = true;
  }

  hideDropdown() {
    // Delay hiding to allow click events on dropdown items
    setTimeout(() => {
      this.dropdownVisible = false;
    }, 200);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      console.log('searching...');
    }
  }
}
