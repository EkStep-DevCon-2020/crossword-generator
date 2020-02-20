import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService, TelemetryService } from '../../services';
import { Subscription, of, throwError, Observable, Subject, forkJoin } from 'rxjs';
import { map, mergeMap, first, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';

// import path from 'path';
// import * as path from 'path';
// import * as fileURLToPath from 'url';

// // tslint:disable-next-line:variable-name
// const __filename = fileURLToPath(import.meta.url);
// // tslint:disable-next-line:variable-name
// const __dirname = path.dirname(__filename);


// const __dirname = dirname(fileURLToPath(import.meta.url));

declare const Crossword: any;
declare const generate: any;
declare let entries: any;
declare let globalCW: any;
declare const addLegendToPage: any;
declare const printJson: any;
declare const hi_general: any;
declare const hi_vocabulary: any;
declare const en_animals: any;
declare const en_biology: any;
declare const en_computer: any;
declare const en_countryCapitals: any;
declare const en_planets: any;
declare let chosenLanguage: any;
declare const finalPuzzle: any;
declare const settings: any;

// declare const __dirname;

@Component({
  selector: 'app-crossword-generator',
  templateUrl: './crossword-generator.component.html',
  styleUrls: ['./crossword-generator.component.scss']
})
export class CrosswordGeneratorComponent implements OnInit, AfterViewInit  {

  private relativeParam =  `/r/UsedFor`;
  private limit = `&limit=200`;
  private contributor = '/s/resource/verbosity';
  public category: any;
  public segmentDimmed = false;
  public customClues = false;
  public wordClues: any;
  public showEditButton = false;
  public showModal = false;
  public editingClues = false;
  public publishedContentURL: any;
  public currentLanguage;
  public callType;
  public topic = [
    {label: 'Animals', type: 'animal', rel: ['/r/UsedFor', '/r/IsA'], sentence: '___ is used for ', lang: 'en', call: 'api'},
    {label: 'Fruits', type: 'fruit', rel: ['/r/HasA', '/r/IsA'], sentence: '___ has a ', lang: 'en', call: 'api'},
    // tslint:disable-next-line:max-line-length
    {label: 'Countries', type: 'country', rel: ['/r/HasProperty', '/r/IsA', '/r/dbpedia/capital', '/r/PartOf'], sentence: '___  capital is', lang: 'en', call: 'api'},
    {label: 'Capitals', type: 'capitals', rel: en_countryCapitals, sentence: '', lang: 'en', call: 'local'},
    {label: 'Animals', type: 'animals', rel: en_animals, sentence: '', lang: 'en', call: 'local'},
    {label: 'Biology', type: 'biology', rel: en_biology, sentence: '', lang: 'en', call: 'local'},
    {label: 'Computer', type: 'computer', rel: en_computer, sentence: '', lang: 'en', call: 'local'},
    {label: 'Country Capital', type: 'capitals', rel: en_countryCapitals, sentence: '', lang: 'en', call: 'local'},
    {label: 'Planets', type: 'planets', rel: en_planets, sentence: '', lang: 'en', call: 'local'},
    {label: 'Hindi Vocabulary', type: 'hindi_vocab', rel: hi_vocabulary, sentence: '', lang: 'hi', call: 'local'},
    {label: 'Hindi General', type: 'hi_general', rel: hi_general, sentence: '', lang: 'hi', call: 'local'}
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
  constructor(private http: HttpClient, public configService: ConfigService, public telemetryService: TelemetryService) { }

  ngOnInit() {
    // this.getRows(10);
  }


  getRows(val) {
   if (this.callType === 'api') {
      this.segmentDimmed = true;
      this.showEditButton = false;
      this.category = this.category || 'animal';
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
      this.filteredEdges = _.uniqBy(_.compact(this.filteredEdges), 'word');
      this.segmentDimmed = false;
      this.showEditButton = true;
      this.customClues = true;
      generate(Number(val), this.filteredEdges);
      this.wordClues = globalCW;
    });
  } else {
    this.filteredEdges = this.relativeParam;
    this.showEditButton = true;
    this.customClues = true;
    generate(Number(val), this.filteredEdges);
    this.wordClues = globalCW;
  }
}

onCategoryChange(type, rel, lang, callType) {
  this.category  = type;
  this.relativeParam = _.isUndefined(rel[0].word) ? rel[0] : rel;
  this.currentLanguage = lang;
  chosenLanguage = this.currentLanguage;
  this.callType = callType;
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

updateClue(e, id) {
  const presentInAcross = _.find(this.wordClues.across, {id});
  // const presentInDown = _.find(this.wordClues.down, {id});
  const searchObj = (presentInAcross) ? this.wordClues.across : this.wordClues.down;
  const newWordClues = _.map(searchObj, (obj) => {
    return obj.id === id ? {  ...obj, clue: e.target.value } : obj;
  });
  (presentInAcross) ? this.wordClues.across = newWordClues : this.wordClues.down = newWordClues;
  // addLegendToPage(this.wordClues);
  printJson(this.wordClues);
}
editState() {
  this.editingClues = !this.editingClues;
}
removeDuplicateWords(clue) {
  return Array.from(new Set(clue.split(','))).toString();
}

filterWordsWithSpace(word) {
  return !word.includes(' ');
}

createContent() {
  // console.log(`${__dirname}`);
  const headers = {
    'Content-Type':  'application/json',
  };

  const data = {
    request: {
      json: finalPuzzle
    }
  };
  this.http.post('http://localhost:2345/createzip', data, {headers}).subscribe((response: any) => {
    console.log(response);
    const contentID = response.data.result.node_id;
    this.telemetryService.engagement({
      contentId: contentID,
      contentType: 'crossword',
      contentName: 'crossword',
      profileId: this.telemetryService.profileId
    });
    this.publishContent(contentID);
  }, error => {
    console.log(error);
  });
}

publishContent(contentID) {
  const headers = {
    'Content-Type':  'application/json',
    // tslint:disable-next-line:max-line-length
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZWU4YTgxNDNiZWE0NDU4YjQxMjcyNTU5ZDBhNTczMiJ9.7m4mIUaiPwh_o9cvJuyZuGrOdkfh0Nm0E_25Cl21kxE'
  };

  const data = {
    request: {
      content: {
        publisher: 'EkStep',
        lastPublishedBy: 'Ekstep'
      }
    }
  };

  this.http.post(`https://devcon.sunbirded.org/api/private/content/v3/publish/${contentID}`, data, {headers})
    .subscribe((response: any) => {
      this.showModal = true;
      console.log(response.result.node_id);
      this.publishedContentURL = `https://devcon.sunbirded.org/play/content/${response.result.node_id}?contentType=Resource`
  }, error => {
    console.log(error);
  });

}

ngAfterViewInit() {
  generate(20, en_countryCapitals);
}

}
