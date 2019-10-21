import PropTypes from 'prop-types';
import React from 'react';

import IconLink from './IconLink';

const Facebook = (props) => {
  const { data } = props;

  if (data === '') {
    return data;
  }

  const icon = 'fab fa-facebook-in';
  const link = `https://www.facebook.com/${data}`;

  return (<IconLink icon={icon} link={link} />);
};

Facebook.propTypes = {
  data: PropTypes.string.isRequired,
};

export default Facebook;
