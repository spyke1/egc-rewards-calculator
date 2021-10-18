import { Component, OnInit } from '@angular/core';
import { EgcData } from './egcdata.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  egcData: EgcData = {
    totalSupply: 1000000000000000,
    burnedTokens: 514725329117038,
    circulatingSupply: 1000000000000,
    rewardPercent: 0.08,
    dailyVolume: 1000000,
    egcHeld: 5000000000,
  };

  public rewards = 0;

  constructor() {
    this.updateCirculatingSupply();
    this.calculateRewards();
  }

  ngOnInit() {
    this.loadLocalStorage();
  }

  loadLocalStorage() {
    this.loadLocalTokensBurned();
    this.loadLocalDailyVolume();
    this.loadLocalTokensHeld();
  }

  loadLocalTokensBurned() {
    const stringValue = localStorage.getItem('egc_tokensBurned');
    const value = parseFloat(stringValue);

    if (!isNaN(value)) {
      this.egcData.burnedTokens = value;
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
  updateCirculatingSupply() {
    this.egcData.circulatingSupply =
      this.egcData.totalSupply - this.egcData.burnedTokens;
  }

  calculateRewards() {
    const totalDistribution = this.totalDistribution();
    const effectivePercentage = this.effectivePercentage();
    this.rewards = effectivePercentage * totalDistribution;
  }

  totalDistribution() {
    return this.egcData.dailyVolume * this.egcData.rewardPercent;
  }

  effectivePercentage() {
    return this.egcData.egcHeld / this.egcData.circulatingSupply;
  }

  // onChange Methods
  onChangeTokensBurned(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.egcData.burnedTokens = parsedValue;
      this.updateCirculatingSupply();
      this.calculateRewards();

      // save to local storage
      localStorage.setItem(
        'egc_tokensBurned',
        this.egcData.burnedTokens.toString()
      );
    }
  }

  onChangeDailyVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.egcData.dailyVolume = parsedValue;
      this.calculateRewards();

      // save to local storage
      localStorage.setItem(
        'egc_dailyVolume',
        this.egcData.dailyVolume.toString()
      );
    }
  }

  onChangeEgcHeld(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.egcData.egcHeld = parsedValue;
      this.calculateRewards();

      // save to local storage
      localStorage.setItem('egc_tokensHeld', this.egcData.egcHeld.toString());
    }
  }
}
