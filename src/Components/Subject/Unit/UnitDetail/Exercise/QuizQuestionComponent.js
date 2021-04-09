import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Space, Button, Popconfirm, message, Tooltip } from "antd";
import EditQuestion from "../../../../Question/Exercise/Modal/EditQuestion";
import ViewQuestion from "../../../../Question/Exercise/Modal/ViewQuestion";
import AddQuestion from "./AddQuestion";
import { QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const QuizQuestionComponent = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    getQuestionByExerciseID();
  }, []);

  const getQuestionByExerciseID = async () => {
    let exerciseID = window.location.pathname.split("/")[6];
    await axios
      .get(
        `https://mathscienceeducation.herokuapp.com/exerciseOrGame/${exerciseID}/questions?isExericse=true`
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = async (id) => {
    let exerciseID = window.location.pathname.split("/")[6];
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
          exercise: true,
          exerciseId: exerciseID,
          questionIds: ids,
        }
      )
      .then((res) => {
        console.log(res);
        getQuestionByExerciseID();
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
      align: "center",
      render: (record) => (
        <Space size="small">
          <ViewQuestion data={record} />
          <EditQuestion
            data={record}
            getQuestionByExerciseID={getQuestionByExerciseID}
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
    <Card type="inner" title="Exercise 1">
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <AddQuestion
          getQuestionByExerciseID={getQuestionByExerciseID}
          data={data}
        />
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

export default QuizQuestionComponent;
