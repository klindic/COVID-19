import { Covid19Interface } from '../interfaces/covid19Interface';
import { Covid19Model } from '../pages/tabs/tab2/tab2.model';

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

export function getCalculatedData(covidDataArray: Array<Covid19Interface>): Covid19Interface {
    const totalCovidData: Covid19Interface = new Covid19Model();
    totalCovidData.Confirmed = '0';
    totalCovidData.Deaths = '0';
    totalCovidData.Recovered = '0';
    for (const covidData of covidDataArray) {
        if (!isNaN(Number(covidData.Confirmed))) {
            totalCovidData.Confirmed = String(Number(totalCovidData.Confirmed) + Number(covidData.Confirmed));
            totalCovidData.Deaths = String(Number(totalCovidData.Deaths) + Number(covidData.Deaths));
            totalCovidData.Recovered = String(Number(totalCovidData.Recovered) + Number(covidData.Recovered));
        }
    }
    totalCovidData.Confirmed = formatThousandNumber(totalCovidData.Confirmed);
    totalCovidData.Deaths = formatThousandNumber(totalCovidData.Deaths);
    totalCovidData.Recovered = formatThousandNumber(totalCovidData.Recovered);
    return totalCovidData;
}

export function formatThousandNumber(num: string) {
    const arr = num.split('');
    let counter = 0;
    for (let i = arr.length - 1; i > 0; i--) {
        counter++;
        if (counter === 3) {
            arr.splice(i, 0, ',');
            i++;
            counter = -1;
        }
    }
    return arr.join('');
}
