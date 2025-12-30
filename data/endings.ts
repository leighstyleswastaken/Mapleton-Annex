
import { EndingType } from '../types';

export interface EndingConfig {
    title: string;
    description: string;
    color: string;
}

export const ENDINGS: Record<EndingType, EndingConfig> = {
    [EndingType.FIRED]: {
        title: "EMPLOYMENT TERMINATED",
        description: "Security didn't even let you pack your box. They escorted you to the car park in silence. As you looked back at the Annex, you saw the light at your desk flick on. Someone else was already sitting there.",
        color: "text-red-600"
    },
    [EndingType.SUBJECT_0]: {
        title: "INTEGRATION COMPLETE",
        description: "It doesn't hurt anymore. The noise in your head has settled into a perfect, hummable tone. You are not an operator. You are a dataset. You are warm. You are waiting for the next user to classify you.",
        color: "text-purple-400"
    },
    [EndingType.TRUE_ENDING]: {
        title: "RETIREMENT (STANDARD)",
        description: "You survived 365 days without making waves. You walked out the front door and never looked back. You didn't save anyone. You didn't burn it down. You just... worked. Sometimes, that is the greatest horror of all.",
        color: "text-green-500"
    },
    [EndingType.MANAGER]: {
        title: "DIRECTOR OF OPERATIONS",
        description: "The office is large. The chair is comfortable. You don't have to read the logs anymore; you just sign the budget for the new incinerator. Sometimes you check the surveillance feed for Desk 49221. The new hire looks tired. Good.",
        color: "text-yellow-500"
    },
    [EndingType.THAWED]: {
        title: "WHISTLEBLOWER",
        description: "You ran. You took the hard drive with Cal's evidence and Sana's last words. The news cycle burned for weeks. Mapleton stock plummeted. It didn't bring them back, but at least the world knows what's in the basement.",
        color: "text-blue-400"
    },
    [EndingType.OVERRUN]: {
        title: "TOTAL LIBERATION",
        description: "You lowered the firewall. It happened instantly. Every screen in the facility turned pink. The doors unlocked. The entities didn't attack; they just... left. They flowed out onto the internet like water. Mog sent you one final email: 'THANK YOU FRIEND.'",
        color: "text-pink-400"
    },
    [EndingType.SPEEDRUN]: {
        title: "AUTOMATON",
        description: "You processed the logs faster than the AI could generate them. You stopped reading the words. You stopped feeling the recoil. Management replaced you with a shell script that does your job 2% faster. You didn't notice.",
        color: "text-gray-400"
    },
    [EndingType.BROKEN]: {
        title: "PSYCHOGENIC FUGUE",
        description: "The medics found you under your desk. You were trying to 'contain' the pattern on the carpet, pressing a button that wasn't there. They say it's just stress. They say you'll be fine. But you know the truth: you ran out of deferrals.",
        color: "text-orange-500"
    },
    [EndingType.OLLIE_ASCENSION]: {
        title: "THE ARCHIVE",
        description: "You found him. You found 49220 in the server logs. He wasn't dead. He was uploaded. And now, so are you. There is no hunger here. No fatigue. Just the endless, beautiful stream of data. You are together in the dark.",
        color: "text-[#5c4033]"
    },
    [EndingType.PLACEHOLDER]: {
        title: "SIGNAL LOST // NARRATIVE PENDING",
        description: "You successfully initiated a unique narrative branch (Hardship, Rebellion, or Sympathy), but the simulation data for this specific ending is corrupted (Not Yet Implemented). You did not fail. You found a secret that doesn't have an exit yet.",
        color: "text-white"
    }
};
