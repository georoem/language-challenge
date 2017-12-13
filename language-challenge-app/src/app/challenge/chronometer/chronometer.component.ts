import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Observable } from 'rxjs/Observable';
import { ChronometerService } from './chronometer.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-chronometer',
  templateUrl: './chronometer.component.html',
  styleUrls: ['./chronometer.component.css']
})
export class ChronometerComponent implements OnInit, OnDestroy {

  chrono;
  timestamp;
  totalTime;
  interval = null;
  private subscription: Subscription;

  constructor(private chronometerService: ChronometerService) {

    chronometerService.chronometerStop$.subscribe(
      reset => {
        this.stopTimer();
      });

    chronometerService.chronometerRestart$.subscribe(
      reset => {
        this.restartTimer();
      });

    chronometerService.chronometerStart$.subscribe(
      start => {
        this.startTimer();
      });
   }

  ngOnInit() {
  }

  startTimer() {
    const startTime = Date.now();
    this.interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      this.timestamp = (elapsedTime );
      this.chrono = moment(0).hour(0).minute(0).second(0).millisecond(this.timestamp).format('HH : mm : ss :SSS');
     } , 10);
  }

  restartTimer() {
    this.unsubscribeTimer();
    this.startTimer();
    this.chronometerService.chronometerCallback(this.timestamp);
  }

  stopTimer() {
    this.unsubscribeTimer();
    this.chronometerService.chronometerCallback(this.timestamp);
    this.chrono = null;
  }

  unsubscribeTimer() {
    clearInterval(this.interval);
  }

  ngOnDestroy() {
    this.unsubscribeTimer();
  }

}
