import PropTypes from 'prop-types';
import React from 'react';

const InfoBox = (props) => {
  const { children, color } = props;
  let bgColor = 'pink-shadow';
  if (color !== 'yellow') {
    if (color === 'blue') bgColor = 'blue-shadow';
  }
  const bg = `info-box bg-${bgColor}`;
  return (
    <div className={bg}>
      <img src={`../assets/images/info-${color}.png`} style={{ width: '1.25rem' }} alt="info" />
      <p>{children}</p>
    </div>
  );
};

InfoBox.defaultProps = {
  color: 'yellow',
};
InfoBox.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default InfoBox;
