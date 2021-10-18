import { Component } from '@angular/core';
import { EgcData } from './egcdata.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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
    }
  }

  onChangeDailyVolume(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.egcData.dailyVolume = parsedValue;
      this.calculateRewards();
    }
  }

  onChangeEgcHeld(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      this.egcData.egcHeld = parsedValue;
      this.calculateRewards();
    }
  }
}
