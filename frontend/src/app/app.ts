import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SideBar } from './components/side-bar/side-bar';

@Component({
  imports: [RouterOutlet, SideBar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  constructor(public router: Router) { }

  protected readonly title = signal('Employee Management System');
}
