import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowReferenceService {
  get nativeWindow(): Window {
    return window;
  }
}
