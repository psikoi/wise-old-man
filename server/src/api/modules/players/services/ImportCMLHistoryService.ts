import { uniqBy } from 'lodash';
import { z } from 'zod';
import prisma, { PlayerOperationType } from '../../../../prisma';
import { Period, PeriodProps, Snapshot, SnapshotDataSource } from '../../../../utils';
import { ServerError } from '../../../errors';
import * as cmlService from '../../../services/external/cml.service';
import * as snapshotServices from '../../snapshots/snapshot.services';
import { interpolateMissingValues, isValidHistory } from '../../snapshots/snapshot.utils';
import * as playerEvents from '../player.events';

const YEAR_IN_SECONDS = PeriodProps[Period.YEAR].milliseconds / 1000;

const inputSchema = z.object({
  username: z.string(),
  id: z.number().positive()
});

type ImportCMLHistoryParams = z.infer<typeof inputSchema>;

async function importCMLHistory(payload: ImportCMLHistoryParams): Promise<{ count: number }> {
  const { id, username } = inputSchema.parse(payload);

  // If it's been over a month since the last CML import
  const [shouldImport, lastImportDate] = await shouldImportCML(id);

  if (!shouldImport) return;

  let importedSnapshots: Snapshot[] = [];

  if (!lastImportDate) {
    // Import all CML history for the past year
    const yearSnapshots = await fetchCMLHistorySince(id, username, YEAR_IN_SECONDS);

    // Import all CML history for the past decade
    const decadeSnapshots = await fetchCMLHistorySince(id, username, YEAR_IN_SECONDS * 10);

    importedSnapshots = [...yearSnapshots, ...decadeSnapshots];
  } else {
    const secondsSinceLastImport = (Date.now() - lastImportDate.getTime()) / 1000;

    // Import all CML history since the last import
    const recentSnapshots = await fetchCMLHistorySince(id, username, secondsSinceLastImport);

    importedSnapshots = [...recentSnapshots];
  }

  if (importedSnapshots.length > 0) {
    // Sort the new snapshots by date (ascending)
    importedSnapshots = importedSnapshots.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Dedupe the new snapshots
    importedSnapshots = uniqBy(importedSnapshots, 'createdAt');

    // Ensure this player's history is valid (no negative gains, no excessive gains)
    if (!isValidHistory(importedSnapshots)) {
      throw new ServerError('CML history is invalid.');
    }

    // Backfill any missing values
    importedSnapshots = await backfillMissingValues(id, importedSnapshots);

    await prisma.snapshot.createMany({ data: importedSnapshots });
  }

  // Register this import in the database
  await prisma.playerOperation.create({
    data: { playerId: id, type: PlayerOperationType.IMPORT_CML }
  });

  playerEvents.onPlayerImported(id);

  return { count: importedSnapshots.length };
}

async function backfillMissingValues(playerId: number, importedSnapshots: Snapshot[]) {
  // Fetch and sort the current snapshots by date (ascending)
  const currentHistory = (await snapshotServices.findPlayerSnapshots({ id: playerId })).sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );

  return await interpolateMissingValues(currentHistory, importedSnapshots);
}

async function fetchCMLHistorySince(playerId: number, username: string, time: number) {
  // Load the CML history
  const history = await cmlService.getCMLHistory(username, time);

  // Convert the CML CSV data to Snapshot instances
  const snapshots = await Promise.all(
    history.map(row =>
      snapshotServices.buildSnapshot({ playerId, rawCSV: row, source: SnapshotDataSource.CRYSTAL_MATH_LABS })
    )
  );

  return snapshots;
}

async function shouldImportCML(playerId: number): Promise<[boolean, Date | null]> {
  const lastImport = await prisma.playerOperation.findFirst({
    where: { playerId, type: PlayerOperationType.IMPORT_CML },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  return [
    !lastImport || Date.now() - lastImport.createdAt.getTime() > PeriodProps[Period.MONTH].milliseconds,
    lastImport ? lastImport.createdAt : null
  ];
}

export { importCMLHistory };
