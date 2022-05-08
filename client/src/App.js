import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Marketplace from "./contracts/Marketplace.json";
import Prepcoin from "./contracts/Prepcoin.json";
import Header from "./components/Header";
import Home from "./components/Home";
import { Route, Switch } from "react-router-dom";
import Courses from "./components/Courses";
import AddCourse from "./components/AddCourse";
import { db } from "./configs/firebase-config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import AirDropCoins from "./components/AirDropCoins";

const App = () => {
  const MARKETPLACE_ADDRESS = "0xd9f3c42741144acdedf711ce8dba18213dd1deae";
  const PREPCOIN_ADDRESS = "0xf59738c1044cc479653b966ed90b4f090aaa659c";
  const COLLECTION_NAME = "courses";
  const [account, setAccount] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketplace, setMarketplace] = useState({});
  const [prepcoin, setPrepcoin] = useState({});
  const [userCourses, setUserCourses] = useState([]);
  const [downloadsCount, setDownloadCount] = useState(0);
  const [airDropFlag, setAirDropFlag] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [tokenOwner, setTokenOwner] = useState("");

  const coursesCollectionRef = collection(db, COLLECTION_NAME);
  const loadWeb3 = async () => {
    // window.web3: Metamask
    // Modern dapp browsers...
    if (window.ethereum) {
      console.log("dadada");
      window.web3 = new Web3(Web3.givenProvider);
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log("hello");
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert("Couldn't connect with meta-mask!");
    }
  };
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    // Will get networks id, rather than hard code [5777].
    const networkId = await web3.eth.net.getId();
    //const networkData = Marketplace.networks[networkId];

    if (MARKETPLACE_ADDRESS) {
      // address: Contract address
      const marketplace = new web3.eth.Contract(
        Marketplace.abi,
        MARKETPLACE_ADDRESS
      );
      const prepcoin = new web3.eth.Contract(Prepcoin.abi, PREPCOIN_ADDRESS);
      setMarketplace(marketplace);
      setPrepcoin(prepcoin);
      setLoading(false);
      const courseCount = await marketplace.methods.courseCount().call();
      const downloadsCount = await marketplace.methods
        .userDownloads(accounts[0])
        .call();
      const airDrop = await marketplace.methods.airdrop(accounts[0]).call();
      let balance = await marketplace.methods
        .viewBalance()
        .call({ from: accounts[0] });
      balance = balance / Math.pow(10, 18);
      const owner = await marketplace.methods.tokenOwner().call();
      console.log("balance", balance);
      console.log("tokenOwner", owner);
      setTokenOwner(owner);
      setAccountBalance(balance);
      setAirDropFlag(airDrop);
      setDownloadCount(downloadsCount);
      // Load courses, i: index#
      const productsList = [];
      const userEnrolledIn = [];
      const enrolledCourseIds = await marketplace.methods
        .getEnrolledCourses()
        .call({ from: accounts[0] });
      const data = await getDocs(coursesCollectionRef);
      const offChainData = data.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      for (let i = 1; i <= courseCount; i++) {
        const course = await marketplace.methods.courses(i).call();
        const courseDesc = offChainData.filter(
          (elem) => +elem.course_id === +course.id
        );
        if (
          course.owner !== accounts[0] &&
          !enrolledCourseIds.includes(course.id)
        ) {
          productsList.push({
            ...course,
            desc: courseDesc.length === 0 ? "NA" : courseDesc[0].desc,
          });
        }
        if (enrolledCourseIds.includes(course.id)) {
          userEnrolledIn.push({
            ...course,
            desc: courseDesc.length === 0 ? "NA" : courseDesc[0].desc,
          });
        }
      }
      setCourses(productsList);
      setUserCourses(userEnrolledIn);
    } else {
      window.alert("Marketplace contract not deployed to network.");
    }
  };
  const createCourse = async (name, price, desc) => {
    setLoading(true);
    await marketplace.methods
      .createCourse(name, price)
      .send({ from: account })
      .once("receipt", (receipt) => {
        setLoading(false);
      });
    const createdCourseId = await marketplace.methods.getCourseId().call();
    await addDoc(coursesCollectionRef, {
      course_id: createdCourseId,
      desc: desc,
    });
    loadBlockchainData();
  };

  const enrollInCourse = async (id, price) => {
    setLoading(true);
    const allowance = await prepcoin.methods
      .allowance(account, MARKETPLACE_ADDRESS)
      .call({ from: account });
    console.log("allowance", allowance);
    if (allowance < price) {
      await prepcoin.methods
        .approve(MARKETPLACE_ADDRESS, price)
        .send({ from: account })
        .once("receipt", () => {})
        .then(() => {
          console.log("approval successful");
        })
        .catch((error) => {
          console.log("There was an issue with approval:", error.message);
          window.alert("Approval error");
        });
    }

    await marketplace.methods
      .subscribeCourse(id)
      .send({ from: account })
      .once("receipt", () => {})
      .then(() => {
        setLoading(false);
      });
    loadBlockchainData();
  };

  const getRewardMoney = async () => {
    //console.log("Helloooooooo");
    setLoading(true);
    await marketplace.methods
      .getRewards()
      .send({ from: account })
      // .then(this.setState({ loading: false }));
      .once("receipt", (receipt) => {
        console.log("receipt: ", receipt);
        setLoading(false);
      });
    alert("Congratulations!! rewards money deposited into your account");
  };

  const onAirDropClickedHandler = async () => {
    //console.log("onAirDropClickedHandler");
    setLoading(true);
    await marketplace.methods
      .airdropTokens()
      .send({ from: account })
      // .then(this.setState({ loading: false }));
      .once("receipt", (receipt) => {
        console.log("receipt: ", receipt);
        setLoading(false);
      });
    loadBlockchainData();
  };

  const onOwnerAirDropClickedHandler = async (address, amount) => {
    console.log("add:", address, "amount:", +amount);
    setLoading(true);
    const allowance = await prepcoin.methods
      .allowance(account, MARKETPLACE_ADDRESS)
      .send({ from: account })
      .once("receipt", () => {})
      .then(() => {
        console.log("allowance received");
      });
    if (allowance < amount) {
      await prepcoin.methods
        .approve(MARKETPLACE_ADDRESS, amount)
        .send({ from: account })
        .once("receipt", () => {})
        .then(() => {
          console.log("approval successful");
        })
        .catch((error) => {
          console.log("There was an issue with approval:", error.message);
          window.alert("Approval error");
        });
    }
    await marketplace.methods
      .airdropTokenOwner(address, +amount)
      .send({ from: account })
      // .then(this.setState({ loading: false }));
      .once("receipt", (receipt) => {
        //console.log("receipt: ", receipt);
        setLoading(false);
      });
    loadBlockchainData();
  };
  useEffect(() => {
    //refresh the UI if the user changes the account in meta mask
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    loadWeb3();
    loadBlockchainData();
  }, []);
  return (
    <>
      <div>
        <Header
          account={account}
          balance={accountBalance}
          isOwner={account === tokenOwner}
        />
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
                      <AddCourse onCourseAdded={createCourse}></AddCourse>
                    </Route>
                    {account === tokenOwner && (
                      <Route path="/airdrop" exact>
                        <AirDropCoins
                          onOwnerAirDropClicked={onOwnerAirDropClickedHandler}
                        ></AirDropCoins>
                      </Route>
                    )}
                    <Route path="/">
                      <Home
                        isEnrolled={false}
                        availableCourses={courses}
                        onEnrollingCourse={enrollInCourse}
                        airDropFlag={airDropFlag}
                        onAirDropClicked={onAirDropClickedHandler}
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
