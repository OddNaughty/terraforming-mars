import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit} from '../Options';
import {Tag} from '../../../common/cards/Tag';

export class UndergroundSmugglingRing extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.UNDERGROUND_SMUGGLING_RING,
      tags: [Tag.CRIME],
      cost: 7,

      requirements: {undergroundTokens: 1},

      behavior: {
        underworld: {corruption: 1},
        standardResource: 2,
      },

      metadata: {
        cardNumber: 'U028',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1).wild(2, {digit}).asterix();
        }),
        description: 'Requires you have 1 underground token. Gain 1 corruption and 2 of the same standard resource.',
      },
    });
  }
}
