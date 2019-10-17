import React from 'react';
import memberList from './MemberList';

/*const members = memberList.map(
  ({ name, img, bio }) => (<Member name={name} img={img} bio={bio} />),
);*/

const Team = () => (
  <div className="team">
    <div className="container">
      <h1>Team</h1>
      <div>
        <div className="member">
          <img src="../assets/images/black.png" alt="okok" />
          <div>
            <h2>
              Dan Matthews
            </h2>
            <p>
              Currently a lead engineer at MARKET Protocol, working to solve issues that exist related to leveraged and derivative DeFi products. Before entering the blockchain space, Dan held roles ranging from team lead to CTO at a variety of Web 2.0 startup companies.
            </p>
          </div>
        </div>
        <div className="member">
          <img src="../assets/images/black.png" alt="okok" />
          <div>
            <h2>
              Dan Matthews
            </h2>
            <p>
              Currently a lead engineer at MARKET Protocol, working to solve issues that exist related to leveraged and derivative DeFi products. Before entering the blockchain space, Dan held roles ranging from team lead to CTO at a variety of Web 2.0 startup companies.
            </p>
          </div>
        </div>
        <div className="member">
          <img src="../assets/images/black.png" alt="okok" />
          <div>
            <h2>
              Dan Matthews
            </h2>
            <p>
              Currently a lead engineer at MARKET Protocol, working to solve issues that exist related to leveraged and derivative DeFi products. Before entering the blockchain space, Dan held roles ranging from team lead to CTO at a variety of Web 2.0 startup companies.
            </p>
          </div>
        </div>
        <div className="member">
          <img src="../assets/images/black.png" alt="okok" />
          <div>
            <h2>
              Dan Matthews
            </h2>
            <p>
              Currently a lead engineer at MARKET Protocol, working to solve issues that exist related to leveraged and derivative DeFi products. Before entering the blockchain space, Dan held roles ranging from team lead to CTO at a variety of Web 2.0 startup companies.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Team;
