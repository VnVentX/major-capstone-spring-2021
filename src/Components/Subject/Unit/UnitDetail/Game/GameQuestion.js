import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Space, Button, Popconfirm, message, Tooltip } from "antd";
import EditQuestion from "../../../../Question/Game/Modal/Edit/EditQuestion";
import ViewQuestion from "../../../../Question/Game/Modal/View/ViewQuestion";
import AddQuestion from "./Modal/AddQuestion";
import { QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const GameQuestion = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    getQuestionByGameID();
    getGameDetail();
  }, []);

  const getGameDetail = async () => {
    let gameID = window.location.pathname.split("/")[6];
    await axios
      .get(`https://mathscienceeducation.herokuapp.com/game/${gameID}`)
      .then((res) => {
        setStatus(res.data.status);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleChangeStatus = async (status) => {
    let gameID = window.location.pathname.split("/")[6];
    await axios
      .put("https://mathscienceeducation.herokuapp.com/game", {
        id: gameID,
        status: status,
      })
      .then((res) => {
        console.log(res);
        getGameDetail();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getQuestionByGameID = async () => {
    let exerciseID = window.location.pathname.split("/")[6];
    await axios
      .get(
        `https://mathscienceeducation.herokuapp.com/exerciseOrGame/${exerciseID}/questions?isExericse=false`
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = async (id) => {
    let gameID = window.location.pathname.split("/")[6];
    let ids = [];
    if (id.length === undefined) {
      ids.push(id);
    } else {
      ids = id;
    }
    await axios
      .put(
        "https://mathscienceeducation.herokuapp.com/exerciseGameQuestion/delete",
        {
          exercise: false,
          gameId: gameID,
          questionIds: ids,
        }
      )
      .then((res) => {
        console.log(res);
        getQuestionByGameID();
        message.success("Delete Question successfully");
      })
      .catch((e) => {
        console.log(e);

        message.error("Fail to delete Question");
      });
  };

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const selectedQuestionCol = [
    {
      title: "Question",
      dataIndex: "questionTitle",
    },
    {
      title: "Type",
      dataIndex: "questionType",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
    },
    {
      title: "Modified By",
      dataIndex: "modifiedBy",
    },
    {
      title: "Modified Date",
      dataIndex: "modifiedDate",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => (
        <Space size="small">
          <ViewQuestion data={record} />
          <EditQuestion
            data={record}
            getQuestionByGameID={getQuestionByGameID}
          />
          <Tooltip title="Delete Question">
            <Popconfirm
              placement="topRight"
              title="Are you sure to delete this question?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button type="danger" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      type="inner"
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Game Management
          {status && status === "ACTIVE" ? (
            <Popconfirm
              placement="topRight"
              title="Are you sure to close this Game?"
              onConfirm={() => handleChangeStatus("INACTIVE")}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">Close Game</Button>
            </Popconfirm>
          ) : status === "INACTIVE" ? (
            <Popconfirm
              placement="topRight"
              title="Are you sure to open this Game?"
              onConfirm={() => handleChangeStatus("ACTIVE")}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Open Game</Button>
            </Popconfirm>
          ) : null}
        </div>
      }
    >
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <AddQuestion getQuestionByGameID={getQuestionByGameID} data={data} />
      </div>
      <Table
        rowSelection={rowSelection}
        columns={selectedQuestionCol}
        dataSource={data}
        rowKey={(record) => record.id}
      />
      <div>
        <h1>With selected:</h1>
        {selectedRowKeys.length === 0 ? (
          <>
            <Button type="danger" disabled icon={<DeleteOutlined />}>
              Delete
            </Button>
          </>
        ) : (
          <>
            <Popconfirm
              placement="topRight"
              title="Are you sure to delete selected Questions?"
              onConfirm={() => handleDelete(selectedRowKeys)}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button type="danger" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </>
        )}
      </div>
    </Card>
  );
};

export default GameQuestion;
