import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare const Crossword: any;
declare const generate: any;

@Component({
  selector: 'app-crossword-generator',
  templateUrl: './crossword-generator.component.html',
  styleUrls: ['./crossword-generator.component.scss']
})
export class CrosswordGeneratorComponent implements OnInit {

  private conceptNetAPI = `http://api.conceptnet.io/c/en/limit?rel=/r/Synonym&limit=40`;

  constructor(private http: HttpClient) { }

  ngOnInit() {}

  getRows(val) {
    generate(Number(val));
    this.http.get(this.conceptNetAPI).subscribe((response: any) => {
      console.log(response.edges);
    }, (error) => {
      console.log(error);
    });
  }
  // /s/resource/verbosity
}
