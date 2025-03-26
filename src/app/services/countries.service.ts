import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CountryData {
  name: { common: string };
  idd: { root: string; suffixes: string[] };
  flags: { png: string };  // Add flags property
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any[]> {
    return this.http.get<CountryData[]>(this.REST_COUNTRIES_API).pipe(
      map((countries) => countries.map((country) => ({
        name: country.name.common,
        code: `${country.idd.root}${country.idd.suffixes?.[0] || ''}`,
        emailDomains: this.getEmailDomains(country.name.common),
        flag: country.flags.png // Include the flag image URL
      })))
    );
  }

  private getEmailDomains(countryName: string): string[] {
    const domainMap: { [key: string]: string[] } = {
      'India': ['gmail.com', 'rediffmail.com', 'yahoo.co.in'],
      'United States': ['gmail.com', 'yahoo.com', 'aol.com'],
      'United Kingdom': ['gmail.com', 'hotmail.co.uk', 'yahoo.co.uk'],
      'Australia': ['gmail.com', 'bigpond.com', 'hotmail.com.au'],
      'Germany': ['gmail.com', 'web.de', 'gmx.de'],
      'France': ['gmail.com', 'orange.fr', 'free.fr']
    };

    return domainMap[countryName] || ['gmail.com', 'hotmail.com', 'yahoo.com'];
  }
}