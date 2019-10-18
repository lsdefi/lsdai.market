import PropTypes from 'prop-types';
import React from 'react';

const InfoBox = (props) => {
  const { children } = props;

  return (
    <div className="info-box">
      <img src="../assets/images/info.png" alt="info" />
      <p>{children}</p>
    </div>
  );
};

InfoBox.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InfoBox;
