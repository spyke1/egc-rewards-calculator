import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ITokenData } from '../models/tokendata';

@Injectable()
export class CoinDataService {
  constructor(private http: HttpClient) {}

  getTestData() {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=evergrowcoin';

    return this.http.get(url).pipe(map((res) => res[0]));
  }

  getCoinGeckoTokenData(): Observable<ITokenData> {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=evergrowcoin';

    return this.http.get(url).pipe(
      map(
        (data) =>
          ({
            currentPrice: data[0].current_price,
            totalVolume: data[0].total_volume,
            circulatingSupply: data[0].circulating_supply,
            totalSupply: data[0].total_supply,
            maxSupply: data[0].max_supply,
          } as ITokenData)
      )
    );
  }
}
