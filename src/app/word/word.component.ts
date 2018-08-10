import { Subscription } from 'rxjs/Subscription';
import { WordTypeChallenge } from './../challenge/challenge.model';
import { FormControl, Validators } from '@angular/forms';
import { Word } from './word.model';
import { WordService } from './word.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Input } from '@angular/core';
import { WordPaletteService } from './../word-palette/word-palette.service';
import { Howl } from 'howler';
import { ChallengeService } from './../challenge/challenge.service';


@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit,OnDestroy {

  @Input('wordTypes') wordTypes: WordTypeChallenge[];

  @Input('word') word: any;

  @Input('level') level: string;

  @Input('challengeType') challengeType: string;

  private subscription: Subscription = new Subscription();

  selectedWord = new Word('', '', '', '');

  digitWord;

  sound: Howl;

  onWord;

  TOLERANCE = 1;

  isChecked: boolean;

  wordState = WORD_STATE.UNCHECK;

  WORD_STATE = WORD_STATE;

  constructor(private wordService: WordService, private wordPaletteService: WordPaletteService,
  private challengeService: ChallengeService) {

    this.subscription.add(wordPaletteService.changeWord$.subscribe(
      change => {
        this.changeWord();
    }));
  }

  ngOnInit() {
  }

  changeWord() {
     const word = this.wordService.getWord(this.word.type, this.level);
     if (word) {
       this.selectedWord = word;
     }
     this.digitWord = '';
     this.wordState = WORD_STATE.UNCHECK;
     this.isChecked = false;
  }

  playWordSound(word) {
    this.sound = new Howl({
      src: ['http://howjsay.com/mp3/' + word + '.mp3'],
      html5 : true
    });

    this.sound.play();
  }

  checkWord() {
    if (!this.isChecked) {
      const isValid = this.evaluateWord();
      this.isChecked = true;
      this.wordService.checkwordCallback(isValid);
    } else {
      this.challengeService.nextStep(true);
    }
  }

  evaluateWord() {
    let differences = 0;
      let isValid = false;
      if (this.digitWord) {
        isValid = true;
        if (this.digitWord.length > this.selectedWord.wordTranslate.length
          || this.digitWord.length < this.selectedWord.wordTranslate.length ) {
          isValid = false;
        } else {
          const word = this.digitWord.toLowerCase();
          for (let i = 0, len = word.length; i < len; i++) {
            if (word.charAt(i) !== this.selectedWord.wordTranslate.charAt(i)) {
              differences++;
              if (differences > this.TOLERANCE) {
                isValid = false;
                break;
              }
            }
          }
        }
      }
      if (differences > 0 && isValid) {
        this.wordState = WORD_STATE.ALMOST_VALID;
      } else if (isValid) {
        this.wordState = WORD_STATE.VALID;
      } else {
        this.wordState = WORD_STATE.INVALID;
      }
      return isValid;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

export enum WORD_STATE {
  UNCHECK = 0,
  VALID = 1,
  INVALID = 2,
  ALMOST_VALID = 3
}
