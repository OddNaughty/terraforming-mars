import {Space} from '../boards/Space';
import {IGame} from '../IGame';
import {LogHelper} from '../LogHelper';
import {Phase} from '../../common/Phase';
import {IPlayer} from '../IPlayer';
import {TileType} from '../../common/TileType';
import {AresData, HazardConstraint} from '../../common/ares/AresData';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';

/**
 * Support for placing and upgrading hazard tiles.
 */
export class AresHazards {
  public static putHazardAt(game: IGame, space: Space, tileType: TileType) {
    space.tile = {tileType: tileType, protectedHazard: false};
    UnderworldExpansion.onTilePlaced(game, space);
  }

  public static randomlyPlaceHazard(game: IGame, tileType: TileType, direction: 'top' | 'bottom', cardCount: 1 | 2 = 1) {
    const cost = game.discardForCost(cardCount, tileType);
    const distance = Math.max(cost - 1, 0); // Some cards cost zero.
    const space = game.board.getNthAvailableLandSpace(
      distance, direction,
      (space) => game.nomadSpace !== space.id);

    this.putHazardAt(game, space, tileType);
    return space;
  }

  public static makeSevere(game: IGame, from: TileType, to: TileType) {
    game.board.spaces
      .filter((s) => s.tile?.tileType === from)
      .forEach((s) => {
        if (s.tile !== undefined) {
          s.tile.tileType = to;
        }
      });

    game.log('${0} have upgraded to ${1}', (b) => b.tileType(from).tileType(to));
  }

  public static onTemperatureChange(game: IGame, aresData: AresData) {
    // This will have no effect if the erosions don't exist, but that's OK --
    // the check for placing erosions will take this into account.
    this.testConstraint(
      aresData.hazardData.severeErosionTemperature,
      game.getTemperature(),
      () => {
        this.makeSevere(game, TileType.EROSION_MILD, TileType.EROSION_SEVERE);
      },
    );
  }

  public static onOceanPlaced(aresData: AresData, player: IPlayer) {
    this.testToPlaceErosionTiles(aresData, player);
    this.testToRemoveDustStorms(aresData, player);
  }

  public static onOxygenChange(game: IGame, aresData: AresData) {
    this.testConstraint(aresData.hazardData.severeDustStormOxygen, game.getOxygenLevel(), () => {
      this.makeSevere(game, TileType.DUST_STORM_MILD, TileType.DUST_STORM_SEVERE);
    });
  }

  private static testToPlaceErosionTiles(aresData: AresData, player: IPlayer) {
    if (player.game.gameOptions.aresHazards === false) {
      return;
    }

    this.testConstraint(
      aresData.hazardData.erosionOceanCount,
      player.game.board.getOceanSpaces().length,
      () => {
        let type = TileType.EROSION_MILD;
        if (aresData.hazardData.severeErosionTemperature.available !== true) {
          type = TileType.EROSION_SEVERE;
        }

        const space1 = this.randomlyPlaceHazard(player.game, type, 'top');
        const space2 = this.randomlyPlaceHazard(player.game, type, 'bottom');
        [space1, space2].forEach((space) => {
          LogHelper.logTilePlacement(player, space, type);
        });
      },
    );
  }

  private static testToRemoveDustStorms(aresData: AresData, player: IPlayer) {
    this.testConstraint(
      aresData.hazardData.removeDustStormsOceanCount,
      player.game.board.getOceanSpaces().length,
      () => {
        player.game.board.spaces.forEach((space) => {
          if (space.tile?.tileType === TileType.DUST_STORM_MILD || space.tile?.tileType === TileType.DUST_STORM_SEVERE) {
            if (space.tile.protectedHazard !== true) {
              space.tile = undefined;
            }
          }
        });

        if (player.game.phase !== Phase.SOLAR) {
          player.increaseTerraformRating();
          player.game.log('${0}\'s TR increases 1 step for eliminating dust storms.', (b) => b.player(player));
        }
      },
    );
  }

  private static testConstraint(constraint: HazardConstraint, testValue: number, cb: () => void) {
    if (!constraint.available) {
      return;
    }
    if (testValue >= constraint.threshold) {
      cb();
      constraint.available = false;
    }
  }
}
