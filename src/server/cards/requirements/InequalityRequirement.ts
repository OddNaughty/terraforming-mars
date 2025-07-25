import {CardRequirement} from './CardRequirement';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';

/**
 * Defines a class of requirements that compare to a given value. Subclasses provide that value
 * with `getScore`.
 *
 * Normal behavior is that the requirement is met when the `getScore` is at least `count`
 * (e.g. requires 3 oceans.) When `max` is true, the requirement is met with `getScore` is at
 * most `count` (e.g. requires max 3 oceans.)
 */
export abstract class InequalityRequirement extends CardRequirement {
  public abstract getScore(player: IPlayer, card: IProjectCard): number;

  public satisfies(player: IPlayer, card: IProjectCard): boolean {
    const score = this.getScore(player, card);
    if (this.max) {
      return score <= this.count;
    }
    return score >= this.count;
  }
}
