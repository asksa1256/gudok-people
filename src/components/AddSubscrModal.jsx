import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "./AddSubscrModal.scss";
import "./Modal.scss";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENSOR_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export default function Modal(props) {
  const { open, close, modalTitle } = props; // 모달 동작 관련
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [payDate, setPayDate] = useState("");
  const [freePeriod, setFreePeriod] = useState(30);
  const [shareCount, setShareCount] = useState(2);
  const [free, setFree] = useState(false);
  const [share, setShare] = useState(false);
  const [platformImgUrl, setPlatformImgUrl] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [searchTitleForm, setSearchTitleForm] = useState(false);

  const activateFree = () => {
    setFree(true);
  };

  const notFree = () => {
    setFree(false);
  };

  const activateShare = () => {
    setShare(true);
  };

  const notShare = () => {
    setShare(false);
  };

  // 구독 플랫폼 정보 불러오기
  const fetchPlatformsData = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      try {
        const snapshot = await db.collection("platforms").get();
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlatforms(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    });
  };

  // 현재 트랜지션 효과를 보여주고 있는 중이라는 상태 값
  const [animate, setAnimate] = useState(false);
  // 실제 컴포넌트가 사라지는 시점을 지연시키기 위한 값
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);

    // open 값이 true -> false 가 되는 것을 감지 (즉, 모달창을 닫을 때)
    if (visible && !open) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 200);
    }

    fetchPlatformsData();
    return () => {
      setVisible(false);
    };
  }, [visible, open]);

  if (!animate && !visible) return null;

  const filteredPlatforms = platforms.filter((platform) => {
    if (
      platform.name.includes(title) ||
      platform.engName.toLowerCase().includes(title.toLowerCase())
    ) {
      return true;
    }
  });

  const setPlatformInfo = (name, url) => {
    setTitle(name);
    setPlatformImgUrl(url);
    setSearchTitleForm(false);
  };

  const submitFormHandler = () => {
    if (title.length === 0 || price <= 0 || payDate.length === 0) {
      alert("입력되지 않은 항목이 있습니다.");
      return;
    }

    const newData = {
      title: title,
      price: price,
      payDate: payDate,
      free: !free ? 0 : freePeriod,
      sharing: !share ? 0 : shareCount,
      imgUrl: platformImgUrl,
    };

    // MainPage로 데이터 전달
    props.updateData(newData);
  };

  return (
    <>
      <div className={open ? "backdrop open" : "backdrop close"}></div>
      <div className={open ? "modal open" : "modal close"}>
        <div className="modal-header">
          <h3 className="modal-title">{modalTitle}</h3>
          <button className="modal-close" onClick={close}>
            <img src="/images/close.png" alt="모달창 닫기" />
          </button>
        </div>
        <div className="form-control">
          <label htmlFor="subscription-name">구독 서비스명</label>
          <input
            type="text"
            id="subscription-name"
            value={title}
            onClick={() => setSearchTitleForm(true)}
            onChange={(e) => setTitle(e.target.value.trim())}
            placeholder="쿠팡와우, 넷플릭스, 멜론, ..."
          />
          {searchTitleForm && (
            <ul className="filtered-platforms">
              {filteredPlatforms.map((platform) => (
                <li
                  key={platform.engName}
                  onClick={() =>
                    setPlatformInfo(platform.name, platform.imgUrl)
                  }
                >
                  <img src={platform.imgUrl} alt="" />
                  {platform.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="subscription-price">가격</label>
          <input
            type="number"
            id="subscription-price"
            placeholder="5500"
            style={{ textAlign: "left" }}
            value={price}
            onChange={(e) => setPrice(e.target.value.trim())}
          />
        </div>
        <div className="form-control">
          <label htmlFor="subscription-date">결제일</label>
          <input
            type="date"
            id="subscription-date"
            placeholder="2024-01-01"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value.trim())}
          />
        </div>
        <div className="form-control">
          <label>무료 체험 (일)</label>
          <div className="options">
            <button
              className={!free ? "btn-w50 active" : "btn-w50"}
              onClick={notFree}
            >
              해당 없음
            </button>
            <input
              type="number"
              id="freePeriod"
              placeholder="30"
              value={freePeriod}
              onChange={(e) => setFreePeriod(e.target.value.trim())}
              className={free ? "active" : undefined}
              onClick={activateFree}
            />
          </div>
        </div>
        <div className="form-control">
          <label>계정 공유 (명)</label>
          <div className="options">
            <button
              className={!share ? "btn-w50 active" : "btn-w50"}
              onClick={notShare}
            >
              해당 없음
            </button>
            <input
              type="number"
              id="accountShare"
              placeholder="2"
              value={shareCount}
              onChange={(e) => setShareCount(e.target.value.trim())}
              className={share ? "active" : undefined}
              onClick={activateShare}
            />
          </div>
        </div>
        <button className="btn-w100 btn-submit" onClick={submitFormHandler}>
          추가하기
        </button>
      </div>
    </>
  );
}
