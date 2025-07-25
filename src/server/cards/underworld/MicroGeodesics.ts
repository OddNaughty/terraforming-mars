import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {digit} from '../Options';

export class MicroGeodesics extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MICRO_GEODESICS,
      tags: [Tag.PLANT, Tag.MICROBE],
      cost: 8,

      behavior: {
        spend: {resourceFromAnyCard: {type: CardResource.MICROBE}},
        underworld: {excavate: {count: 1}},
        stock: {plants: 3},
        addResourcesToAnyCard: {count: 1, type: CardResource.DATA},
      },

      metadata: {
        cardNumber: 'U056',
        renderData: CardRenderer.builder((b) => {
          b.minus().resource(CardResource.MICROBE).excavate().plants(3, {digit}).resource(CardResource.DATA).asterix();
        }),
        description: 'Spend 1 microbe from any card to excavate an underground resource and gain 3 plants. Add 1 data resource to ANOTHER card.',
      },
    });
  }
}
