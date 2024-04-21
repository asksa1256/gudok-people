import React, { useState, useEffect } from "react";
import "./Modal.scss";

export default function Modal(props) {
  const { open, close, title } = props;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [freePeriod, setFreePeriod] = useState(30);
  const [shareCount, setShareCount] = useState(2);
  const [free, setFree] = useState(false);
  const [share, setShare] = useState(false);

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
    return () => {
      setVisible(false);
    };
  }, [visible, open]);

  if (!animate && !visible) return null;

  const submitFormHandler = () => {
    const inputValues = {
      name: name,
      price: price,
      date: date,
      freePeriod: !free ? "" : freePeriod,
      shareCount: !share ? "" : shareCount,
    };

    console.log(inputValues);

    // DB로 입력값 전송...
  };

  return (
    <>
      <div className={open ? "backdrop open" : "backdrop close"}></div>
      <div className={open ? "modal open" : "modal close"}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={close}>
            <img src="/images/close.png" alt="모달창 닫기" />
          </button>
        </div>
        <div className="form-control">
          <label htmlFor="subscription-name">구독 서비스명</label>
          <input
            type="text"
            id="subscription-name"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            placeholder="쿠팡와우, 넷플릭스, 멜론, ..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="subscription-price">가격</label>
          <input
            type="number"
            id="subscription-price"
            placeholder="5500"
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
            value={date}
            onChange={(e) => setDate(e.target.value.trim())}
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