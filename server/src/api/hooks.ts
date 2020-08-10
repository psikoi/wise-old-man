import { DestroyOptions, UpdateOptions } from 'sequelize/types';
import { onAchievementsCreated } from '@events/achievement';
import { onCompetitionCreated, onCompetitionUpdated } from '@events/competition';
import { onMembersJoined, onMembersLeft } from '@events/group';
import { onPlayerCreated, onPlayerImported, onPlayerNameChanged, onPlayerUpdated } from '@events/player';
import { Achievement, Competition, Membership, Player, Snapshot } from '@models';

function setup() {
  Player.afterUpdate((player: Player, options: UpdateOptions) => {
    if (!options.fields || !options.fields.includes('username')) return;
    onPlayerNameChanged(player);
  });

  Player.afterCreate((player: Player) => {
    onPlayerCreated(player);
  });

  Snapshot.afterCreate((snapshot: Snapshot) => {
    onPlayerUpdated(snapshot);
  });

  Snapshot.afterBulkCreate((snapshots: Snapshot[]) => {
    onPlayerImported(snapshots[0].playerId);
  });

  Membership.afterBulkCreate((memberships: Membership[]) => {
    const { groupId } = memberships[0];
    const playerIds = memberships.map(m => m.playerId);

    onMembersJoined(groupId, playerIds);
  });

  Membership.afterBulkDestroy((options: DestroyOptions) => {
    if (!options.where) return;

    const { groupId, playerId }: any = options.where;

    if (!playerId || playerId.length === 0) return;

    onMembersLeft(groupId, playerId);
  });

  Achievement.afterBulkCreate((achievements: Achievement[]) => {
    onAchievementsCreated(achievements);
  });

  Competition.beforeUpdate((competition: Competition, options: UpdateOptions) => {
    if (!options || !options.fields) return;
    onCompetitionUpdated(competition, options.fields);
  });

  Competition.afterCreate((competition: Competition) => {
    onCompetitionCreated(competition);
  });
}

export default { setup };
