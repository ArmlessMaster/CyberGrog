import React, { useState, useContext, useCallback, useEffect } from "react";
import { Button, Block, Loader } from "components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { openNotification } from "utils";

import {
  EmblemBronze,
  EmblemChallenger,
  EmblemDiamond,
  EmblemGold,
  EmblemGrandMaster,
  EmblemIron,
  EmblemMaster,
  EmblemPlatinum,
  EmblemSilver,
} from "images";
import AuthContext from "utils/Auth";
import { useHttp } from "hooks/http.hook";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./Account.scss";

const Account = () => {
  const history = useNavigate();
  const auth = useContext(AuthContext);
  const { loading, request } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const [LoLAccount, setLoLAccount] = useState(null);
  const [LolServer, setLolServer] = useState(null);
  const { t } = useTranslation();

  const changeHandler = () => {
    history("/change");
  };

  const fetchAccount = useCallback(async () => {
    try {
      await request("/api/player/me", "GET", null, {
        Authorization: `Bearer ${auth.token}`,
      }).then(async (res) => {
        const nickname = res.player.nickname;
        setLolServer(res.player.region);
        let server;
        res.player.region === "BR"
          ? (server = "br1")
          : res.player.region === "EUNE"
          ? (server = "eun1")
          : res.player.region === "EUW"
          ? (server = "euw1")
          : res.player.region === "JP"
          ? (server = "jp1")
          : res.player.region === "KR"
          ? (server = "kr")
          : res.player.region === "LAN"
          ? (server = "la1")
          : res.player.region === "LAS"
          ? (server = "la2")
          : res.player.region === "NA"
          ? (server = "na1")
          : res.player.region === "OCE"
          ? (server = "oc1")
          : res.player.region === "TR"
          ? (server = "tr1")
          : res.player.region === "RU"
          ? (server = "ru") : (server = "euw1");

        await request(
          `/api/player/getLoLAccount?region=${server}&nickname=${nickname}`,
          "GET"
        ).then(async (res) => {
          setLoLAccount(res.data);
          setIsLoading(true);
        });
      });
    } catch (e) {
      history("/change");
      openNotification({
        title: t("you_entered_incorrect_data"),
        text: t("сheck_the_entered_data_and_correct_it"),
        type: "error",
      });
    }
  }, [request]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  let rank;
  LoLAccount?.tier === "BRONZE"
    ? (rank = EmblemBronze)
    : LoLAccount?.tier === "CHALLENGER"
    ? (rank = EmblemChallenger)
    : LoLAccount?.tier === "DIAMOND"
    ? (rank = EmblemDiamond)
    : LoLAccount?.tier === "GOLD"
    ? (rank = EmblemGold)
    : LoLAccount?.tier === "GRANDMASTER"
    ? (rank = EmblemGrandMaster)
    : LoLAccount?.tier === "IRON"
    ? (rank = EmblemIron)
    : LoLAccount?.tier === "MASTER"
    ? (rank = EmblemMaster)
    : LoLAccount?.tier === "PLATINUM"
    ? (rank = EmblemPlatinum)
    : (rank = EmblemSilver);

  return isLoading ? (
    <section className="account">
      <div className="account__content">
        <div>
          <Block>
            <img className="background_account" src={DotGrid}></img>
            <div className="header_account">
              <img
                src={`http://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/${LoLAccount.profileIconId}.png`}
              ></img>
              <div>
                <h2>
                  <strong>{LoLAccount.summonerName}</strong> #{LolServer}
                </h2>
                <h3>
                  {t("level")} {LoLAccount.summonerLevel} - {LoLAccount.tier}{" "}
                  {LoLAccount.rank}
                </h3>
              </div>
              <img className="tier_account" src={rank}></img>
            </div>
            <div className="footer_account">
              <div>
                <div className="wins_account">
                  <h2>
                    <span>{t("wins")}:</span> {LoLAccount.wins}
                  </h2>
                </div>
                <div className="losses_account">
                  <h2>
                    <span>{t("losses")}:</span> {LoLAccount.losses}
                  </h2>
                </div>
              </div>
              <div className="circle_account">
                <label>
                  <strong>
                    {(
                      LoLAccount.wins /
                      ((LoLAccount.wins + LoLAccount.losses) / 100)
                    ).toFixed(1)}
                    %
                  </strong>
                </label>
                <label>WIN RATE</label>
              </div>
            </div>
            <div className="button_account">
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={changeHandler}
                disabled={loading}
              >
                {t("сhange_account_details")}
              </Button>
            </div>
          </Block>
        </div>
      </div>
    </section>
  ) : (
    <Loader />
  );
};

export default Account;