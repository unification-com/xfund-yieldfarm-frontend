import React from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';

import Button from 'components/antd/button';
import Slider from 'components/antd/slider';
import Grid from 'components/custom/grid';
import NumericInput from 'components/custom/numeric-input';
import Icons, { TokenIconNames } from 'components/custom/icon';
import { formatBigValue } from 'web3/utils';

import s from './styles.module.scss';

export type TokenAmountProps = {
  className?: string;
  tokenIcon?: TokenIconNames;
  max?: number | BigNumber;
  maximumFractionDigits?: number;
  value?: number | BigNumber;
  disabled?: boolean;
  slider?: boolean;
  displayDecimals?: number;
  onChange?: (value?: BigNumber) => void;
};

const TokenAmount: React.FunctionComponent<TokenAmountProps> = props => {
  const {
    className,
    tokenIcon,
    max = 100,
    maximumFractionDigits = 4,
    value,
    disabled = false,
    slider = false,
    displayDecimals = 4,
    onChange,
  } = props;

  const step = 1 / (10 ** Math.min(displayDecimals, 6));
  const bnMaxValue = new BigNumber(max);

  const bnValue = value !== undefined
    ? BigNumber.min(new BigNumber(value), bnMaxValue)
    : undefined;

  function onMaxHandle() {
    onChange?.(bnMaxValue);
  }

  function handleInputChange(value: BigNumber) {
    onChange?.(value ? BigNumber.min(value, bnMaxValue) : undefined);
  }

  function onSliderChange(value: number) {
    onChange?.(new BigNumber(value));
  }

  return (
    <Grid flow="row" gap={32}>
      <NumericInput
        className={cx(s.component, className)}
        placeholder={`0 (Max ${formatBigValue(bnMaxValue, displayDecimals)})`}
        addonBefore={tokenIcon ? (
          <Grid flow="col" gap={4}>
            <Icons name={tokenIcon} width={24} height={29} />
          </Grid>
        ) : undefined}
        addonAfter={(
          <Button
            type="default"
            className={s.maxBtn}
            disabled={disabled}
            onClick={onMaxHandle}>
            MAX
          </Button>
        )}
        maximumFractionDigits={maximumFractionDigits}
        disabled={disabled}
        value={bnValue}
        onChange={handleInputChange}
      />
      {slider && (
        <Slider
          min={0}
          max={bnMaxValue.toNumber()}
          step={step}
          tooltipPlacement="bottom"
          tipFormatter={value => value ? formatBigValue(new BigNumber(value), displayDecimals) : 0}
          disabled={disabled}
          value={bnValue?.toNumber()}
          onChange={onSliderChange}
        />
      )}
    </Grid>
  );
};

export default TokenAmount;
