import React, { useEffect, useState } from "react";
import { GAME_ID_KEY } from "../../constants";
import { msToTime } from "../../utils/utils";
import { client } from "../../websoket";

import "./result.css";

function Result() {
  const [userName, setUserName] = useState(null);
  const [time, setTime] = useState(0);
  useEffect(() => {
    client.onmessage = (msg) => {
      const { content } = JSON.parse(msg.data);
      console.log(`Reply from server`, content);

      if (content) {
        setAttrValue(content);
      }
    };
    return () => {
      client.close();
    };
  }, []);

  const setAttrValue = (winner) => {
    if (winner.time) {
      setUserName(winner.userName);
      setTime(winner.time);
    }
  };
  return (
    <div className="app-center">
      {userName && time !== 0 ? (
        <div className="ui internally grid">
          <div className="row">
            <div className="three wide column"></div>
            <div className="ten wide column">
              <p>Congratulations Winner !!</p>
            </div>
            <div className="three wide column"></div>
          </div>
          <div className="row">
            <div className="three wide column"></div>
            <div className="ten wide column">
              <p>User: {userName}</p>
              <p>Time: {msToTime(time) || 0}</p>
            </div>
            <div className="three wide column"></div>
          </div>
        </div>
      ) : (
        <div className="ui active centered inline loader"></div>
      )}
    </div>
  );
}

export default Result;
