import PropTypes from 'prop-types';
import React from 'react';

const IconLink = (props) => {
  const { icon, link } = props;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <i className={icon} />
    </a>
  );
};

IconLink.propTypes = {
  icon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default IconLink;
