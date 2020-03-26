import { Covid19Interface } from '../interfaces/covid19Interface';

export function formatDateTimeNumber(num: number) {
  return String(num).length === 1 ? `0${num}` : String(num);
}

export function handleQuotes(covidDataString: string): string {
  const indexes = new Array();
  for (let i = 0; i < covidDataString.length; i++) {
    if (covidDataString[i] === '"') {
      indexes.push(i);
    }
  }
  if (indexes.length) {
    let startingIndex: number;
    let endingIndex: number;
    let stringBewteenChars: string;
    let replacedString: string;
    for (const [index, indexValue] of indexes.entries()) {
      if (index % 2) {
        endingIndex = indexValue + 1;
        stringBewteenChars = covidDataString.substring(startingIndex, endingIndex);
        replacedString = covidDataString.substring(startingIndex, endingIndex).replace(/["]/g, '').replace(/[,]/g, '.');
        covidDataString = covidDataString.replace(stringBewteenChars, replacedString);
      } else {
        startingIndex = indexValue;
      }
    }
  }
  return covidDataString;
}

export function formatViewDateTime(dateTimeInUse: string) {
    return `${dateTimeInUse.substr(3, 2)}/${dateTimeInUse.substr(0, 2)}/${dateTimeInUse.substr(6, 4)}`;
}

export function getGlobalData(covidDataArray: Array<Covid19Interface>): Covid19Interface {
    return covidDataArray[0];
}
