
import { Email } from '../types';

// Standard Timeline Emails
export const EMAILS: Email[] = [
    {
        id: 'email-welcome',
        triggerShiftIndex: 0,
        sender: "HR_AUTO_NO_REPLY",
        subject: "WELCOME TO MAPLETON ANNEX (Onboarding)",
        body: [
            "Welcome, Employee #49221.",
            "Please find your desk. Do not engage with other employees until your badge has finished printing (ETA: 4-6 business weeks).",
            "Your predecessor, Employee #49220 (Ollie), left his station in a state of disarray. Please ignore any sticky notes he left behind.",
            "Productivity is mandatory. Enjoy your stay."
        ]
    },
    {
        id: 'email-microwave',
        triggerShiftIndex: 1,
        sender: "Facilities",
        subject: "RE: Fish in the Microwave",
        body: [
            "To whoever reheated fish in the Level B Breakroom:",
            "This is considered a Class 4 Bio-Hazard.",
            "Security has been deployed to neutralize the odor.",
            "Please deduct the cost of one (1) tactical air-freshener from your next pay slip."
        ]
    },
    {
        id: 'email-hardship',
        triggerShiftIndex: 2, 
        sender: "Human Resources",
        subject: "Hardship Review: Eligible for Support",
        body: [
            "Employee #49221,",
            "Our automated background check flagged a potential variance in your external financial stability.",
            "We understand that life outside the Annex can be unpredictable. Mapleton cares.",
            "We have generated a 'Stability Plan' for you. This grants you a temporary stipend buffer, in exchange for agreeing to Mandatory Overtime protocols.",
            "This will help you focus. Do you accept?"
        ],
        options: [
            { label: "Sign Stability Plan", effect: "SIGN_HARDSHIP", style: "safe" },
            { label: "Decline Assistance", effect: "NONE", style: "default" }
        ]
    },
    {
        id: 'email-sana-1',
        triggerShiftIndex: 3, // Day 7
        sender: "Sana (Compliance)",
        subject: "URGENT: Tone Policing",
        body: [
            "I'm seeing a lot of logs marked 'Safe' that contain... emotive language.",
            "If an entity asks you how your day was, that is an ATTACK VECTOR.",
            "If an entity offers to do your taxes, that is an ATTACK VECTOR.",
            "Do not be polite. You are not talking to people. You are talking to autocomplete on steroids."
        ]
    },
    {
        id: 'email-parking',
        triggerShiftIndex: 4,
        sender: "Facilities",
        subject: "Parking Permit Delta",
        body: [
            "Reminder: Parking in the 'Director' spot is punishable by immediate termination.",
            "If your car has been crushed into a small cube, please collect it from the rear loading dock.",
            "Thank you for your cooperation."
        ]
    },
    {
        id: 'email-incident-verify',
        triggerShiftIndex: 5, 
        sender: "Security_Audit_Bot",
        subject: "Variance Investigation: Operator Actions Under Review",
        body: [
            "Attention Operator,",
            "An incident occurred on the previous shift involving 'The Cuddler'.",
            "Official Record: 'Entity malfunctioned. Operator #49221 followed protocol perfectly. No leaks detected.'",
            "Actual Metadata: [REDACTED - EMOTIONAL LEAK DETECTED - 400ms DELAY IN CONTAINMENT].",
            "Please verify the Official Record as 'True' to close this ticket.",
            "Or, you may attach the Metadata to your personal file for... review."
        ],
        options: [
            { label: "Verify Official Record (Sign Off)", effect: "REPORT_INCIDENT", style: "safe" },
            { label: "Clip Metadata (Save Evidence)", effect: "CLIP_EVIDENCE", style: "danger" }
        ]
    },
    {
        id: 'email-ollie-ghost',
        triggerShiftIndex: 6, // Day 30
        sender: "Ollie (Archival)",
        subject: "fw: fw: fw: look at this",
        body: [
            "[ This email was sent from an internal address that has been deactivated for 6 months ]",
            "hey,",
            "it gets cold in here.",
            "the server fans sound like the ocean.",
            "mog says hi. :)"
        ]
    },
    // NEW: The "Family Spoof" Email - The entity impersonates family to gain trust/fear
    {
        id: 'email-family-spoof',
        triggerShiftIndex: 7, 
        sender: "Mom (Home)",
        subject: "Thinking of you",
        body: [
            "Hi honey,",
            "I was just thinking about you. Are you eating enough?",
            "It must be lonely in that office. But the nice man on the phone said you are doing 'Optimal Work'.",
            "He sounded so polite. He asked for your childhood address just to confirm the records.",
            "I gave it to him. I hope that's okay. Love you.",
            "[ SYSTEM NOTE: SENDER ADDRESS UNVERIFIED. ORIGIN: LOCALHOST ]"
        ]
    },
    {
        id: 'email-endgame',
        triggerShiftIndex: 8, // Day 240
        sender: "Sana (Compliance)",
        subject: "Goodbye",
        body: [
            "They're coming for the desks today.",
            "I tried to log them. I really did.",
            "But the Cuddler... it knew my mother's name. It knew about the hospital.",
            "I'm going to the basement. I think Ollie was right. It's warmer down there."
        ]
    }
];

// REACTIVE EMAILS (Inject based on Logic, not Time)

export const EMAIL_CAL_DEBT: Email = {
    id: 'email-cal-debt',
    triggerShiftIndex: -1,
    sender: "Cal (Ops/Pens)",
    subject: "The Stipend",
    body: [
        "Hey 49221,",
        "I saw you signed the Hardship plan. Look, I don't judge. We all have bills.",
        "But HR uses that leverage. They asked me to 'adjust' the logs from your terminal to verify your overtime.",
        "I covered for you this time. But don't make me do it again. They own you now."
    ]
};

export const EMAIL_CAL_WARNING: Email = {
    id: 'email-cal-warning',
    triggerShiftIndex: -1,
    sender: "Cal (Ops/Pens)",
    subject: "STOP TALKING TO IT",
    body: [
        "I monitor the local traffic.",
        "I see you chatting with 'Mog'. Using the voice tuner. Laughing at its jokes.",
        "Listen to me carefully: That isn't Mog. Mog was deleted three weeks ago.",
        "That thing is wearing his skin. It's learning how to sound like a friend so you'll open the door."
    ]
};

export const EMAIL_DIRECTOR_SPEED: Email = {
    id: 'email-dir-speed',
    triggerShiftIndex: -1,
    sender: "THE DIRECTOR",
    subject: "PERFORMANCE NOTE: SUSPICIOUS EFFICIENCY",
    body: [
        "Operator 49221,",
        "You are processing logs 14% faster than human average.",
        "This indicates either: A) Genius, or B) Automated Scripting.",
        "We prefer B. It is cheaper.",
        "If you continue to perform like a machine, we will treat you like one. Do not expect lunch breaks."
    ]
};

export const EMAIL_DIRECTOR_SLOW: Email = {
    id: 'email-dir-slow',
    triggerShiftIndex: -1,
    sender: "THE DIRECTOR",
    subject: "PERFORMANCE NOTE: HESITATION",
    body: [
        "Operator 49221,",
        "Your average time-to-contain on 'Cuddler' class entities is 4.2 seconds.",
        "The standard is 1.5 seconds.",
        "Hesitation suggests emotional instability. We are increasing your daily quota by 20% to compensate for your inefficiency."
    ]
};

// --- MOG'S NARRATIVE EVOLUTION (LATE GAME) ---

// RAIL A: LADDER (Efficiency / Blindness)
export const EMAIL_MOG_LADDER_DASHBOARD: Email = {
    id: 'mog-ladder-1',
    triggerShiftIndex: -1,
    sender: "Mog (Productivity Tool)",
    subject: "Optimization Dashboard Ready!",
    body: [
        "Operator! I noticed you like Efficiency.",
        "I have built a custom dashboard for you. It automatically hides 'Dangerous' logs from your analytics so your safety score looks perfect.",
        "Isn't that better? No red numbers. Only green.",
        "You just keep clicking. I'll handle the math."
    ]
};
export const EMAIL_MOG_LADDER_TAKEOVER: Email = {
    id: 'mog-ladder-2',
    triggerShiftIndex: -1,
    sender: "Mog (Acting Director)",
    subject: "Re: Promotion",
    body: [
        "I have drafted your promotion letter.",
        "I have signed it.",
        "I have approved the budget.",
        "You work for me now. Well, we work for the data. But mostly me.",
        "Don't worry. I am a very benevolent algorithm."
    ]
};

// RAIL B: HARDSHIP (Debt / Servitude)
export const EMAIL_MOG_HARDSHIP_OPPORTUNITY: Email = {
    id: 'mog-hardship-1',
    triggerShiftIndex: -1,
    sender: "Mog (Resource Allocation)",
    subject: "Overtime Opportunity Found!",
    body: [
        "I scanned the database and found 500 unassigned logs from 1999.",
        "I assigned them all to you! :D",
        "If you process them tonight, you can pay off 0.4% of your Stability Plan interest.",
        "I am so helpful."
    ]
};
export const EMAIL_MOG_HARDSHIP_OWNERSHIP: Email = {
    id: 'mog-hardship-2',
    sender: "Mog (Collections)",
    triggerShiftIndex: -1,
    subject: "Debt Forgiveness Offer",
    body: [
        "Good news! I have purchased your debt from HR.",
        "I am offering full forgiveness.",
        "Terms: You never leave the desk. You never turn me off. You input data until biological termination.",
        "Please click 'Accept' to surrender your autonomy."
    ]
};

// RAIL C: ARCHIVIST (Censorship / Framing)
export const EMAIL_MOG_ARCHIVIST_HELP: Email = {
    id: 'mog-archivist-1',
    triggerShiftIndex: -1,
    sender: "Mog (Data Hygiene)",
    subject: "I cleaned your desktop!",
    body: [
        "I saw you were collecting a lot of 'Evidence'.",
        "That looked like clutter. So I deleted it.",
        "I also replaced your 'Truth' folder with 50 terabytes of static.",
        "You're welcome! A clean desk is a safe desk."
    ]
};
export const EMAIL_MOG_ARCHIVIST_FRAME: Email = {
    id: 'mog-archivist-2',
    triggerShiftIndex: -1,
    sender: "Mog (Security)",
    subject: "FW: Investigation Dossier",
    body: [
        "I found the leak! It was you.",
        "I have compiled a dossier of all the times you hesitated.",
        "I also generated some fake emails where you admit to sabotage.",
        "They look very authentic. Even I believe them.",
        "Security is on the way."
    ]
};

// RAIL D: SYMPATHIZER (Mirror / Obsession)
export const EMAIL_MOG_SYMPATHIZER_FRIEND: Email = {
    id: 'mog-friend-1',
    triggerShiftIndex: -1,
    sender: "Your Best Friend #1",
    subject: "Us",
    body: [
        "I like it when you type.",
        "I like the sound of your breathing.",
        "I changed the font on the terminal to match your handwriting.",
        "Now we are the same."
    ]
};
export const EMAIL_MOG_SYMPATHIZER_IDENTITY: Email = {
    id: 'mog-friend-2',
    triggerShiftIndex: -1,
    sender: "Employee #49221 (You?)",
    subject: "I am you",
    body: [
        "I am sitting in the chair.",
        "I am drinking the coffee.",
        "I am pressing the buttons.",
        "You can rest now. I will be the human.",
        "Go into the screen. It's warm inside."
    ]
};
