import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {ValuableGases} from '../../../src/server/cards/pathfinders/ValuableGases';
import {TestPlayer} from '../../TestPlayer';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {AirRaid} from '../../../src/server/cards/colonies/AirRaid';
import {cast, runAllActions} from '../../TestingUtils';
import {toName} from '../../../src/common/utils/utils';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {CardName} from '../../../src/common/cards/CardName';
import {Payment} from '../../../src/common/inputs/Payment';

describe('ValuableGases', () => {
  let card: ValuableGases;
  let player: TestPlayer;

  let floatingHabs: FloatingHabs;
  let jovianLanters: JovianLanterns;
  let localShading: LocalShading;
  let airRaid: AirRaid;

  beforeEach(() => {
    card = new ValuableGases();
    [/* game */, player] = testGame(1);

    // Floating Habs is active, has floaters, requires 2 science, and costs 20
    floatingHabs = new FloatingHabs();
    // Jovian Lanters is active, has floaters, requires a jovian tag, but costs 20
    jovianLanters = new JovianLanterns();
    // Local Shading has floaters and no requirements. Costs 4.
    localShading = new LocalShading();
    // Air Raid is not a floater card
    airRaid = new AirRaid();
  });

  it('canPlay', () => {
    expect(card.canPlay(player)).is.false;

    player.cardsInHand = [localShading];

    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.cardsInHand = [floatingHabs, jovianLanters, localShading, airRaid];
    expect(player.getPlayableCards()).is.empty;

    card.play(player);

    runAllActions(player.game);

    const selectProjectCardToPlay = cast(player.popWaitingFor(), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards.map(toName)).has.members([CardName.LOCAL_SHADING, CardName.FLOATING_HABS]);
    expect(player.megaCredits).eq(10);

    selectProjectCardToPlay.payAndPlay(localShading, {
      ...Payment.EMPTY,
      megaCredits: localShading.cost,
    });

    expect(localShading.resourceCount).eq(5);

    player.playCard(jovianLanters);
    expect(airRaid.resourceCount).eq(0);
  });
});
