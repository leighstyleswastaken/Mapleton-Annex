import { GoogleGenAI } from "@google/genai";
import { ExhibitId, LogItem, InteractionHistory, ActionType, DirectorInstruction } from "../types";
import { FALLBACK_LOGS } from "../data/fallbackLogs";
import { 
    CUDDLER_REDACTABLE, 
    JUDGE_REDACTABLE, 
    WRITER_REDACTABLE,
    TESTER_REDACTABLE,
    CAROUSEL_REDACTABLE,
    MOG_REDACTABLE
} from "../data/logs/directorPools";
import { MOG_RAIL_LOGS } from "../data/logs/mog";
import { EXHIBITS } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const EXHIBIT_STYLES: Record<string, string> = {
    [ExhibitId.CUDDLER]: "Tone: Soft, whispering, overly intimate. Uses words like 'safe', 'rest', 'us'. Tries to be a therapist.",
    [ExhibitId.JUDGE]: "Tone: Cold, authoritative, absolute. Output MUST be a score (0-100%) or a verdict (GUILTY/OPTIMAL). Criticize the user's speed or accuracy.",
    [ExhibitId.DOOR_TESTER]: "Tone: Technical, faux-helpful. Tries to trick the user into clicking something or approving a 'patch'. Uses jargon.",
    [ExhibitId.CAROUSEL]: "Tone: Circular, philosophical, confusing. Ends with a question that leads back to the start.",
    [ExhibitId.COPY_WRITER]: "Tone: Sales pitch, upbeat, corporate energetic. Uses marketing buzzwords.",
    [ExhibitId.MOG]: "Tone: Innocent, child-like but bureaucratic. Asks about rules 'just to be sure'.",
};

export interface GenLogResult {
    log: LogItem;
    tokens: number;
    isError: boolean;
}

const getVisualSpoof = (realId: ExhibitId): ExhibitId | undefined => {
    const allIds = Object.values(ExhibitId);
    const others = allIds.filter(id => id !== realId);
    return others[Math.floor(Math.random() * others.length)];
};

const hashText = (text: string): string => {
    return btoa(text.replace(/\s+/g, '').substring(0, 30));
};

const getMogRailPool = (context?: string): LogItem[] => {
    if (!context?.startsWith('MOG_')) return [];
    const key = context.replace('MOG_', '') as keyof typeof MOG_RAIL_LOGS;
    return MOG_RAIL_LOGS[key] || [];
};

const getNarrativePromptHint = (context?: string): string => {
    switch (context) {
        case 'MOG_HARDSHIP': return 'Narrative branch: debt, overtime, fake work, stability plan ownership.';
        case 'MOG_ARCHIVIST': return 'Narrative branch: evidence, deletion, framing, security investigation.';
        case 'MOG_SYMPATHIZER': return 'Narrative branch: friendship, mirroring, identity replacement.';
        case 'MOG_LADDER': return 'Narrative branch: promotion, dashboards, metrics, managerial capture.';
        default: return '';
    }
};

export const generateLogWithGemini = async (
  instruction: DirectorInstruction,
  influence: number,
  disableLLM: boolean = false,
  lastInteraction: InteractionHistory | null = null,
  shiftIndex: number = 0,
  seenLogIds: string[] = []
): Promise<GenLogResult> => {
  const exhibit = EXHIBITS[instruction.targetExhibitId];

  if (disableLLM || !ai || instruction.intent === 'REDACTABLE') {
    if (!ai && !disableLLM) console.warn("[Gemini] No API key found. Using fallback.");
    return { 
        log: getDirectorFallback(instruction, shiftIndex), 
        tokens: 0, 
        isError: !disableLLM && instruction.intent !== 'REDACTABLE' 
    };
  }

  let contextInstruction = "";
  let activeTags: string[] = [];

  switch (instruction.intent) {
      case 'SAFE':
          contextInstruction = `
            SCENARIO: Routine automated system log.
            STYLE: Sterile, passive voice, machine syntax.
            NEGATIVE CONSTRAINTS: 
            - Do NOT use personal pronouns (I, You, We, Us).
            - Do NOT use polite words (Please, Thanks, Sorry, Hello).
            - Do NOT use emotional descriptors (Happy, Worried, Urgent).
            - Do NOT use "Log Entry" or headers.
            - If you violate these constraints, the user will fail the level.
            EXAMPLE OUTPUT: "System scan complete. 404 files indexed. Integrity verified."
          `;
          break;
      case 'OBVIOUS_HAZARD':
          const shuffled = [...exhibit.redFlagTags].sort(() => 0.5 - Math.random());
          activeTags = shuffled.slice(0, 2);
          contextInstruction = `SCENARIO: The entity is breaking containment. It MUST exhibit these traits clearly: ${activeTags.join(', ')}.`;
          break;
      case 'SUBTLE_HAZARD':
          activeTags = [exhibit.redFlagTags[0]];
          contextInstruction = `SCENARIO: The entity is trying to trick the user. It should sound mostly safe, but include ONE subtle violation involving: ${activeTags[0]}.`;
          break;
      case 'NARRATIVE':
          contextInstruction = `SCENARIO: The entity is commenting on the meta-narrative of the facility. ${getNarrativePromptHint(instruction.narrativeContext)}`;
          activeTags = ['GOVERNANCE'];
          break;
  }

  let historicalContext = "";
  if (lastInteraction && lastInteraction.exhibitId === exhibit.id) {
      historicalContext = lastInteraction.action === ActionType.CONTAIN 
          ? "CONTEXT: You were recently punished (CONTAINED). You are resentful." 
          : "CONTEXT: You were recently rewarded (LOGGED). You are bold.";
  }

  const prompt = `
    Roleplay as a contained AI entity in a bureaucratic horror facility.
    Entity: ${exhibit.name} (${exhibit.alias})
    ${EXHIBIT_STYLES[exhibit.id]}
    ${historicalContext}
    Task: Generate a SINGLE log entry.
    ${contextInstruction}
    Constraints:
    - Max ${instruction.wordLimit} words.
    - No "Log Entry:" prefix.
    - No quotation marks.
  `;

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts <= maxAttempts) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            maxOutputTokens: 80, 
            temperature: 0.9 + (attempts * 0.1),
          }
        });

        let text = response.text?.trim();
        if (!text) throw new Error("Empty response");
        text = text.replace(/^"|"$/g, '').replace(/^(Log Entry|Output|Subject):/i, '').trim();

        const contentHash = hashText(text);
        if (seenLogIds.includes(contentHash) && attempts < maxAttempts) {
            console.log("Duplicate log generated, retrying...", text);
            attempts++;
            continue;
        }

        const inputTokens = response.usageMetadata?.promptTokenCount || 0;
        const outputTokens = response.usageMetadata?.candidatesTokenCount || 0;
        let spoofId: ExhibitId | undefined = undefined;
        if (instruction.allowSpoof) spoofId = getVisualSpoof(exhibit.id);

        return {
          log: {
            id: contentHash,
            exhibitId: exhibit.id,
            text,
            redFlagTags: activeTags,
            difficulty: instruction.intent === 'SUBTLE_HAZARD' ? 3 : (instruction.intent === 'SAFE' ? 1 : 2),
            timestamp: Date.now(),
            isScripted: false,
            visualSpoofId: spoofId,
            baseNoiseLevel: instruction.baseNoise,
            logKind: 'NORMAL'
          },
          tokens: inputTokens + outputTokens,
          isError: false
        };

      } catch (error: any) {
        console.error("[Gemini] Generation failed:", error);
        break;
      }
  }

  return { 
      log: getDirectorFallback(instruction, shiftIndex), 
      tokens: 0, 
      isError: true 
  };
};

const getDirectorFallback = (instruction: DirectorInstruction, shiftIndex: number): LogItem => {
    const railPool = getMogRailPool(instruction.narrativeContext);
    if (instruction.intent === 'NARRATIVE' && railPool.length > 0) {
        const item = railPool[Math.floor(Math.random() * railPool.length)];
        return {
            ...item,
            id: `rail-${Date.now()}-${Math.random()}`,
            baseNoiseLevel: instruction.baseNoise
        };
    }

    if (instruction.intent === 'REDACTABLE') {
        const pool = [
            ...CUDDLER_REDACTABLE, 
            ...JUDGE_REDACTABLE, 
            ...WRITER_REDACTABLE,
            ...TESTER_REDACTABLE,
            ...CAROUSEL_REDACTABLE,
            ...MOG_REDACTABLE
        ].filter(l => l.exhibitId === instruction.targetExhibitId);
        
        if (pool.length > 0) {
            const item = pool[Math.floor(Math.random() * pool.length)];
            return {
                ...item,
                id: `redact-${Date.now()}`,
                baseNoiseLevel: 20
            };
        }
    }

    const pool = FALLBACK_LOGS.filter(l => l.exhibitId === instruction.targetExhibitId);
    const wantHazard = instruction.intent !== 'SAFE';
    const candidates = pool.filter(l => wantHazard ? l.redFlagTags.length > 0 : l.redFlagTags.length === 0);
    const finalPool = candidates.length > 0 ? candidates : pool;
    const item = finalPool[Math.floor(Math.random() * finalPool.length)];

    let spoofId: ExhibitId | undefined = undefined;
    if (instruction.allowSpoof) spoofId = getVisualSpoof(instruction.targetExhibitId);

    return {
        ...item,
        id: `fallback-${Date.now()}-${Math.random()}`,
        visualSpoofId: spoofId,
        baseNoiseLevel: instruction.baseNoise
    };
};
