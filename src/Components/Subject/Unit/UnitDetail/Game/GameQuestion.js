import React, { useState } from "react";
import { Card, Table, Space, Button, Popconfirm, message, Tooltip } from "antd";
import EditQuestion from "../../../../Question/Game/Modal/EditQuestion";
import AddQuestion from "./Modal/AddQuestion";
import { QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const data = [
  {
    key: "1",
    q_name: "Question 1",
    type: "FILL",
    createdBy: "anhtt",
    modifiedBy: "anhtt",
    createdDate: "14:24PM, 24/02/2021",
    modifiedDate: "14:50PM, 24/02/2021",
  },
  {
    key: "2",
    q_name: "Question 2",
    type: "MATCH",
    createdBy: "anhtt",
    modifiedBy: "anhtt",
    createdDate: "14:24PM, 24/02/2021",
    modifiedDate: "14:50PM, 24/02/2021",
  },
  {
    key: "3",
    q_name: "Question 3",
    type: "SWAP",
    createdBy: "anhtt",
    modifiedBy: "anhtt",
    createdDate: "14:24PM, 24/02/2021",
    modifiedDate: "14:50PM, 24/02/2021",
  },
  {
    key: "4",
    q_name: "Question 4",
    type: "CHOOSE",
    createdBy: "anhtt",
    modifiedBy: "anhtt",
    createdDate: "14:24PM, 24/02/2021",
    modifiedDate: "14:50PM, 24/02/2021",
  },
];

const GameQuestion = () => {
  const handleDelete = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };

  const selectedQuestionCol = [
    {
      title: "Question",
      dataIndex: "q_name",
    },
    {
      title: "Type",
      dataIndex: "type",
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
          <EditQuestion data={record} />
          <Tooltip title="Delete Question">
            <Popconfirm
              placement="topRight"
              title="Are you sure to delete this question?"
              onConfirm={() => handleDelete(record.key)} //Handle disable logic here
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
    <Card type="inner" title="Game 1">
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <AddQuestion />
      </div>
      <Table columns={selectedQuestionCol} dataSource={data} />
    </Card>
  );
};

export default GameQuestion;
