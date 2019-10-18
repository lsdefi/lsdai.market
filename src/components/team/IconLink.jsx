import PropTypes from 'prop-types';
import React from 'react';

const IconLink = (props) => {
  const { icon, link, iconClass = 'text-xl' } = props;

  const iClass = `${icon} ${iconClass}`;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="social-icon">
      <i className={iClass} />
    </a>
  );
};

IconLink.defaultProps = {
  iconClass: 'text-xl',
};

IconLink.propTypes = {
  icon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  iconClass: PropTypes.string,
};

export default IconLink;
