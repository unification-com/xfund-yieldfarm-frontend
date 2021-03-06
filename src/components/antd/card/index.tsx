import React from 'react';
import * as Antd from 'antd';
import { CardProps as AntdCardProps } from 'antd/lib/card';
import cx from 'classnames';

import Icons from 'components/custom/icon';
import Button from 'components/antd/button';

import s from './styles.module.scss';

export type CardProps = AntdCardProps & {
  showExpandButton?: boolean;
  expanded?: boolean;
  noPaddingBody?: boolean;
};

const Card: React.FunctionComponent<CardProps> = props => {
  const {
    className,
    showExpandButton = false,
    expanded = true,
    noPaddingBody = false,
    children,
    ...cardProps
  } = props;

  const [expandedState, setExpanded] = React.useState<boolean>(expanded);

  React.useEffect(() => {
    setExpanded(expanded);
  }, [expanded]);

  return (
    <Antd.Card
      className={cx(s.component, className, noPaddingBody && s.noPaddingBody)}
      bordered={false}
      extra={
        showExpandButton ? (
          <Button
            type="link"
            className={s.arrow}
            icon={
              <Icons name="chevron-right" rotate={expandedState ? 270 : 0} />
            }
            onClick={() => setExpanded(prevState => !prevState)}
          />
        ) : undefined
      }
      {...cardProps}>
      {expandedState && children}
    </Antd.Card>
  );
};

const CardDelimiter: React.FunctionComponent = () => (
  <div className={s.delimiter} />
);

export type StaticCardProps = {
  Delimiter: React.FunctionComponent;
};

((Card as any) as StaticCardProps).Delimiter = CardDelimiter;

export default Card as React.FunctionComponent<CardProps> & StaticCardProps;
