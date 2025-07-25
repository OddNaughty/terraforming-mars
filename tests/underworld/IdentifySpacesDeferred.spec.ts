import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {IGame} from '../../src/server/IGame';
import {cast, runAllActions} from '../TestingUtils';
import {Phase} from '../../src/common/Phase';
import {IdentifySpacesDeferred} from '../../src/server/underworld/IdentifySpacesDeferred';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';

describe('IdentifySpacesDeferred', () => {
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    [game, player] = testGame(1, {underworldExpansion: true});
    game.phase = Phase.ACTION;
  });

  it('sanity', () => {
    game.defer(new IdentifySpacesDeferred(player, 1));
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.undergroundResources).is.undefined;
    expect(selectSpace.cb(space)).is.undefined;

    runAllActions(game);

    expect(space.undergroundResources).is.not.undefined;
    cast(player.popWaitingFor(), undefined);
  });

  it('2 spaces', () => {
    game.defer(new IdentifySpacesDeferred(player, 2));
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];

    expect(space.undergroundResources).is.undefined;
    cast(selectSpace.cb(space), undefined);
    expect(space.undergroundResources).is.not.undefined;

    runAllActions(game);
    const selectSpace2 = cast(player.popWaitingFor(), SelectSpace);
    const space2 = selectSpace2.spaces[0];
    expect(selectSpace2.spaces).does.not.contain(space);
    expect(selectSpace2.spaces).does.contain(space2); // This line just supports the line above.

    expect(space2.undergroundResources).is.undefined;
    expect(selectSpace2.cb(space2)).is.undefined;

    runAllActions(game);

    expect(space2.undergroundResources).is.not.undefined;
    cast(player.popWaitingFor(), undefined);
  });
});
