import PropTypes from 'prop-types';
import React from 'react';

import IconLink from './IconLink';

const Linkedin = (props) => {
  const { data } = props;

  if (data === '') {
    return data;
  }

  const icon = 'fab fa-linkedin-in';
  const link = `https://www.linkedin.com/in/${data}`;

  return (<IconLink icon={icon} link={link} />);
};

Linkedin.propTypes = {
  data: PropTypes.string.isRequired,
};

export default Linkedin;
