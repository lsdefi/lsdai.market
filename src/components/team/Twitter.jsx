import PropTypes from 'prop-types';
import React from 'react';

import IconLink from './IconLink';

const Twitter = (props) => {
  const { data } = props;

  if (data === '') {
    return data;
  }

  const icon = 'fab fa-twitter';
  const link = `https://twitter.com/${data}`;

  return (<IconLink icon={icon} link={link} />);
};

Twitter.propTypes = {
  data: PropTypes.string.isRequired,
};

export default Twitter;
