import React, { useState, useContext, useCallback, useEffect } from "react";
import { Button, Block, Loader } from "components";
import { useTranslation } from "react-i18next";
import CanvasJSReact from "canvasJS/canvasjs.react";
import Champions from "../../jsons/champion.json";
import Perks from "../../jsons/perks.json";
import Summoner from "../../jsons/summoner.json";

import AuthContext from "utils/Auth";
import { useHttp } from "hooks/http.hook";
import DotGrid from "images/icons/backgroundSvg/DotGrid.svg";

import "./Game.scss";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Game = () => {
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const [isGameStart, setIsGameStart] = useState(false);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [LoLAccount, setLoLAccount] = useState(null);
  const [optionsArea, setOptionsArea] = useState({});
  const [optionsArea1, setOptionsArea1] = useState({});
  const [optionsArea2, setOptionsArea2] = useState({});
  const [game, setGame] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timer1, setTimer1] = useState(null);
  const [championName, setChampionName] = useState(null);
  const [championImg, setChampionImg] = useState(null);
  const [spell1, setSpell1] = useState(null);
  const [spell2, setSpell2] = useState(null);
  const [perksName, setPerksName] = useState([]);
  const [perksImg, setPerksImg] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isMounted1, setIsMounted1] = useState(false);
  const [isConnect, setIsConnect] = useState(false);

  const { t } = useTranslation();

  const fetchTest = useCallback(async () => {
    try {
      const data = await request(
        "/api/player/subscription/status",
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setIsSubscribe(data.data);
    } catch (e) {}
  }, [request, auth]);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  async function updateDevicePosition() {
    try {
      let server;
      await request("/api/player/me", "GET", null, {
        Authorization: `Bearer ${auth.token}`,
      }).then(async (res) => {
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
          `/api/player/getLoLAccount?region=${server}&nickname=${res.player.nickname}`,
          "GET"
        ).then(async (res) => {
          setLoLAccount(res.data);
          const game = await request(
            `/api/player/active-game?region=${server}&id=${res.data.summonerId}`,
            "GET"
          );
          setGame(game.data);
          setSpell1(
            Object.entries(Summoner.data).filter(
              (item) =>
                item[1].key ===
                game.data.participants
                  .filter((item) => item.summonerId === res.data.summonerId)[0]
                  .spell1Id.toString()
            )[0][1].image.full
          );
          setSpell2(
            Object.entries(Summoner.data).filter(
              (item) =>
                item[1].key ===
                game.data.participants
                  .filter((item) => item.summonerId === res.data.summonerId)[0]
                  .spell2Id.toString()
            )[0][1].image.full
          );
          setChampionImg(
            Object.entries(Champions.data).filter(
              (item) =>
                item[1].key ===
                game.data.participants
                  .filter((item) => item.summonerId === res.data.summonerId)[0]
                  .championId.toString()
            )[0][1].image.full
          );
          setChampionName(
            Object.entries(Champions.data).filter(
              (item) =>
                item[1].key ===
                game.data.participants
                  .filter((item) => item.summonerId === res.data.summonerId)[0]
                  .championId.toString()
            )[0][1].name
          );
          const gameData = game.data.participants.filter(
            (item) => item.summonerId === res.data.summonerId
          )[0].perks.perkIds;
          const images1 = [];
          const name = [];
          Perks = Perks.sort((a, b) => (a.id < b.id ? 1 : -1));
          Perks.map((item) => {
            if (gameData.indexOf(item.id) >= 0) {
              images1.push(
                "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1" +
                  item.iconPath.toLowerCase()
              );
              name.push(item.name);
            }
          });
          console.log(images1)
          setPerksName(name);
          setPerksImg(images1);

          await request(
            `/api/game/create`,
            "POST",
            { gameId: game.data.gameId },
            { Authorization: `Bearer ${auth.token}` }
          );

          await request(`/api/player/last`, "GET", null, {
            Authorization: `Bearer ${auth.token}`,
          }).then(async (res) => {
            console.log(res.game);
            await request(`/api/game/one?gameId=${res.game}`, "GET", null, {
              Authorization: `Bearer ${auth.token}`,
            }).then((res) => {
              const generateDataPoints = (array) => {
                const result = [];
                array.map((item, index) => {
                  result.push({ x: index, y: item });
                });
                return result;
              };

              setOptionsArea({
                theme: "light1",
                animationEnabled: true,
                zoomEnabled: true,
                title: {
                  text: t('heartbeat_rate_during'),
                },
                data: [
                  {
                    type: "line",
                    dataPoints: generateDataPoints(res.game.HeartbeatRate),
                  },
                ],
              });

              setOptionsArea1({
                theme: "light1",
                animationEnabled: true,
                zoomEnabled: true,
                title: {
                  text: t('breath_beat_rate_during'),
                },
                data: [
                  {
                    type: "line",
                    dataPoints: generateDataPoints(res.game.BreathRate),
                  },
                ],
              });

              setOptionsArea2({
                theme: "light1",
                animationEnabled: true,
                zoomEnabled: true,
                title: {
                  text: t('blood_pressure_during'),
                },
                data: [
                  {
                    type: "line",
                    dataPoints: generateDataPoints(
                      res.game.VascularPressureRateSystolic
                    ),
                  },
                  {
                    type: "line",
                    dataPoints: generateDataPoints(
                      res.game.VascularPressureRateDiastolic
                    ),
                  },
                ],
              });
            });
          });

          setIsLoading(true);
          setIsGameStart(true);
        });
      });
    } catch (e) {
      setIsLoading(true);
      setIsGameStart(false);
      console.error(e);
    }
    clearTimeout(timer);
    setTimer(setTimeout(updateDevicePosition, 10000));
  }

  async function updateDevicePosition1() {
    try {
      function randomIntFromInterval(min, max) {
        return parseFloat((Math.random() * (max - min + 1) + min).toFixed(0));
      }
      let obj = {
        HeartbeatRate: randomIntFromInterval(60, 120),
        BreathRate: randomIntFromInterval(16, 20),
        VascularPressureRateSystolic: randomIntFromInterval(100, 130),
        VascularPressureRateDiastolic: randomIntFromInterval(60, 90),
        gameId: game.gameId,
      };
      await request(
        `/api/game/create`,
        "POST",
        { ...obj },
        { Authorization: `Bearer ${auth.token}` }
      );
    } catch (e) {
      setIsLoading(true);
      setIsGameStart(false);
      console.error(e);
    }
    clearTimeout(timer1);
    setTimer1(setTimeout(updateDevicePosition1, 10000));
  }

  useEffect(() => {
    if (!isMounted) {
      updateDevicePosition();
      setIsMounted(true);
    }
    if (!isMounted1 && isConnect) {
      updateDevicePosition1();
      setIsMounted1(true);
    }
  });

  const Datchick = () => {
    setIsConnect(true);
  };

  console.log(perksImg)

  return isLoading ? (
    isGameStart ? (
      <section className="game">
        <div className="game__content">
          <div>
            <Block>
              <img className="background_game" src={DotGrid} alt="DotGrid"/>
              <div className="block_game">
                <div className="grid-container">
                  <div className="box-1">
                    <div className="header_game">
                    <div className="header_game-tittle">{t('summoner')}</div>
                      <div className="header_game-content">
                        <img
                          src={`http://ddragon.leagueoflegends.com/cdn/12.23.1/img/profileicon/${LoLAccount.profileIconId}.png`}
                          alt="Profile"
                        />
                        <div>
                          <h2>
                            <strong>{LoLAccount.summonerName}</strong>
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="header_game">
                    <div className="header_game-tittle">{t('champion')}</div>
                      <div className="header_game-content">
                        <img
                          src={`http://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${championImg}`}
                          alt="Champion"
                        />
                        <div>
                          <h2>
                            <strong>{championName}</strong>
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="runs_game">
                      <div className="runs">{t('runes')}</div>
                      {perksImg.map((item, index) => {
                        return (
                          <div className="active_runs">
                            <img src={item} alt="Runes"/>
                            <h2>
                              <strong>{perksName[index]}</strong>
                            </h2>
                          </div>
                        );
                      })}
                      <div className="runs">{t('spells')}</div>
                      <div className="active_spells">
                        <img
                          src={`http://ddragon.leagueoflegends.com/cdn/12.23.1/img/spell/${spell1}`}
                          alt="Spall1"
                        />
                        <img
                          src={`http://ddragon.leagueoflegends.com/cdn/12.23.1/img/spell/${spell2}`}
                          alt="Spall2"
                        />
                      </div>
                    </div>
                    <div className="footer_game">
                      <div>
                        <h2>
                          <strong>
                            {t('the_game_started_at')}:{" "}
                            {new Date(game.gameStartTime).getHours()}:
                            {new Date(game.gameStartTime).getMinutes()}:
                            {new Date(game.gameStartTime).getSeconds()}
                          </strong>
                        </h2>
                      </div>
                    </div>
                    <div className="footer_game">
                      <div>
                        <h2>
                          <strong>
                            {t('time_in_game')}:{" "}
                            {new Date(
                              Date.now() - game.gameStartTime
                            ).getMinutes()}{" "}
                            {t('min')}
                          </strong>
                        </h2>
                      </div>
                    </div>
                    <div className="footer_game-button">
                      <div>
                        <Button onClick={Datchick} disabled={isConnect}>
                          {t('сonnect_to_sensors')}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div id="chartContainer1" className="box-2">
                    <CanvasJSChart options={optionsArea} />
                  </div>
                  <div id="chartContainer3" className="box-3">
                    <CanvasJSChart options={optionsArea1} />
                  </div>
                  <div id="chartContainer3" className="box-4">
                    {isSubscribe ? (
                      <CanvasJSChart options={optionsArea2} />
                    ) : (
                      <div className="no_sub_game">
                        {t('to_view_blood_pressure')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Block>
          </div>
        </div>
      </section>
    ) : (
      <div>
        <div className="game_unactive">
          <img className="background_game" src={DotGrid} alt="DotGrid"/>
          <div className="no_active_game">{t("no_active_running_game")}</div>
        </div>
        )
      </div>
    )
  ) : (
    <Loader />
  );
};

export default Game;