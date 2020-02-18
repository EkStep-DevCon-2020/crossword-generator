import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, of, throwError, Observable, Subject, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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

  private relativeParam =  `?rel=/r/UsedFor`;
  private limit = `&limit=100`;
  private contributor = '/s/resource/verbosity';
  public category: any;
  private topic = [
    {type: 'animal', rel: ['/r/UsedFor', '/r/IsA'], sentence: '___ is used for '},
    {type: 'fruits', rel: '/r/HasA', sentence: '___ has a '},
    {type: 'country', rel: '/r/dbpedia/capital', sentence: '___  capital is'}
  ];
  private conceptNetAPI = `http://api.conceptnet.io/c/en/${this.topic[0].type}${this.relativeParam}${this.limit}`;
  private relativeParamArray = [
    '?rel=/r/RelatedTo',
    '?rel=/r/IsA',
    '?rel=/r/HasA',
    '?rel=/r/Synonym',
    '?rel=/r/CapableOf',
    '?rel=/r/HasContext',
    '?rel=/r/ReceivesAction',
    '?rel=/r/HasProperty',
    '?rel=/r/UsedFor',
    '?rel=/r/MannerOf',
    '?rel=/r/MadeOf',
    '?rel=/r/DefinedAs',
    '?rel=/r/AtLocation',
    '?rel=/r/dbpedia/capital'
  ];

  public filteredEdges: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.category = 'animal';
  }


  getRows(val) {

    this.http.get(this.conceptNetAPI).pipe(
      mergeMap((res: any) => {
        const results = res.edges;

        // tslint:disable-next-line:max-line-length
        const request = _.map(results, (result) => this.http.get(`http://api.conceptnet.io/c/en/${result.start.label}${this.relativeParam}${this.limit}`));
        return forkJoin(request);
      })
    ).subscribe((words) => {
      console.log(words);

      this.filteredEdges = _.filter(words, word => {
        return word.edges.length > 0;
      }).map(item => {
        const firstRel = _.find(this.topic, {type: this.category}).rel[0];
        const secondRel = _.find(this.topic, {type: this.category}).rel[1];
        const firstFilter = _.filter(item.edges, i => i.rel['@id'] === firstRel);
        const secondFilter = _.filter(item.edges, i => i.rel['@id'] === secondRel);
        if (firstFilter && firstFilter.length > 2) {
          return {
              ['word']: firstFilter[1].end.label,
              ['clue']: firstFilter[1].start.label
          };
        } else if (secondFilter && secondFilter.length > 2) {
          return {
            ['word']: secondFilter[1].end.label,
            ['clue']: secondFilter[1].start.label
          };
        }
      });
      console.log(this.filteredEdges);
      this.filteredEdges = _.uniqBy(_.compact(this.filteredEdges), 'word');
      console.log(this.filteredEdges);
      generate(Number(val), this.filteredEdges);
    });
}



}
