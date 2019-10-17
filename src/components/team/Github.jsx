import PropTypes from 'prop-types';
import React from 'react';

import IconLink from './IconLink';

const Github = (props) => {
  const { data } = props;

  if (data === '') {
    return data;
  }

  const icon = 'fab fa-github-alt';
  const link = `https://github.com/${data}`;

  return (<IconLink icon={icon} link={link} />);
};

Github.propTypes = {
  data: PropTypes.string.isRequired,
};

export default Github;
