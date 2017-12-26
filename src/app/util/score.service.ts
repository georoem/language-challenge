import { ChallengeResult } from './../challenge/challenge-result.model';
import { HttpClient } from '@angular/common/http';
import { BlockUI, BlockUIService, NgBlockUI } from 'ng-block-ui';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ScoreService {

    @BlockUI() appBlockUI: NgBlockUI;

    // urlService = 'https://language-challenge-server.azurewebsites.net/';
    urlService = 'http://localhost:1337/';

    constructor(private http: HttpClient, private blockUIService: BlockUIService) {

    }

    public saveScore(score: ChallengeResult) {
        this.appBlockUI.start('Cargando..');
        this.http.post(this.urlService + 'score', score).subscribe(data => {
            this.appBlockUI.stop();
        });
    }

    public getScoreByLevel(level): Array<ChallengeResult>  {
        let score = null;
        this.appBlockUI.start('Cargando..');
        score = this.http.get(this.urlService + 'score/level/' + level);
        this.appBlockUI.stop();
        return score;
    }

    public getAllScore(): Observable<ChallengeResult[]> {
        let score;
        this.appBlockUI.start('Cargando..');
        score = this.http.get<ChallengeResult[]>(this.urlService + 'score');
        this.appBlockUI.stop();
        return score;
    }
}