import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  addOutline,
  alertCircleOutline,
  arrowBackOutline,
  bagHandleOutline,
  calendarOutline,
  callOutline,
  cartOutline,
  chatbubbleOutline,
  checkmarkCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  closeOutline,
  createOutline,
  cubeOutline,
  homeOutline,
  locationOutline,
  lockClosedOutline,
  logOutOutline,
  mailOutline,
  peopleOutline,
  personCircleOutline,
  personOutline,
  receiptOutline,
  removeOutline,
  saveOutline,
  searchOutline,
  shieldCheckmarkOutline,
  syncOutline,
  timeOutline,
  trashOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {
    // Ionic 8: registrar expresamente los iconos utilizados en los templates.
    // Evita los recuadros vacíos si la carga automática de iconos no está disponible.
    addIcons({
      addOutline,
      alertCircleOutline,
      arrowBackOutline,
      bagHandleOutline,
      calendarOutline,
      callOutline,
      cartOutline,
      chatbubbleOutline,
      checkmarkCircleOutline,
      chevronBackOutline,
      chevronForwardOutline,
      closeOutline,
      createOutline,
      cubeOutline,
      homeOutline,
      locationOutline,
      lockClosedOutline,
      logOutOutline,
      mailOutline,
      peopleOutline,
      personCircleOutline,
      personOutline,
      receiptOutline,
      removeOutline,
      saveOutline,
      searchOutline,
      shieldCheckmarkOutline,
      syncOutline,
      timeOutline,
      trashOutline
    });
  }
}
