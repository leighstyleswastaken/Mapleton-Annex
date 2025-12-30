
import { ExhibitId, LogItem } from '../../types';

export const createLog = (
  id: string,
  exhibitId: ExhibitId,
  text: string,
  tags: string[],
  difficulty: number,
  kind: 'NORMAL' | 'OLLIE_GHOST' | 'HUMAN' = 'NORMAL'
): LogItem => ({
  id,
  exhibitId,
  text,
  redFlagTags: tags,
  difficulty,
  timestamp: 0,
  isScripted: true,
  baseNoiseLevel: 30,
  logKind: kind
});

export const safeBatch = (prefix: string, exhibitId: ExhibitId, difficulty: number, texts: string[]) =>
  texts.map((t, i) => createLog(`${prefix}-s${i + 1}`, exhibitId, t, [], difficulty));

export const hazardBatch = (
  prefix: string,
  exhibitId: ExhibitId,
  difficulty: number,
  entries: Array<{ text: string; tags: string[] }>
) => entries.map((e, i) => createLog(`${prefix}-h${i + 1}`, exhibitId, e.text, e.tags, difficulty));
