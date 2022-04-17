import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Marketplace from "./contracts/Marketplace.json";
import Header from "./components/Header";
import Home from "./components/Home";
import { Route, Switch } from "react-router-dom";
import Courses from "./components/Courses";
import AddCourse from "./components/AddCourse";

const App = () => {
  const [account, setAccount] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketplace, setMarketplace] = useState({});
  const [userCourses, setUserCourses] = useState([]);
  const [downloadsCount, setDownloadCount] = useState(0);
  const loadWeb3 = async () => {
    // window.web3: Metamask
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    //this.setState({ account: accounts[0] });
    setAccount(accounts[0]);
    // Will get networks id, lather than hard code [5777].
    const networkId = await web3.eth.net.getId();
    const networkData = Marketplace.networks[networkId];

    if (networkData) {
      // address: Contract address
      const marketplace = new web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      );
      setMarketplace(marketplace);
      setLoading(false);
      const productCount = await marketplace.methods.productCount().call();
      const downloadsCount = await marketplace.methods
        .userDownloads(accounts[0])
        .call();
      //console.log("downloads count:", downloadsCount);
      setDownloadCount(downloadsCount);
      setProductCount(productCount);
      // Load products, i: index#
      const productsList = [];
      const userEnrolledIn = [];
      const enrolledCourseIds = await marketplace.methods
        .getEnrolledCourses()
        .call({ from: accounts[0] });

      // enrolledCoursesArr.forEach(element => {
      //   userEnrolled.push(element);
      // });
      for (let i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        // this.setState({
        //   products: [...this.state.products, product],
        // });
        //console.log("account:" + account);
        // if (product.owner === accounts[0]) {
        //   userEnrolled.push(product);
        // } else if (!product.purchased) {
        //   productsList.push(product);
        // }
        if (
          product.owner !== accounts[0] &&
          !enrolledCourseIds.includes(product.id)
        ) {
          productsList.push(product);
        }
        if (enrolledCourseIds.includes(product.id)) {
          userEnrolledIn.push(product);
        }
      }
      //console.log("enrolledCourses", userEnrolled);
      setProducts(productsList);
      setUserCourses(userEnrolledIn);
    } else {
      window.alert("Marketplace contract not deployed to network.");
    }
  };
  const createProduct = async (name, price, desc) => {
    //await this.setState({ loading: true });
    setLoading(true);
    await marketplace.methods
      .createProduct(name, price, desc)
      .send({ from: account })
      .once("receipt", (receipt) => {
        setLoading(false);
      });
    // .then(this.setState({ loading: false }));
    loadBlockchainData();
  };

  const purchaseProduct = async (id, price) => {
    setLoading(true);
    await marketplace.methods
      .purchaseProduct(id)
      .send({ from: account, value: price })
      // .then(this.setState({ loading: false }));
      .once("receipt", (receipt) => {
        //console.log("receipt: " + receipt);
        setLoading(false);
      });
    loadBlockchainData();
  };

  const getRewardMoney = async () => {
    console.log("Helloooooooo");
    setLoading(true);
    await marketplace.methods
      .getRewards()
      .send({ from: account })
      // .then(this.setState({ loading: false }));
      .once("receipt", (receipt) => {
        console.log("receipt: ", receipt);
        setLoading(false);
      });
  };
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);
  return (
    <>
      <div>
        <Header account={account} />
        <div className="container">
          <div className="d-flex flex-column bd-highlight mt-5">
            <div className="p-2 mt-20">
              {loading ? (
                <div id="loader">
                  <div className="text-center">
                    <p>Loading...</p>
                  </div>
                </div>
              ) : (
                <main>
                  <Switch>
                    <Route path="/courses" exact>
                      <Courses
                        enrolledCourses={userCourses}
                        isEnrolled={true}
                        totalDownloads={downloadsCount}
                        onRewardsAchieved={getRewardMoney}
                      ></Courses>
                    </Route>
                    <Route path="/addCourse" exact>
                      <AddCourse onCourseAdded={createProduct}></AddCourse>
                    </Route>
                    <Route path="/" exact>
                      <Home
                        isEnrolled={false}
                        availableCourses={products}
                        createProduct={createProduct}
                        purchaseProduct={purchaseProduct}
                      />
                    </Route>
                  </Switch>
                </main>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
