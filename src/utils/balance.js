import BigNumber from 'bignumber.js';

const balance = async (contract, address) => {
  const decimals = BigNumber(await contract.decimals()).toNumber();
  const rawBalance = BigNumber(await contract.balanceOf(address));
  return rawBalance.dividedBy(10 ** decimals);
};

export default balance;
