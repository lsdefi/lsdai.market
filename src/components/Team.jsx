import React from 'react';

import TeamMember from './team/TeamMember';

class Team extends React.Component {
  constructor() {
    super();

    this.state = {
      team: [
        {
          bio: 'Currently a lead engineer at MARKET Protocol, working to solve issues that exist related to leveraged and derivative DeFi products. Before entering the blockchain space, Dan held roles ranging from team lead to CTO at a variety of Web 2.0 startup companies.',
          github: 'dmvt',
          img: './assets/images/team/dan.png',
          keybase: 'dmvt',
          linkedin: 'dandefi',
          name: 'Dan Matthews',
          twitter: 'lsdan_defi',
        },
        {
          name: 'Tina Zhen',
          bio: 'A four-time winner of EthGlobal hackathons, founder of the Yellow Hat DAO, and creator of Hashedge.io, a decentralized marketplace for mining and staking derivatives. Tina has previously co-founded the venture-backed startup EdgeOn IoT and worked at the Chinese investment bank CICC.',
          img: './assets/images/team/tina.jpg',
        },
        {
          name: 'Francesco Renzi',
          bio: 'Product manager at Decentral.ee, and the co-creator of rDai protocol. Fran speaks five languages and traveled to over 40 countries after having bootstrapped his first business at the age of 17 and sold it at 23.',
          img: './assets/images/team/fran.jpeg',
          twitter: 'francescorenzia',
          github: 'kobuta23',
          linkedin: 'francescogeorgerenzi',
        },
        {
          name: 'David Leitart',
          bio: 'Works as a financial analyst at the CryptoPosition Investment Fund, the first crypto fund in Hungary. In tandem, he heads his outlet Cryptoberg Research, maintaining a comprehensive perspective on the blockchain scene, and analyzing projects in-depth. ',
          img: './assets/images/team/david.jpeg',
        },
        {
          name: 'Zhicheng Miao',
          bio: 'Founder and architect at Decentral.ee, and the co-creator of the rDai protocol, which decouples interests generated from liquidity locked in DeFi. Miao has over ten years of experience in the software industry, including Skype, Microsoft, and Twilio.',
          img: './assets/images/team/miao.jpg',
        },
      ],
    };
  }

  render() {
    const { team } = this.state;

    return (
      <div className="team">
        <div className="container">
          <h1>Team</h1>
          <div>
            {team.map((teamMember) => (
              <TeamMember key={teamMember.name} teamMember={teamMember} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Team;
