import React from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import BigNumber from 'bignumber.js';

import Table from 'components/table';
import Identicon from 'components/identicon';

import { formatBigValue, getHumanValue, getNonHumanValue, shortenAddr, ZERO_BIG_NUMBER } from 'web3/utils';
import { BONDTokenMeta } from 'web3/contracts/bond';

import s from './styles.module.scss';
import { getNowTs } from 'utils';

type VoterData = {
  address: string;
  bondStaked: BigNumber;
  lockedUntil: number;
  delegatedPower: BigNumber;
  delegatedTo: string | null;
  votes: number;
  proposals: number
  votingPower: BigNumber;
};

function fetchVoters() {
  return fetch('https://tokenapi.barnbridge.com/governance/voters')
    .then(result => result.json())
    .then(results => results.map((result: any) => ({
      ...result,
      bondStaked: getHumanValue(new BigNumber(result.bondStaked), BONDTokenMeta.decimals),
      delegatedPower: getHumanValue(new BigNumber(result.delegatedPower), BONDTokenMeta.decimals),
    })));
}

const Columns: ColumnsType<VoterData> = [
  {
    dataIndex: 'address',
    title: 'ADDRESS',
    render: (value: any) => (
      <>
        <Identicon className={s.identicon} address={value} />
        {value}
      </>
    ),
  },
  {
    dataIndex: 'votingPower',
    title: 'VOTING POWER',
    width: 160,
    align: 'right',
    render: (value: BigNumber) => formatBigValue(value, 4),
  },
  {
    dataIndex: 'votes',
    title: 'VOTES',
    width: 160,
    align: 'right',
  },
  {
    dataIndex: 'proposals',
    title: 'PROPOSALS',
    width: 160,
    align: 'right',
  },
];

const MAX_LOCK = 365 * 24 * 60 * 60;
const BASE_MULTIPLIER = getNonHumanValue(1, 18);

function getOwnVotingMultiplier(voter: VoterData) {
  const diff = voter.lockedUntil - getNowTs();

  if (diff <= 0) {
    return BASE_MULTIPLIER;
  } else if (diff >= MAX_LOCK) {
    return BASE_MULTIPLIER.multipliedBy(2);
  }

  return BASE_MULTIPLIER.plus((new BigNumber(diff)).multipliedBy(BASE_MULTIPLIER).div(MAX_LOCK));
}

export type VotersTableProps = {};

const VotersTable: React.FunctionComponent<VotersTableProps> = props => {
  const [voters, setVoters] = React.useState<VoterData[]>([]);

  React.useEffect(() => {
    fetchVoters().then(setVoters);
  }, []);

  const votersData = voters.map(voter => ({
    ...voter,
    get votingPower(): BigNumber {
      let ownVotingPower: BigNumber = ZERO_BIG_NUMBER;

      if (voter.delegatedTo === null) {
        const multiplier = getOwnVotingMultiplier(voter);
        ownVotingPower = voter.bondStaked.multipliedBy(multiplier).div(BASE_MULTIPLIER);
      }

      return ownVotingPower.plus(voter.delegatedPower);
    },
  }));

  return (
    <Table<VoterData>
      columns={Columns}
      dataSource={votersData}
      rowKey="address"
      title={() => 'Voter weights'}
    />
  );
};

export default VotersTable;