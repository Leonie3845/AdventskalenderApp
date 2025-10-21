import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent  implements OnInit {

  dayNumber!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Listen for changes in route params
    this.route.paramMap.subscribe(params => {
      this.dayNumber = Number(params.get('id'));
    });
  }

}
