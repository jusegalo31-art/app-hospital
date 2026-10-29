/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProgress,
  evaluateChallengeCard,
  getScoreLevel,
  sanitizeSearchTerm,
  filterRightsAndDuties,
} from './gameLogic';
import { DUTIES_DATA, RIGHTS_DATA } from '../data/rightsAndDuties';

test('calculateProgress returns correct percentage within 0-100 bounds', () => {
  assert.equal(calculateProgress(0, 6), 0);
  assert.equal(calculateProgress(3, 6), 50);
  assert.equal(calculateProgress(6, 6), 100);
  assert.equal(calculateProgress(2, 3), 67);
  assert.equal(calculateProgress(-1, 5), 0);
  assert.equal(calculateProgress(10, 0), 0);
});

test('evaluateChallengeCard checks DAR vs RECIBIR correctly', () => {
  assert.equal(evaluateChallengeCard('DAR', 'DAR'), true);
  assert.equal(evaluateChallengeCard('RECIBIR', 'RECIBIR'), true);
  assert.equal(evaluateChallengeCard('DAR', 'RECIBIR'), false);
  assert.equal(evaluateChallengeCard('RECIBIR', 'DAR'), false);
});

test('getScoreLevel assigns proper tiers based on performance', () => {
  const perfect = getScoreLevel(6, 6);
  assert.equal(perfect.title, 'Defensor del Trato Digno');

  const medium = getScoreLevel(4, 6);
  assert.equal(medium.title, 'Usuario Comprometido');

  const low = getScoreLevel(1, 6);
  assert.equal(low.title, 'Aprendiz Activo');
});

test('sanitizeSearchTerm normalizes accents and case', () => {
  assert.equal(sanitizeSearchTerm('Información Médica'), 'informacion medica');
  assert.equal(sanitizeSearchTerm('  ATENCIÓN  '), 'atencion');
});

test('filterRightsAndDuties filters by category and search keywords', () => {
  const allItems = [...DUTIES_DATA, ...RIGHTS_DATA];
  
  // Test category filter
  const onlyDuties = filterRightsAndDuties(allItems, '', 'duty');
  assert.equal(onlyDuties.length, 3);

  const onlyRights = filterRightsAndDuties(allItems, '', 'right');
  assert.equal(onlyRights.length, 7);

  // Test keyword search
  const punctuality = filterRightsAndDuties(allItems, 'puntualidad', 'all');
  assert.equal(punctuality.length, 1);
  assert.equal(punctuality[0].letter, 'D');

  const accompaniment = filterRightsAndDuties(allItems, 'acompañante', 'all');
  assert.equal(accompaniment.length >= 1, true);
});
