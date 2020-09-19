import AddToGroupCompetitions from './AddToGroupCompetitions';
import AssertPlayerName from './AssertPlayerName';
import AssertPlayerType from './AssertPlayerType';
import CompetitionEnded from './CompetitionEnded';
import CompetitionEnding from './CompetitionEnding';
import CompetitionStarted from './CompetitionStarted';
import CompetitionStarting from './CompetitionStarting';
import ImportPlayer from './ImportPlayer';
import ReevaluatePlayerAchievements from './ReevaluatePlayerAchievements';
import RefreshNameChanges from './RefreshNameChanges';
import RefreshRankings from './RefreshRankings';
import RemoveFromGroupCompetitions from './RemoveFromGroupCompetitions';
import ReviewNameChange from './ReviewNameChange';
import SyncPlayerDeltas from './SyncPlayerDeltas';
import SyncPlayerParticipations from './SyncPlayerParticipations';
import SyncPlayerRecords from './SyncPlayerRecords';
import UpdatePlayer from './UpdatePlayer';

export default [
  ImportPlayer,
  UpdatePlayer,
  SyncPlayerRecords,
  AddToGroupCompetitions,
  RemoveFromGroupCompetitions,
  ReevaluatePlayerAchievements,
  AssertPlayerName,
  RefreshRankings,
  CompetitionStarted,
  CompetitionStarting,
  CompetitionEnding,
  CompetitionEnded,
  AssertPlayerType,
  SyncPlayerDeltas,
  SyncPlayerParticipations,
  ReviewNameChange,
  RefreshNameChanges
];
