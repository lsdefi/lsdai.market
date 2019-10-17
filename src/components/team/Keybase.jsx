import PropTypes from 'prop-types';
import React from 'react';

import IconLink from './IconLink';

const Keybase = (props) => {
  const { data } = props;

  if (data === '') {
    return data;
  }

  const icon = 'fab fa-keybase';
  const link = `https://keybase.io/${data}`;

  return (<IconLink icon={icon} link={link} />);
};

Keybase.propTypes = {
  data: PropTypes.string.isRequired,
};

export default Keybase;
