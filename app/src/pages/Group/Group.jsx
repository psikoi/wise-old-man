import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import Tabs from '../../components/Tabs';
import DeleteGroupModal from '../../modals/DeleteGroupModal';
import TopPlayerWidget from './components/TopPlayerWidget';
import TotalExperienceWidget from './components/TotalExperienceWidget';
import CompetitionWidget from './components/CompetitionWidget';
import GroupCompetitions from './components/GroupCompetitions';
import GroupAchievements from './components/GroupAchievements';
import GroupInfo from './components/GroupInfo';
import MembersTable from './components/MembersTable';
import { ALL_METRICS } from '../../config';
import { getGroup, isFetchingMembers, isFetchingMonthlyTop } from '../../redux/selectors/groups';
import { getGroupCompetitions } from '../../redux/selectors/competitions';
import { getGroupAchievements } from '../../redux/selectors/achievements';
import fetchDetailsAction from '../../redux/modules/groups/actions/fetchDetails';
import fetchMembersAction from '../../redux/modules/groups/actions/fetchMembers';
import fetchMonthlyTopAction from '../../redux/modules/groups/actions/fetchMonthlyTop';
import fetchCompetitionsAction from '../../redux/modules/competitions/actions/fetchGroupCompetitions';
import fetchAchievementsAction from '../../redux/modules/achievements/actions/fetchGroupAchievements';
import fetchHiscoresAction from '../../redux/modules/hiscores/actions/fetchGroupHiscores';
import updateAllAction from '../../redux/modules/groups/actions/updateAll';
import './Group.scss';

const TABS = ['Members', 'Competitions', 'Hiscores', 'Gained', 'Records', 'Achievements', 'Statistics'];

const MENU_OPTIONS = [
  {
    label: 'Edit group',
    value: 'edit'
  },
  {
    label: 'Delete group',
    value: 'delete'
  }
];

function getSelectedTabIndex(section) {
  const index = TABS.findIndex(t => section && section === t.toLowerCase());
  return Math.max(0, index);
}

function Group() {
  const { id, section } = useParams();
  const router = useHistory();
  const dispatch = useDispatch();

  const selectedSectionIndex = getSelectedTabIndex(section);

  const [selectedMetric, setSelectedMetric] = useState(ALL_METRICS[0]);
  const [showingDeleteModal, setShowingDeleteModal] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const isLoadingMembers = useSelector(state => isFetchingMembers(state));
  const isLoadingMonthlyTop = useSelector(state => isFetchingMonthlyTop(state));
  const group = useSelector(state => getGroup(state, parseInt(id, 10)));
  const competitions = useSelector(state => getGroupCompetitions(state, parseInt(id, 10)));
  const achievements = useSelector(state => getGroupAchievements(state, parseInt(id, 10)));

  const fetchDetails = () => {
    // Attempt to fetch group of that id, if it fails redirect to 404
    dispatch(fetchDetailsAction(id))
      .then(action => {
        if (action.error) throw new Error();
      })
      .catch(() => router.push('/404'));
  };

  const fetchCompetitions = () => {
    dispatch(fetchCompetitionsAction(id));
  };

  const fetchMembers = () => {
    dispatch(fetchMembersAction(id));
  };

  const fetchAchievements = () => {
    dispatch(fetchAchievementsAction(id));
  };

  const fetchHiscores = () => {
    dispatch(fetchHiscoresAction(id, selectedMetric));
  };

  const fetchMonthlyTop = () => {
    dispatch(fetchMonthlyTopAction(id));
  };

  const handleDeleteModalClosed = () => {
    setShowingDeleteModal(false);
  };

  const handleOptionSelected = option => {
    if (option.value === 'delete') {
      setShowingDeleteModal(true);
    } else {
      router.push(`/groups/${group.id}/${option.value}`);
    }
  };

  const getSelectedTabUrl = i => {
    const nextSection = TABS[i].toLowerCase();
    return `/groups/${id}/${nextSection}`;
  };

  const handleUpdateAll = () => {
    dispatch(updateAllAction(id));
    setButtonDisabled(true);
  };

  const onOptionSelected = useCallback(handleOptionSelected, [router, group]);
  const onDeleteModalClosed = useCallback(handleDeleteModalClosed, []);
  const onUpdateAllClicked = useCallback(handleUpdateAll, [id, dispatch]);

  // Fetch group details, on mount
  useEffect(fetchDetails, [dispatch, id]);
  useEffect(fetchCompetitions, [dispatch, id]);
  useEffect(fetchMembers, [dispatch, id]);
  useEffect(fetchMonthlyTop, [dispatch, id]);
  useEffect(fetchAchievements, [dispatch, id]);
  useEffect(fetchHiscores, [dispatch, id, selectedMetric]);

  if (!group) {
    return <Loading />;
  }

  return (
    <div className="group__container container">
      <Helmet>
        <title>{group.name}</title>
      </Helmet>
      <div className="group__header row">
        <div className="col">
          <PageHeader title={group.name}>
            <Button text="Update all" onClick={onUpdateAllClicked} disabled={isButtonDisabled} />
            <Dropdown options={MENU_OPTIONS} onSelect={onOptionSelected}>
              <button className="header__options-btn" type="button">
                <img src="/img/icons/options.svg" alt="" />
              </button>
            </Dropdown>
          </PageHeader>
        </div>
      </div>
      <div className="group__widgets row">
        <div className="col-md-4">
          <span className="widget-label">Featured Competition</span>
          <CompetitionWidget competitions={competitions} />
        </div>
        <div className="col-md-4 col-sm-6">
          <span className="widget-label">Monthly Top Player</span>
          <TopPlayerWidget group={group} isLoading={isLoadingMonthlyTop} />
        </div>
        <div className="col-md-4 col-sm-6">
          <span className="widget-label">Total overall experience</span>
          <TotalExperienceWidget group={group} isLoading={isLoadingMembers} />
        </div>
      </div>
      <div className="group__content row">
        <div className="col-md-4">
          <GroupInfo group={group} />
        </div>
        <div className="col-md-8">
          <Tabs
            tabs={TABS}
            selectedIndex={selectedSectionIndex}
            urlSelector={getSelectedTabUrl}
            align="space-between"
          />
          {selectedSectionIndex === 0 && (
            <MembersTable members={group.members} isLoading={isLoadingMembers} />
          )}
          {selectedSectionIndex === 1 && <GroupCompetitions competitions={competitions} />}
          {selectedSectionIndex === 5 && <GroupAchievements achievements={achievements} />}
        </div>
      </div>
      {showingDeleteModal && group && <DeleteGroupModal group={group} onCancel={onDeleteModalClosed} />}
    </div>
  );
}

export default Group;
