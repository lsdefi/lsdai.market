import PropTypes from 'prop-types';
import React from 'react';

import Github from './Github';
import Keybase from './Keybase';
import Linkedin from './Linkedin';
import Twitter from './Twitter';

const TeamMember = (props) => {
  const { teamMember } = props;
  const {
    bio,
    github,
    img,
    keybase,
    linkedin,
    name,
    twitter,
  } = teamMember;

  return (
    <div className="member">
      <div className="social">
        <img src={img} alt={name} />
        <div>
          <Github data={github || ''} />
          <Keybase data={keybase || ''} />
          <Linkedin data={linkedin || ''} />
          <Twitter data={twitter || ''} />
        </div>
      </div>
      <div>
        <h2>
          {name}
        </h2>
        <p>
          {bio}
        </p>
      </div>

    </div>
  );
};

TeamMember.defaultProps = {
  teamMember: {
    github: '',
    keybase: '',
    linkedin: '',
    twitter: '',
  },
};

TeamMember.propTypes = {
  teamMember: PropTypes.shape({
    bio: PropTypes.string.isRequired,
    github: PropTypes.string,
    img: PropTypes.string.isRequired,
    keybase: PropTypes.string,
    linkedin: PropTypes.string,
    name: PropTypes.string.isRequired,
    twitter: PropTypes.string,
  }),
};

export default TeamMember;
