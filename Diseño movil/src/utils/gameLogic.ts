/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DutyItem, RightItem } from '../data/rightsAndDuties';

/**
 * Calculates percentage integer between 0 and 100
 */
export function calculateProgress(completed: number, total: number): number {
  if (total <= 0) return 0;
  if (completed <= 0) return 0;
  const pct = Math.round((completed / total) * 100);
  return Math.min(100, Math.max(0, pct));
}

/**
 * Evaluates whether the user's category match is correct
 */
export function evaluateChallengeCard(
  userCategory: 'DAR' | 'RECIBIR',
  correctCategory: 'DAR' | 'RECIBIR'
): boolean {
  return userCategory.toUpperCase() === correctCategory.toUpperCase();
}

/**
 * Determines citizen badge title and status based on total score
 */
export function getScoreLevel(
  score: number,
  total: number
): { title: string; badge: string; description: string } {
  if (total <= 0) {
    return {
      title: 'Explorador en Salud',
      badge: '🏅',
      description: 'Iniciando tu recorrido por tus derechos y deberes.',
    };
  }
  const ratio = score / total;
  if (ratio >= 0.85) {
    return {
      title: 'Defensor del Trato Digno',
      badge: '⭐',
      description: '¡Conocimiento ejemplar! Conoces a fondo tus derechos y cumples tus deberes con excelencia.',
    };
  }
  if (ratio >= 0.5) {
    return {
      title: 'Usuario Comprometido',
      badge: '🌟',
      description: '¡Muy buen avance! Identificas la gran mayoría de derechos y deberes en el hospital.',
    };
  }
  return {
    title: 'Aprendiz Activo',
    badge: '🌱',
    description: 'Continúa explorando la cartilla para fortalecer tu conocimiento en salud.',
  };
}

/**
 * Cleans string for safe case-insensitive matching
 */
export function sanitizeSearchTerm(term: string): string {
  return term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Filters rights and duties by query and category filter
 */
export function filterRightsAndDuties<T extends DutyItem | RightItem>(
  items: T[],
  query: string,
  categoryFilter: 'all' | 'duty' | 'right' = 'all'
): T[] {
  const cleanQuery = sanitizeSearchTerm(query);

  return items.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    if (!cleanQuery) return true;

    const matchTitle = sanitizeSearchTerm(item.title).includes(cleanQuery);
    const matchDesc = sanitizeSearchTerm(item.fullDesc).includes(cleanQuery);
    const matchTip = sanitizeSearchTerm(item.practicalTip).includes(cleanQuery);
    const matchLetter = sanitizeSearchTerm(item.letter) === cleanQuery;

    return matchTitle || matchDesc || matchTip || matchLetter;
  });
}
