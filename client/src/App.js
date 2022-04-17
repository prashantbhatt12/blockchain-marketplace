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
  const [courseCount, setCourseCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketplace, setMarketplace] = useState({});
  const [userCourses, setUserCourses] = useState([]);
  const [downloadsCount, setDownloadCount] = useState(0);
  const loadWeb3 = async () => {
    // window.web3: Metamask
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      //await window.ethereum.enable();
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
      const courseCount = await marketplace.methods.courseCount().call();
      const downloadsCount = await marketplace.methods
        .userDownloads(accounts[0])
        .call();
      //console.log("downloads count:", downloadsCount);
      setDownloadCount(downloadsCount);
      setCourseCount(courseCount);
      // Load courses, i: index#
      const productsList = [];
      const userEnrolledIn = [];
      const enrolledCourseIds = await marketplace.methods
        .getEnrolledCourses()
        .call({ from: accounts[0] });
      for (let i = 1; i <= courseCount; i++) {
        const course = await marketplace.methods.courses(i).call();
        if (
          course.owner !== accounts[0] &&
          !enrolledCourseIds.includes(course.id)
        ) {
          productsList.push(course);
        }
        if (enrolledCourseIds.includes(course.id)) {
          userEnrolledIn.push(course);
        }
      }
      //console.log("enrolledCourses", userEnrolled);
      setCourses(productsList);
      setUserCourses(userEnrolledIn);
    } else {
      window.alert("Marketplace contract not deployed to network.");
    }
  };
  const createCourse = async (name, price, desc) => {
    //await this.setState({ loading: true });
    setLoading(true);
    await marketplace.methods
      .createCourse(name, price, desc)
      .send({ from: account })
      .once("receipt", (receipt) => {
        //console("some", receipt);
        setLoading(false);
      });
    const createdCourseId = await marketplace.methods.getCourseId().call();
    console.log("crefated course id", createdCourseId);
    loadBlockchainData();
  };

  const purchaseCourse = async (id, price) => {
    setLoading(true);
    await marketplace.methods
      .subscribeCourse(id)
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
                        courseCount={courseCount}
                      ></Courses>
                    </Route>
                    <Route path="/addCourse" exact>
                      <AddCourse onCourseAdded={createCourse}></AddCourse>
                    </Route>
                    <Route path="/" exact>
                      <Home
                        isEnrolled={false}
                        availableCourses={courses}
                        onCoursePurchased={purchaseCourse}
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
