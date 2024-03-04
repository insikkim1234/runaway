import React from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

//사용하는 이미지
import runawayimg from "../image/runaway.png";

import pushupImage from "../image/exercise.png";

import background from "../image/running.jpg";
import pushupimg from "../image/pushup.jpg";
import homeimg1 from "../image/homeimg1.jpg";
import homeimg2 from "../image/homeimg2.jpg";

//사용하는 css
import "../CSS/Main.css";

//이동
import Slider from "react-slick";

var settings = {
  className: "center",
  centerMode: true,
  infinite: true,
  centerPadding: "60px",
  speed: 500,
  slidesToShow: 1,
};

const Home = () => {
  var token = window.localStorage.getItem("token");
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navi = useNavigate();

  if (token) {
    console.log("Token found:", token);
    (async () => {
      try {
        const request = {
          method: "GET",
          url: `${BACKEND_URL}/api/login/me`,
          headers: {
            Authorization: token,
          },
        };
        const res = await axios(request);
        if (
          res.data.height === null ||
          res.data.height === 0 ||
          res.data.weight === null ||
          res.data.weight === 0
        ) {
          alert(
            "추가 정보 입력이 필요하여 추가 정보 입력 페이지로 이동합니다."
          );
          navi("/signup-add");
        }
        console.log(res);
      } catch (e) {
        console.error(e);
      }
    })();
  } else {
    console.log("Token not found.");
  }

  return (
    <div>
      <div className="header-inscreen">
        <span style={{ fontFamily: "Anton", marginLeft: "8%" }}>Runaway</span>
      </div>

      <div className="startAnimation">
        <div className="home-exercise-item">
          <div
            className="home-exercise-content primaryCard"
            style={{ textAlign: "center" }}
          >
            <Link to={"/running"}>
              <img
                src={runawayimg}
                alt="running"
                className="home-exercise-img"
              />
              <br />
              {/* <span style={{ color: "white" }}>Running</span> */}
            </Link>
          </div>

          <div
            className="home-exercise-content primaryCard"
            style={{ textAlign: "center" }}
          >
            <Link to={"/exercise"}>
              <img
                src={pushupImage}
                alt="pushup"
                className="home-exercise-img"
                style={{ width: '33%' }}
              />
              <br />
              {/* <span style={{ color: "white" }}>Exercise</span> */}
            </Link>
          </div>
        </div>

        <Slider {...settings} className="home-slider-container">
          <div className="home-img-banner">
            <img src={background} className="home-img" alt="c11" />
          </div>
          <div className="home-img-banner">
            <img src={pushupimg} className="home-img" alt="22" />
          </div>
          <div className="home-img-banner">
            <img src={homeimg1} className="home-img" alt="33" />
          </div>
          <div className="home-img-banner">
            <img src={homeimg2} className="home-img" alt="44" />
          </div>
        </Slider>

        <Link to="/challengemain">
          <button
            className="btn primaryButton-outset home-challenge-btn"
          >
            <span>My Challenge</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
