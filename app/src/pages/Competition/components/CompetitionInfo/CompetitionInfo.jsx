import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { InfoPanel } from 'components';
import { formatDate, capitalize, getType, getMetricName } from 'utils';
import './CompetitionInfo.scss';

function formatData(competition) {
  const { id, metric, status, participants, duration, startsAt, endsAt, group } = competition;

  const statusClass = classNames({
    '-positive': status === 'ongoing',
    '-neutral': status === 'upcoming',
    '-negative': status === 'finished'
  });

  return [
    { key: 'Id', value: id },
    { key: capitalize(getType(metric)), value: getMetricName(metric) },
    { key: 'Status', value: capitalize(status), className: statusClass },
    { key: 'Group', value: group ? <Link to={`/groups/${group.id}`}>{group.name}</Link> : '---' },
    { key: 'Participants', value: participants ? participants.length : 'Unknown' },
    { key: 'Duration', value: capitalize(duration) },
    {
      key: status === 'upcoming' ? 'Starts at' : 'Started at',
      value: formatDate(startsAt, 'DD MMM YYYY, HH:mm')
    },
    {
      key: status === 'finished' ? 'Ended at' : 'Ends at',
      value: formatDate(endsAt, 'DD MMM YYYY, HH:mm')
    }
  ];
}

function CompetitionInfo({ competition }) {
  const data = useMemo(() => formatData(competition), [competition]);
  return <InfoPanel data={data} />;
}

CompetitionInfo.propTypes = {
  competition: PropTypes.shape().isRequired
};

export default React.memo(CompetitionInfo);
