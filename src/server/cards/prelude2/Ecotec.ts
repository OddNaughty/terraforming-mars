import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {Resource} from '../../../common/Resource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class Ecotec extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.ECOTEC,
      tags: [Tag.MICROBE, Tag.PLANT],
      startingMegaCredits: 42,

      behavior: {
        production: {plants: 1},
      },

      metadata: {
        cardNumber: 'PC04', // Renumber
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(42).production((pb) => pb.plants(1)).br;
          b.effect('When you play a bio tag, gain 1 plant or add a microbe to ANY card.',
            (eb) => eb.tag(Tag.MICROBE).tag(Tag.PLANT).tag(Tag.ANIMAL).startEffect.plants(1).slash().resource(CardResource.MICROBE).asterix());
        }),
        description: 'You start with 42 M€. Increase your plant production 1 step.',
      },
    });
  }

  public process(player: IPlayer, count: number): void {
    if (count === 0) {
      return;
    }

    const microbeCards = player.getResourceCards(CardResource.MICROBE);
    if (microbeCards.length === 0) {
      player.stock.add(Resource.PLANTS, count, {log: true});
      return;
    }

    for (let i = 0; i < count; i++) {
      player.defer(
        () => new OrOptions(
          new SelectCard(
            'Select card to gain a microbe',
            'Add microbe',
            microbeCards)
            .andThen(([card]) => {
              player.addResourceTo(card, {qty: 1, log: true});
              return undefined;
            }),

          new SelectOption('Gain plant').andThen(() => {
            player.stock.add(Resource.PLANTS, 1, {log: true});
            return undefined;
          }),
        ),
      );
    }
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
    this.process(player, player.tags.cardTagCount(card, [Tag.ANIMAL, Tag.PLANT, Tag.MICROBE]));
    return undefined;
  }

  public onNonCardTagAdded(player: IPlayer, tag: Tag): void {
    if (tag === Tag.PLANT) {
      this.process(player, 1);
    }
  }
}
