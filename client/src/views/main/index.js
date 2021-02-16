import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { client } from "../../websoket";
import { msToTime } from "../../utils/utils";
import "./main.css";
import { instance } from "../../axios";

function Main() {
  const [userName, setUserName] = useState("");
  const [text, setText] = useState("");
  const [typeText, setTypeText] = useState("");
  const [inputError, setInputError] = useState(false);
  const [timeText, setTimeText] = useState("");
  const [start, setStart] = useState(new Date().getTime());
  const [end, setEnd] = useState(0);

  const history = useHistory();
  useEffect(() => {
    // Get type text
    getTextAndUser();

    client.onopen = () => {
      console.log("web socket client connected");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Return if text not typed
    if (inputError || typeText.length === 0 || timeText !== "") return;
    const end = new Date().getTime();
    const finalTime = end - start;
    setTimeText(msToTime(finalTime));
    setEnd(finalTime);
    // Set time in
    sendGameInfo(finalTime);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setTypeText(value);
    if (value.length === 0) {
      setInputError(false);
      return;
    }
    text.split("").forEach((char, index) => {
      let typedChar = value[index];

      // characters not currently typed
      if (typedChar === null || typedChar === undefined) {
        // setInputError(false);
      } else if (typedChar === char) {
        setInputError(false);
      } else {
        setInputError(true);
      }
    });
  };

  const getTextAndUser = async () => {
    const { data } = await instance.get("/getTextAndUser");
    if (data) {
      setText(data.text);
      setUserName(data.userName);
    }
  };

  const sendGameInfo = async (finalTime) => {
    const { data } = await instance.post("/setGameDetails", {
      userName,
      endTime: finalTime,
    });
    if (data) {
      console.log("BE Responce  ===>>", data.message);
    }
  };

  const finishGame = async () => {
    const { data } = await instance.get("/getWinnerDetails");
    if (data) {
      client.send(
        JSON.stringify({
          type: "message",
          content: {
            userName: data.userName,
            time: data.time,
          },
          isBroadcast: true,
        })
      );
      history.push("/result");
    }
  };

  const handleFinishClk = () => {
    finishGame();
  };

  return (
    <div className="align-center ui internally grid">
      <div className="row">
        <div className="three wide column">{userName}</div>
        <div className="ten wide column">
          <p>{text}</p>
        </div>
        <div className="three wide column"></div>
      </div>
      <div className="row">
        <div className="three wide column"></div>
        <div className="ten wide column ui form error">
          <form onSubmit={handleSubmit}>
            <div className="ui massive input input-width field">
              <input
                autoFocus
                onChange={handleInputChange}
                type="text"
                placeholder="Type text"
                value={typeText}
              />
            </div>
            {inputError && (
              <div className="ui error message">
                <div className="header">Error</div>
                <p>Text is incorrect please check the text again</p>
              </div>
            )}
          </form>
        </div>
        <div className="three wide column"></div>
      </div>
      <div className="row">
        <div className="three wide column"></div>
        {timeText !== "" && (
          <>
            <div className="ten wide column">
              <div className="ui label">
                Your time is
                <div className="detail">{timeText}</div>
              </div>
            </div>
            <button
              onClick={handleFinishClk}
              className="ui primary basic button"
            >
              Finish
            </button>
          </>
        )}

        <div className="three wide column"></div>
      </div>
    </div>
  );
}
export default Main;
