import { mapValues } from 'lodash';
import { BossMeta, Experiences, Killcounts, SkillMeta, VirtualAlgorithm } from '../../../../types';
import mainBossingMetas from '../configs/ehb/main.ehb';
import mainSkillingMetas from '../configs/ehp/main.ehp';
import {
  calculateBossEHB,
  calculateEHB,
  calculateMaxedEHP,
  calculateMaximumEHP,
  calculateTT200m
} from '../util';

class MainAlgorithm implements VirtualAlgorithm {
  type: string;
  skillMetas: SkillMeta[];
  bossMetas: BossMeta[];
  maximumEHP: number;
  maxedEHP: number;

  constructor() {
    this.type = 'main';
    this.skillMetas = mainSkillingMetas;
    this.bossMetas = mainBossingMetas;
    this.maximumEHP = this.calculateMaximumEHP();
    this.maxedEHP = this.calculateMaxedEHP();
  }

  getEHPRates(): SkillMeta[] {
    return this.skillMetas;
  }

  getEHBRates(): BossMeta[] {
    return this.bossMetas;
  }

  calculateMaximumEHP(): number {
    return calculateMaximumEHP(this.skillMetas);
  }

  calculateMaxedEHP(): number {
    return calculateMaxedEHP(this.skillMetas);
  }

  calculateTTM(experiences: Experiences): number {
    const cappedExp = mapValues(experiences, val => Math.min(val, 13_034_431));
    return this.maxedEHP - this.calculateEHP(cappedExp);
  }

  calculateTT200m(experiences: Experiences): number {
    return calculateTT200m(experiences, this.skillMetas);
  }

  calculateEHP(experiences: Experiences): number {
    return this.maximumEHP - this.calculateTT200m(experiences);
  }

  calculateSkillEHP(skill: string, experiences: Experiences): number {
    return this.calculateTT200m({ ...experiences, [skill]: 0 }) - this.calculateTT200m(experiences);
  }

  calculateEHB(killcounts: Killcounts): number {
    return calculateEHB(killcounts, this.bossMetas);
  }

  calculateBossEHB(boss: string, killcounts: Killcounts) {
    return calculateBossEHB(boss, killcounts, this.bossMetas);
  }
}

export default new MainAlgorithm();
