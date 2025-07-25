import {expect} from 'chai';
import {cast, formatMessage, runAllActions} from '../../TestingUtils';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {PharmacyUnion} from '../../../src/server/cards/promo/PharmacyUnion';
import {Recyclon} from '../../../src/server/cards/promo/Recyclon';
import {Splice} from '../../../src/server/cards/promo/Splice';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {IGame} from '../../../src/server/IGame';

describe('Splice', () => {
  let card: Splice;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new Splice();
    [game, player, player2] = testGame(2);
  });

  it('Should play', () => {
    const tardigrades = new Tardigrades();
    cast(card.play(player), undefined);

    player.corporations.push(card);

    player2.playedCards.push(tardigrades);
    cast(card.onCardPlayedByAnyPlayer(player, tardigrades, player2), undefined);
    runAllActions(game);
    const orOptions = cast(player2.popWaitingFor(), OrOptions);

    expect(orOptions.options).has.lengthOf(2);

    const selectMoney = cast(orOptions.options[0], SelectOption);
    selectMoney.cb(undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(tardigrades.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(2);
  });

  it('Should play with multiple microbe tags', () => {
    const pharmacyUnion = new PharmacyUnion();
    cast(card.play(player), undefined);
    player.corporations.push(card);

    runAllActions(game);
    cast(player.getWaitingFor(), undefined);
    cast(player2.popWaitingFor(), undefined);

    cast(pharmacyUnion.play(player), undefined);
    player2.corporations.push(pharmacyUnion);

    cast(card.onCardPlayedByAnyPlayer(player, pharmacyUnion, player2), undefined);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    cast(player2.popWaitingFor(), undefined);

    expect(player.megaCredits).to.eq(4);
    expect(player2.megaCredits).to.eq(4);
  });

  it('Should grant Recyclon a microbe or 2MC', () => {
    const recyclon = new Recyclon();

    player.playCorporationCard(card);
    runAllActions(game);
    expect(player.megaCredits).eq(48);
    player2.playCorporationCard(recyclon);
    runAllActions(game);

    // Default resource on Recyclon and player2's MC
    expect(recyclon.resourceCount).to.eq(1);
    expect(player2.megaCredits).to.eq(38);

    // Player 2 should have the option to pick a microbe or 2 MC
    const orOptions = cast(player2.getWaitingFor(), OrOptions);
    expect(orOptions.options).has.lengthOf(2);
    expect(orOptions.options[0].title).to.eq('Add a microbe resource to this card');
    expect(formatMessage(orOptions.options[1].title)).to.eq('Gain 2 M€');

    // Pick the microbe
    orOptions.options[0].cb();
    expect(recyclon.resourceCount).to.eq(2);

    // Pick 2 MC
    orOptions.options[1].cb();
    runAllActions(game);
    expect(player2.megaCredits).to.eq(40);
  });
});
