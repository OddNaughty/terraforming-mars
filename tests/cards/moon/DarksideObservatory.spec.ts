import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {DarksideObservatory} from '../../../src/server/cards/moon/DarksideObservatory';
import {PhysicsComplex} from '../../../src/server/cards/base/PhysicsComplex';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';
import {PrideoftheEarthArkship} from '../../../src/server/cards/moon/PrideoftheEarthArkship';
import {ProcessorFactory} from '../../../src/server/cards/moon/ProcessorFactory';
import {NanotechIndustries} from '../../../src/server/cards/moon/NanotechIndustries';

describe('DarksideObservatory', () => {
  let player: TestPlayer;
  let card: DarksideObservatory;

  // Physics Complex: 2 points per resource.
  const physicsComplex = new PhysicsComplex();
  // Search for Life: 3 points if 1 > 0 resources.
  const searchForLife = new SearchForLife();
  // Olympus Conference: play a card.
  const olympusConference = new OlympusConference();
  // Pride of the Earth Arkship: 1 VP
  const prideoftheEarthArkship = new PrideoftheEarthArkship();
  // ProcessorFactory: Data
  const processorFactory = new ProcessorFactory();
  // Nanotech Industries: Corp with science
  const nanotechIndustries = new NanotechIndustries();

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new DarksideObservatory();
  });

  it('can act', () => {
    player.playedCards.set();
    expect(card.canAct(player)).is.false;

    player.playedCards.set(physicsComplex);
    expect(card.canAct(player)).is.false;

    player.playedCards.set(searchForLife);
    expect(card.canAct(player)).is.false;

    player.playedCards.set(olympusConference);
    expect(card.canAct(player)).is.true;

    player.playedCards.set(prideoftheEarthArkship);
    expect(card.canAct(player)).is.true;

    player.playedCards.set(processorFactory);
    expect(card.canAct(player)).is.true;

    player.playedCards.set();
    player.corporations.push(nanotechIndustries);
    expect(card.canAct(player)).is.true;
  });

  it('act', () => {
    player.playedCards.set(physicsComplex, searchForLife, olympusConference, prideoftheEarthArkship, processorFactory);
    player.corporations.push(nanotechIndustries);
    const input = card.action(player);

    expect(input.cards).has.members([olympusConference, prideoftheEarthArkship, processorFactory, nanotechIndustries]);

    olympusConference.resourceCount = 0;
    input.cb([olympusConference]);
    expect(olympusConference.resourceCount).eq(1);

    prideoftheEarthArkship.resourceCount = 0;
    input.cb([prideoftheEarthArkship]);
    expect(prideoftheEarthArkship.resourceCount).eq(1);

    processorFactory.resourceCount = 0;
    input.cb([processorFactory]);
    expect(processorFactory.resourceCount).eq(2);

    nanotechIndustries.resourceCount = 0;
    input.cb([nanotechIndustries]);
    expect(nanotechIndustries.resourceCount).eq(1);
  });
});

