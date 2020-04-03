import { Injectable, OnInit } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { CoronavirusModel } from 'src/app/models/coronavirusModel';
import { formatDateTimeNumber, formatViewDateTime } from 'src/app/utils/commonUtils';

@Injectable({
  providedIn: 'root'
})
export class CoronavirusService implements OnInit {

  coronavirusData: Array<CoronavirusModel>;
  totalData: CoronavirusModel;

  fetchingData: boolean;
  noData: boolean;
  dateTime: string;

  constructor(private http: HTTP) { }

  async ngOnInit() {
    this.resetData();
    const covDocument = await this.getCovDocument();
    if (covDocument) {
      const covTable = this.getCovTable(covDocument);
      this.extractDataFromTable(covTable);
      this.sortCoronavirusData();
      this.fetchingData = false;
    } else {
      this.fetchingData = false;
      this.noData = true;
    }
  }

  async getCovDocument(): Promise<Document> {
    let response: HTTPResponse;
    try {
      response = await this.http.get('https://www.worldometers.info/coronavirus/', {}, {});
      const parser = new DOMParser();
      return parser.parseFromString(response?.data, 'text/html');
    } catch (error) {
      console.log('getCovData error:', error);
      return undefined;
    }
  }

  getCovTable(covDocument: Document): HTMLTableElement {
    return (covDocument.getElementById('main_table_countries_today') as HTMLTableElement);
  }

  extractDataFromTable(covTable: HTMLTableElement) {
    const dataTbody = covTable?.getElementsByTagName('tbody')[0] ?? undefined;
    const totalDataTbody = covTable?.getElementsByTagName('tbody')[1] ?? undefined;
    this.extractTableRows(dataTbody);
    this.extractTableRows(totalDataTbody);
  }

  extractTableRows(tbody: HTMLTableSectionElement) {
    const tableRows = tbody?.getElementsByTagName('tr') ?? undefined;
    if (tableRows && Array.from(tableRows).length > 1) {
      // set all data
      for (const tableRow of Array.from(tableRows)) {
        this.coronavirusData.push(this.setDataToArray(tableRow));
      }
    } else {
      // set total data
      this.totalData = this.setDataToArray(tableRows[0]);
    }
  }

  setDataToArray(tableRow: HTMLTableRowElement): CoronavirusModel {
    const coronavirusModel = new CoronavirusModel();
    coronavirusModel.country = tableRow?.cells[0]?.innerText ?? undefined;
    coronavirusModel.totalCases = tableRow?.cells[1]?.innerText ?? undefined;
    coronavirusModel.newCases = tableRow?.cells[2]?.innerText ?? undefined;
    coronavirusModel.totalDeaths = tableRow?.cells[3]?.innerText ?? undefined;
    coronavirusModel.newDeaths = tableRow?.cells[4]?.innerText ?? undefined;
    coronavirusModel.totalRecovered = tableRow?.cells[5]?.innerText ?? undefined;
    coronavirusModel.activeCases = tableRow?.cells[6]?.innerText ?? undefined;
    coronavirusModel.seriousCritical = tableRow?.cells[7]?.innerText ?? undefined;
    coronavirusModel.totalCasesPer1MilPop = tableRow?.cells[8]?.innerText ?? undefined;
    coronavirusModel.deathsPer1MilPop = tableRow?.cells[9]?.innerText ?? undefined;
    coronavirusModel.firstCase = tableRow?.cells[10]?.innerText ?? undefined;
    return coronavirusModel;
  }

  sortCoronavirusData() {
    this.coronavirusData.sort((a, b) => Number(a.totalCases.replace(/[,]/g, '')) - Number(b.totalCases.replace(/[,]/g, ''))).reverse();
  }

  resetData() {
    this.coronavirusData = new Array<CoronavirusModel>();
    this.totalData = new CoronavirusModel();
    this.fetchingData = true;
    this.noData = false;
    const todayDate = new Date(Date.now());
    this.dateTime = formatViewDateTime(`${formatDateTimeNumber(todayDate?.getMonth() + 1)}-${formatDateTimeNumber(todayDate?.getDate())}-${todayDate?.getFullYear()}`);
  }

}
