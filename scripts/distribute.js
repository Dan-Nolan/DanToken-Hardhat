const ADDRESS = ""; // TODO: fill in token address

async function main() {
  const token = await hre.ethers.getContractAt("DanToken", ADDRESS);
  const amount = ethers.utils.parseEther("100");
  const friends = [
    /* fill this with friend addresses! */
  ];
  for(let i = 0; i < friends.length; i++) {
    await token.transfer(friends[i], amount);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
