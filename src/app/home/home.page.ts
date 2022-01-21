import { Component, OnInit } from '@angular/core';
import { EgcData } from './egcdata.model';
import { CoinDataService } from '../services/coindata.service';
import { ITokenData } from '../models/tokendata';
import { BscResponse } from '../models/bscresponse';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  egcData: EgcData = {
    totalSupply: 1000000000000000,
    burnedTokens: 0,
    teamTokensHeld: 0,
    circulatingSupply: 1000000000000000,
    rewardPercent: 0.10,
    dailyVolume: 0,
    egcHeld: 1000000000,
  };
  tokenData: ITokenData;
  bscBurnedResult: BscResponse;
  bscTeamTokensResult: BscResponse;
  bscWalletEGCHeld: BscResponse;
  walletAddress: string;
  totalRewardDistribution: number;

  public rewards = 0;

  constructor(private coinDataService: CoinDataService) {}

  ngOnInit() {
    this.loadLocalStorage();
    this.getBscBurnData();
    this.getBscTeamTokensData();
    this.getTokenData();
  }

  getWalletAddressEGCHeld() {
    if (this.walletAddress !== '') {
      this.coinDataService
        .getBscWalletEGCHeld(this.walletAddress)
        .subscribe((data) => {
          this.bscWalletEGCHeld = data;
          const value = parseFloat(data.result);
          if (!isNaN(value)) {
            const decValue = value * 0.000000001;
            this.egcData.egcHeld = decValue;
            this.saveLocalEGCHeld();
            this.calculateRewards();
          }
          //console.log(data);
        });
    }
  }

  getBscBurnData() {
    this.coinDataService.getBscBurnData().subscribe((data) => {
      this.bscBurnedResult = data;
      const value = parseFloat(data.result);
      if (!isNaN(value)) {
        const decValue = value * 0.000000001;
        this.egcData.burnedTokens = decValue;
        this.saveLocalTokensBurned();
        this.updateCirculatingSupply();
        this.calculateRewards();
      }
      //console.log(data);
    });
  }

  getBscTeamTokensData() {
    this.coinDataService.getBscTeamData().subscribe((data) => {
      this.bscTeamTokensResult = data;
      const value = parseFloat(data.result);
      if (!isNaN(value)) {
        const decValue = value * 0.000000001;
        this.egcData.teamTokensHeld = decValue;
        this.saveLocalTeamTokensHeld();
        this.calculateRewards();
      }
      //console.log(data);
    });
  }

  getTokenData() {
    this.coinDataService.getCoinGeckoTokenData().subscribe((data) => {
      this.tokenData = data;
      this.egcData.dailyVolume = this.tokenData.totalVolume;
      this.saveLocalDailyVolume();
      this.calculateRewards();
      //console.log(data);
    });
  }

  loadLocalStorage() {
    this.loadLocalTokensBurned();
    this.loadLocalDailyVolume();
    this.loadLocalTeamTokensHeld();
    this.loadLocalWalletAddress();
    this.loadLocalTokensHeld();
  }

  loadLocalWalletAddress() {
    this.walletAddress = localStorage.getItem('egc_walletAddress');
  }

  loadLocalTokensBurned() {
    const stringValue = localStorage.getItem('egc_tokensBurned');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.egcData.burnedTokens = value;
    }
  }

  loadLocalTeamTokensHeld() {
    const stringValue = localStorage.getItem('egc_teamTokensHeld');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.egcData.teamTokensHeld = value;
    }
  }

  loadLocalDailyVolume() {
    const stringValue = localStorage.getItem('egc_dailyVolume');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.egcData.dailyVolume = value;
    }
  }

  loadLocalTokensHeld() {
    const stringValue = localStorage.getItem('egc_tokensHeld');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.egcData.egcHeld = value;
    }
  }

  saveLocalDailyVolume() {
    localStorage.setItem(
      'egc_dailyVolume',
      this.egcData.dailyVolume.toString()
    );
  }

  saveLocalTokensBurned() {
    localStorage.setItem(
      'egc_tokensBurned',
      this.egcData.burnedTokens.toString()
    );
  }

  saveLocalTeamTokensHeld() {
    localStorage.setItem(
      'egc_teamTokensHeld',
      this.egcData.teamTokensHeld.toString()
    );
  }

  saveLocalWalletAddress() {
    localStorage.setItem('egc_walletAddress', this.walletAddress);
  }

  saveLocalEGCHeld() {
    localStorage.setItem('egc_tokensHeld', this.egcData.egcHeld.toString());
  }

  updateCirculatingSupply() {
    this.egcData.circulatingSupply =
      this.egcData.totalSupply - this.egcData.burnedTokens;
  }

  rewardSupply() {
    // team tokens are now earning rewards 2021-12-01
    // this.egcData.teamTokensHeld
    return 20000000000000  //this.egcData.totalSupply - this.egcData.burnedTokens - this.egcData.teamTokensHeld;
  }

  calculateRewards() {
    this.rewards = this.effectivePercentage() * this.totalDistribution();
  }

  totalDistribution() {
    return this.egcData.dailyVolume * this.egcData.rewardPercent;
  }

  effectivePercentage() {
    return this.egcData.egcHeld / this.rewardSupply();
  }

  // onChange Methods
  onChangeTokensBurned(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.egcData.burnedTokens = parsedValue;
      this.saveLocalTokensBurned();
      this.updateCirculatingSupply();
      this.calculateRewards();
    }
  }

  onChangeDailyVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.egcData.dailyVolume = parsedValue;
      this.saveLocalDailyVolume();
      this.calculateRewards();
    }
  }

  onChangeEgcHeld(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.egcData.egcHeld = parsedValue;
      this.saveLocalEGCHeld();
      this.calculateRewards();
    }
  }

  onChangeWalletAddress(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.walletAddress = value;
    this.saveLocalWalletAddress();
  }
}
