async function main() {
  const DanToken = await hre.ethers.getContractFactory("DanToken");
  const totalSupply = ethers.utils.parseEther("10000");
  const token = await DanToken.deploy(totalSupply);

  await token.deployed();

  console.log("DanToken deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
