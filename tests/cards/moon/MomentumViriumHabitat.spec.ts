import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TestPlayer} from '../../TestPlayer';
import {MomentumViriumHabitat} from '../../../src/server/cards/moon/MomentumViriumHabitat';
import {NamedMoonSpaces} from '../../../src/common/moon/NamedMoonSpaces';
import {TileType} from '../../../src/common/TileType';

describe('MomentumViriumHabitat', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: MomentumViriumHabitat;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new MomentumViriumHabitat();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    expect(player.production.megacredits).eq(0);
    expect(player.production.heat).eq(0);
    expect(player.terraformRating).eq(14);
    expect(moonData.habitatRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.production.megacredits).eq(3);
    expect(player.production.heat).eq(2);

    const momentumVirium = moonData.moon.getSpaceOrThrow(NamedMoonSpaces.MOMENTUM_VIRIUM);
    expect(momentumVirium.player).eq(player);
    expect(momentumVirium.tile!.tileType).eq(TileType.MOON_HABITAT);

    expect(player.terraformRating).eq(15);
    expect(moonData.habitatRate).eq(1);
  });
});

