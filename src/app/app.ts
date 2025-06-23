import { CommonModule } from '@angular/common';
import { Component, computed, HostBinding, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {
  protected title = 'CRECERINDEXFRONT';
  //   private darkMode = signal<boolean>(false);
  // protected readonly darkmode$ = computed(() => this.darkMode());

  // setDarkMode() {
  //   const isDark = !this.darkMode();
  //   this.darkMode.set(isDark);
  //   document.documentElement.classList.toggle('dark', isDark);
  //   localStorage.setItem('theme', isDark ? 'dark' : 'light');
  // }

  // ngOnInit() {
  //   const savedTheme = localStorage.getItem('theme');
  //   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  //   this.darkMode.set(isDark);
  //   document.documentElement.classList.toggle('dark', isDark);
  // }

}
