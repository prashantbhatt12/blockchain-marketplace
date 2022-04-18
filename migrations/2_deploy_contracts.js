var Marketplace = artifacts.require("./Marketplace.sol");

module.exports = function (deployer) {
  deployer.deploy(Marketplace, {
    from: "0xdAe895082F056ed714060Bd5D3820F4fe4a91965",
    value: "10000000000000000000",
  });
};
