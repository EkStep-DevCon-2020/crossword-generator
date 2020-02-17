import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private topic = `animal`;
  private conceptNetAPI = `http://api.conceptnet.io/c/en/${this.topic}${this.relativeParam}${this.limit}`;
  private relativeParamArray = [
    '?rel=/r/RelatedTo',
    '?rel=/r/IsA',
    '?rel=/r/Synonym',
    '?rel=/r/CapableOf',
    '?rel=/r/HasContext',
    '?rel=/r/ReceivesAction',
    '?rel=/r/HasProperty',
    '?rel=/r/UsedFor',
    '?rel=/r/MannerOf',
    '?rel=/r/MadeOf',
    '?rel=/r/DefinedAs',
    '?rel=/r/AtLocation'
  ];

  public filteredEdges: any;
  constructor(private http: HttpClient) { }

  ngOnInit() {}


  getRows(val) {
    this.http.get(this.conceptNetAPI).subscribe((response: any) => {
      console.log(response.edges);
      this.filteredEdges =  _.filter(response.edges, (edge) => {
        if (this.contributor.length > 0) {
          return _.find(edge.sources, {contributor: this.contributor});
        } else {
          return 1;
        }
      }).map(e => {
        return {
          ['word']: e.start.label,
          ['clue']: e.end.label};
      });

      entries = this.filteredEdges;
      generate(Number(val), entries);

    }, (error) => {
      console.log(error);
    });
  }
  // /s/resource/verbosity
}
