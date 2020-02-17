import { Injectable } from '@angular/core';
import { ICrossWord } from '../interfaces/crossword';
@Injectable({
  providedIn: 'root'
})
export class CrosswordService {

  public width: number;

  crossWord = {
    width: 4,
    height: 4,
  };

  constructor() { }

  crosswordCell(letter) {
    const char = letter;
    const across = null;
    const down = null;
  }

  crosswordCellNode(startingWord, i) {
    const is_start_of_word = startingWord;
    const index = i;
  }

  // crossWord(words_in, clues_in, GRID_ROWS, GRID_COLS): any {

  //   // var GRID_ROWS = 15;
  //   // var GRID_COLS = 15;
  //   width = GRID_COLS;
  //   const height = GRID_ROWS;

  //   // This is an index of the positions of the char in the crossword (so we know where we can potentially place words)
  //   // example {"a" : [{'row' : 10, 'col' : 5}, {'row' : 62, 'col' :17}], {'row' : 54, 'col' : 12}], "b" : [{'row' : 3, 'col' : 13}]}
  //   // where the two item arrays are the row and column of where the letter occurs
  //   let char_index = {};

  //   // these words are the words that can't be placed on the crossword
  //   let bad_words;

  // }



}
