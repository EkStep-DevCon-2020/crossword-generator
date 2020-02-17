import { Component, OnInit } from '@angular/core';
import { CrosswordService } from '../../services/crossword.service';
import { HttpClient } from '@angular/common/http';
declare const Crossword: any;
declare const generate: any;

@Component({
  selector: 'app-crossword-generator',
  templateUrl: './crossword-generator.component.html',
  styleUrls: ['./crossword-generator.component.css']
})
export class CrosswordGeneratorComponent implements OnInit {

  private conceptNetAPI = `http://api.conceptnet.io/c/en/limit?rel=/r/Synonym&limit=40`;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const x = CrosswordService;
  }

  getRows(val) {
    generate(Number(val));
    this.http.get(this.conceptNetAPI).subscribe((response: any) => {
      console.log(response.edges);
    }, (error) => {
      console.log(error);
    });
  }

  // /s/resource/verbosity

