import { Component, OnInit } from '@angular/core';
import { XEEBData } from './XEEBdata.model';
import { CoinDataService } from '../services/coindata.service';
import { ITokenData } from '../models/tokendata';
import { BscResponse } from '../models/bscresponse';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  XEEBData: XEEBData = {
    totalSupply: 1000000000000000,
    burnedTokens: 0,
    teamTokensHeld: 0,
    circulatingSupply: 1000000000000000,
    rewardPercent: 0.08,
    dailyVolume: 0,
    XEEBHeld: 1000000000,
  };
  tokenData: ITokenData;
  bscBurnedResult: BscResponse;
  bscTeamTokensResult: BscResponse;
  bscWalletXEEBHeld: BscResponse;
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

  getWalletAddressXEEBHeld() {
    if (this.walletAddress !== '') {
      this.coinDataService
        .getBscWalletXEEBHeld(this.walletAddress)
        .subscribe((data) => {
          this.bscWalletXEEBHeld = data;
          const value = parseFloat(data.result);
          if (!isNaN(value)) {
            const decValue = value * 0.000000001;
            this.XEEBData.XEEBHeld = decValue;
            this.saveLocalXEEBHeld();
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
        this.XEEBData.burnedTokens = decValue;
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
        this.XEEBData.teamTokensHeld = decValue;
        this.saveLocalTeamTokensHeld();
        this.calculateRewards();
      }
      //console.log(data);
    });
  }

  getTokenData() {
    this.coinDataService.getCoinGeckoTokenData().subscribe((data) => {
      this.tokenData = data;
      this.XEEBData.dailyVolume = this.tokenData.totalVolume;
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
    this.walletAddress = localStorage.getItem('XEEB_walletAddress');
  }

  loadLocalTokensBurned() {
    const stringValue = localStorage.getItem('XEEB_tokensBurned');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.XEEBData.burnedTokens = value;
    }
  }

  loadLocalTeamTokensHeld() {
    const stringValue = localStorage.getItem('XEEB_teamTokensHeld');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.XEEBData.teamTokensHeld = value;
    }
  }

  loadLocalDailyVolume() {
    const stringValue = localStorage.getItem('XEEB_dailyVolume');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.XEEBData.dailyVolume = value;
    }
  }

  loadLocalTokensHeld() {
    const stringValue = localStorage.getItem('XEEB_tokensHeld');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.XEEBData.XEEBHeld = value;
    }
  }

  saveLocalDailyVolume() {
    localStorage.setItem(
      'XEEB_dailyVolume',
      this.XEEBData.dailyVolume.toString()
    );
  }

  saveLocalTokensBurned() {
    localStorage.setItem(
      'XEEB_tokensBurned',
      this.XEEBData.burnedTokens.toString()
    );
  }

  saveLocalTeamTokensHeld() {
    localStorage.setItem(
      'XEEB_teamTokensHeld',
      this.XEEBData.teamTokensHeld.toString()
    );
  }

  saveLocalWalletAddress() {
    localStorage.setItem('XEEB_walletAddress', this.walletAddress);
  }

  saveLocalXEEBHeld() {
    localStorage.setItem('XEEB_tokensHeld', this.XEEBData.XEEBHeld.toString());
  }

  updateCirculatingSupply() {
    this.XEEBData.circulatingSupply =
      this.XEEBData.totalSupply - this.XEEBData.burnedTokens;
  }

  rewardSupply() {
    // team tokens are now earning rewards 2021-12-01
    // this.XEEBData.teamTokensHeld
    return this.XEEBData.totalSupply - this.XEEBData.burnedTokens;
  }

  calculateRewards() {
    this.rewards = this.effectivePercentage() * this.totalDistribution();
  }

  totalDistribution() {
    return this.XEEBData.dailyVolume * this.XEEBData.rewardPercent;
  }

  effectivePercentage() {
    return this.XEEBData.XEEBHeld / this.rewardSupply();
  }

  // onChange Methods
  onChangeTokensBurned(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.XEEBData.burnedTokens = parsedValue;
      this.saveLocalTokensBurned();
      this.updateCirculatingSupply();
      this.calculateRewards();
    }
  }

  onChangeDailyVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.XEEBData.dailyVolume = parsedValue;
      this.saveLocalDailyVolume();
      this.calculateRewards();
    }
  }

  onChangeXEEBHeld(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.XEEBData.XEEBHeld = parsedValue;
      this.saveLocalXEEBHeld();
      this.calculateRewards();
    }
  }

  onChangeWalletAddress(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.walletAddress = value;
    this.saveLocalWalletAddress();
  }
}
