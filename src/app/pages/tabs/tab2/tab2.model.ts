import { Covid19Interface } from 'src/app/interfaces/covid19Interface';

export class Covid19Model implements Covid19Interface {
    FIPS: string;
    Admin2: string;
    Province_State: string;
    Country_Region: string;
    Last_Update: string;
    Lat: string;
    Long_: string;
    Confirmed: string;
    Deaths: string;
    Recovered: string;
    Active: string;
    Combined_Key: string;

    constructor() {}

}
