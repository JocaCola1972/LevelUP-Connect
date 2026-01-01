
export enum PadelLevel {
    LEVEL_1 = "Nível 1 (Elite)",
    LEVEL_2 = "Nível 2 (Avançado)",
    LEVEL_3 = "Nível 3 (Intermédio Alto)",
    LEVEL_4 = "Nível 4 (Intermédio)",
    LEVEL_5 = "Nível 5 (Intermédio Baixo)",
    LEVEL_6 = "Nível 6 (Iniciante)"
}

export enum PreferredSide {
    DRIVE = "Drive (Direita)",
    REVES = "Revés (Esquerda)",
    AMBOS = "Ambos"
}

export interface Player {
    id: string;
    name: string;
    phone: string;
    level: PadelLevel;
    side: PreferredSide;
    matchesPlayed: number;
    avatar?: string;
}

export interface MatchSuggestion {
    team1: Player[];
    team2: Player[];
    reasoning: string;
    balanceScore: number;
}

export type SlotTime = '08:00 - 09:30' | '09:30 - 11:00' | '11:00 - 13:00';

export interface Booking {
    id: string;
    slotTime: SlotTime;
    playerIds: string[];
}
