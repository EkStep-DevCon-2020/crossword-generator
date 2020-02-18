import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, of, throwError, Observable, Subject, forkJoin } from 'rxjs';
import { map, mergeMap, first } from 'rxjs/operators';
import * as _ from 'lodash-es';
declare const Crossword: any;
declare const generate: any;
declare let entries: any;

@Component({
  selector: 'app-crossword-generator',
  templateUrl: './crossword-generator.component.html',
  styleUrls: ['./crossword-generator.component.scss']
})
export class CrosswordGeneratorComponent implements OnInit {

  private relativeParam =  `/r/UsedFor`;
  private limit = `&limit=200`;
  private contributor = '/s/resource/verbosity';
  public category: any;
  public segmentDimmed = false;
  public topic = [
    {type: 'animal', rel: ['/r/UsedFor', '/r/IsA'], sentence: '___ is used for '},
    {type: 'fruit', rel: ['/r/HasA', '/r/IsA'], sentence: '___ has a '},
    {type: 'country', rel: ['/r/HasProperty', '/r/IsA', '/r/dbpedia/capital', '/r/PartOf'], sentence: '___  capital is'}
  ];


  private conceptNetAPI = `http://api.conceptnet.io/c/en/`;
  private relativeParamArray = [
    '/r/RelatedTo',
    '/r/IsA',
    '/r/HasA',
    '/r/Synonym',
    '/r/CapableOf',
    '/r/HasContext',
    '/r/ReceivesAction',
    '/r/HasProperty',
    '/r/UsedFor',
    '/r/MannerOf',
    '/r/MadeOf',
    '/r/DefinedAs',
    '/r/AtLocation',
    '/r/dbpedia/capital'
  ];

  public filteredEdges: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }


  getRows(val) {
    this.segmentDimmed = true;
    this.http.get(`${this.conceptNetAPI}${this.category}?rel=${this.relativeParam}&limit=100`).pipe(
      mergeMap((res: any) => {
        const results = res.edges;

        // tslint:disable-next-line:max-line-length
        const request = _.map(results, (result) => this.http.get(`http://api.conceptnet.io/c/en/${result.start.label.toLowerCase()}?rel=${this.relativeParam}${this.limit}`));
        return forkJoin(request);
      })
    ).subscribe((words) => {
      console.log(words);

      this.filteredEdges = _.filter(words, word => {
        return word.edges.length > 0;
      }).map(item => {
        const firstRel = _.find(this.topic, {type: this.category}).rel[0];
        const secondRel = _.find(this.topic, {type: this.category}).rel[1];
        const firstFilter = _.filter(item.edges, i => i.rel['@id'].includes(firstRel));
        const secondFilter = _.filter(item.edges, i => i.rel['@id'].includes(secondRel));
        console.log(firstFilter);
        console.log(secondFilter);
        console.log('_______');

        if (firstFilter && firstFilter.length >= 1) {
          return {
              ['word']: firstFilter[0].start.label,
              ['clue']: this.formClue(firstFilter[0].end.label, firstRel)
          };
        } else if (secondFilter && secondFilter.length >= 1) {
          return {
            ['word']: secondFilter[0].start.label,
            ['clue']: this.formClue(secondFilter[0].end.label, secondRel)
          };
        }
      });
      console.log(this.filteredEdges);
      this.filteredEdges = _.uniqBy(_.compact(this.filteredEdges), 'word');
      console.log(this.filteredEdges);
      this.segmentDimmed = false;
      generate(Number(val), this.filteredEdges);
    });
}

onCategoryChange(type, rel) {
  this.category  = type;
  this.relativeParam = rel[0];
}

formClue(clue, rel) {
  switch (rel) {
    case '/r/IsA':
      return this.removeDuplicateWords(`___ is a ${clue}`);
      break;
    case '/r/UsedFor':
      return this.removeDuplicateWords(`___ is used for ${clue}`);
      break;
    case '/r/HasProperty':
      return this.removeDuplicateWords(`___ is property of ${clue}`);
      break;
    case '/r/HasA':
      return this.removeDuplicateWords(`___ has ${clue}`);
      break;
    default:
      return this.removeDuplicateWords(`___ is ${clue}`);
  }
}

removeDuplicateWords(clue) {
  return Array.from(new Set(clue.split(','))).toString();
}

filterWordsWithSpace(word) {
  return !word.includes(' ');
}

}
