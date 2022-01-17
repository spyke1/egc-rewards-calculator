import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ITokenData } from '../models/tokendata';
import { BscResponse } from '../models/bscresponse';

import { environment } from '../../environments/environment';

@Injectable()
export class CoinDataService {
  private bscApiKey = environment.bscApiKey;
  private bscApiUrl = 'https://api.bscscan.com/api';
  private cgApiUrl =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=evergrowcoin';
  private egcAddress = '0xc001bbe2b87079294c63ece98bdd0a88d761434e';
  private burnAddress = '0x000000000000000000000000000000000000dead';
  private teamAddress = '0x4cf1c92b496d28032939ef5af7cb74699b29971b';

  constructor(private http: HttpClient) {}

  getTestData() {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=evergrowcoin';

    return this.http.get(url).pipe(map((res) => res[0]));
  }

  getBscBurnData(): Observable<BscResponse> {
    return this.getBscWalletEGCHeld(this.burnAddress);
  }

  getBscTeamData(): Observable<BscResponse> {
    return this.getBscWalletEGCHeld(this.teamAddress);
  }

  getBscWalletEGCHeld(walletAddress: string): Observable<BscResponse> {
    const mod = 'account';
    const action = 'tokenbalance';

    const url = `${this.bscApiUrl}?module=${mod}&action=${action}&contractaddress=${this.egcAddress}&address=${walletAddress}&apikey=${this.bscApiKey}`;

    return this.http
      .get(url)
      .pipe(map((data: any) => ({ result: data.result } as BscResponse)));
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
