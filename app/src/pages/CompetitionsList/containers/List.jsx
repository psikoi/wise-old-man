import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { competitionSelectors } from 'redux/competitions';
import { getMetricIcon } from 'utils';
import { Table, TablePlaceholder, StatusDot } from 'components';

function convertStatus(status) {
  switch (status) {
    case 'upcoming':
      return 'NEUTRAL';
    case 'ongoing':
      return 'POSITIVE';
    case 'finished':
      return 'NEGATIVE';
    default:
      return null;
  }
}

const TABLE_CONFIG = {
  uniqueKey: row => row.id,
  columns: [
    {
      key: 'metric',
      width: 30,
      transform: value => <img src={getMetricIcon(value)} alt="" />
    },
    {
      key: 'title',
      className: () => '-primary',
      transform: (val, row) => <Link to={`/competitions/${row.id}`}>{val}</Link>
    },
    {
      key: 'status',
      className: () => '-break-small',
      transform: (value, row) => {
        return (
          <div className="status-cell">
            <StatusDot status={convertStatus(value)} />
            <span>{row && row.countdown}</span>
          </div>
        );
      }
    },
    {
      key: 'participantCount',
      transform: val => `${val} participants`,
      className: () => '-break-large'
    }
  ]
};

function List() {
  const competitions = useSelector(competitionSelectors.getCompetitions);
  const isLoading = useSelector(competitionSelectors.isFetchingList);

  return (
    <div className="col">
      {isLoading && (!competitions || competitions.length === 0) ? (
        <TablePlaceholder size={5} />
      ) : (
        <Table
          uniqueKeySelector={TABLE_CONFIG.uniqueKey}
          columns={TABLE_CONFIG.columns}
          rows={competitions}
          listStyle
        />
      )}
    </div>
  );
}

export default List;
