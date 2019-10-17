import PropTypes from 'prop-types';
import React from 'react';

const IconLink = (props) => {
  const { icon, link, iconClass = "text-xl" } = props;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="social-icon">
      <i className={icon + ' ' + iconClass}/>
    </a>
  );
};

IconLink.propTypes = {
  icon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  iconClass: PropTypes.string
};

export default IconLink;
