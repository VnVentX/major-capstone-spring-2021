import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  List,
  Popconfirm,
  message,
  Tooltip,
  Button,
  Typography,
  Badge,
} from "antd";
import { Link } from "react-router-dom";
import { QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import AddGame from "./Modal/AddGame";
import EditGame from "./Modal/EditGame";

const { Title } = Typography;

const Game = (props) => {
  const [game, setGame] = useState([]);

  useEffect(() => {
    getGameByLessonID();
  }, []);

  const getGameByLessonID = async () => {
    await axios
      .get(
        `https://mathscienceeducation.herokuapp.com/lesson/${props.lessonID}/game/all`
      )
      .then((res) => {
        setGame(res.data.length === 0 ? [] : res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteGame = async (gameID) => {
    await axios
      .put("https://mathscienceeducation.herokuapp.com/game", {
        id: gameID,
        status: "DELETED",
      })
      .then((res) => {
        console.log(res);
        getGameByLessonID();
        message.success("Delete Game successfully");
      })
      .catch((e) => {
        console.log(e);
        message.error("Fail to delete Game");
      });
  };

  const handleDelete = (item) => {
    deleteGame(item);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={1}>Game</Title>
        <AddGame
          lessonID={props.lessonID}
          getGameByLessonID={getGameByLessonID}
        />
      </div>
      <List
        itemLayout="horizontal"
        grid={{ gutter: 16, column: 1 }}
        dataSource={game}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link to={`${window.location.pathname}/game/${item.id}`}>
                      Game {item.gameName}
                    </Link>
                    {item.status === "ACTIVE" ? (
                      <Badge status="success" style={{ marginLeft: 5 }} />
                    ) : (
                      <Badge status="default" style={{ marginLeft: 5 }} />
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <EditGame
                      data={item}
                      lessonID={props.lessonID}
                      getGameByLessonID={getGameByLessonID}
                    />
                    <Tooltip title="Delete">
                      <Popconfirm
                        placement="left"
                        title="Are you sure to delete this Game?"
                        onConfirm={() => handleDelete(item.id)} //Handle disable logic here
                        okText="Yes"
                        cancelText="No"
                        icon={
                          <QuestionCircleOutlined style={{ color: "red" }} />
                        }
                      >
                        <Button
                          type="danger"
                          icon={<DeleteOutlined />}
                          style={{ marginLeft: 5 }}
                        />
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </div>
              }
            >
              {item.description}
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

export default Game;
