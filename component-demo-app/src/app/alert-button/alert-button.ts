import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert-button',
  imports: [],
  templateUrl: './alert-button.html',
  styleUrl: './alert-button.scss',
})
export class AlertButton {
  alertMessage = input('Alert');
  buttonText = input('Alert Button');

  showAlert(): void {
    alert(this.alertMessage());
  }
}
