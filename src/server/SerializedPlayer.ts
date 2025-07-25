import {PlayerId} from '../common/Types';
import {CardName} from '../common/cards/CardName';
import {Color} from '../common/Color';
import {SerializedCard} from './SerializedCard';
import {SerializedTimer} from '../common/SerializedTimer';
import {SerializedUnderworldPlayerData} from './underworld/UnderworldData';
import {AlliedParty} from '../common/turmoil/Types';
import {GlobalParameter} from '../common/GlobalParameter';
import {DiscordId} from './server/auth/discord';

interface DeprecatedFields {
}

export interface SerializedPlayer extends DeprecatedFields{
  actionsTakenThisGame: number;
  actionsTakenThisRound: number;
  actionsThisGeneration: Array<CardName>;
  alliedParty: AlliedParty | undefined;
  autoPass: boolean;
  beginner: boolean;
  canUseHeatAsMegaCredits: boolean;
  canUseTitaniumAsMegacredits: boolean;
  canUsePlantsAsMegaCredits: boolean;
  cardCost: number;
  cardDiscount: number;
  cardsInHand: Array<CardName>;
  colonyTradeDiscount: number;
  colonyTradeOffset: number;
  colonyVictoryPoints: number;
  color: Color;
  corporations?: Array<SerializedCard>;
  dealtCorporationCards: Array<CardName>;
  dealtCeoCards: Array<CardName>;
  dealtPreludeCards: Array<CardName>;
  dealtProjectCards: Array<CardName>;
  draftedCards: Array<CardName>;
  draftHand: Array<CardName>,
  energy: number;
  energyProduction: number;
  fleetSize: number;
  handicap: number;
  hasIncreasedTerraformRatingThisGeneration: boolean;
  hasTurmoilScienceTagBonus: boolean;
  heat: number;
  heatProduction: number;
  id: PlayerId;
  lastCardPlayed?: CardName;
  ceoCardsInHand: Array<CardName>;
  megaCreditProduction: number;
  megaCredits: number;
  name: string;
  needsToDraft: boolean | undefined;
  oceanBonus: number;
  pendingInitialActions: Array<CardName> | undefined;
  pickedCorporationCard: CardName | undefined;
  plantProduction: number;
  plants: number;
  plantsNeededForGreenery: number;
  // TODO(kberg): Remove ? by 2025-08-01
  plantTagCount?: number;
  playedCards: Array<SerializedCard>;
  politicalAgendasActionUsedCount: number;
  preludeCardsInHand: Array<CardName>;
  preservationProgram: boolean;
  removedFromPlayCards: Array<CardName>;
  removingPlayers: Array<PlayerId>;
  scienceTagCount: number;
  standardProjectsThisGeneration: Array<CardName>;
  steel: number;
  steelProduction: number;
  steelValue: number;
  terraformRating: number;
  timer: SerializedTimer;
  titanium: number;
  titaniumProduction: number;
  titaniumValue: number;
  totalDelegatesPlaced: number;
  tradesThisGeneration: number;
  turmoilPolicyActionUsed: boolean;
  underworldData: SerializedUnderworldPlayerData;
  victoryPointsByGeneration: Array<number>;
  globalParameterSteps: Record<GlobalParameter, number>;
  user?: DiscordId;
}
