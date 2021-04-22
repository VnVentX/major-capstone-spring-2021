import React, { Component } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  AutoComplete,
  Select,
} from "antd";
import { QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AddNewSchool from "./Modal/AddNewSchool";
import EditSchool from "./Modal/EditSchool";

export default class SchoolComponent extends Component {
  state = {
    dataSource: [],
    dataSearch: [],
    schoolSearch: "",
    isLoading: true,
  };

  componentDidMount() {
    this.getAllSchool();
    this.setState({ isLoading: false });
  }

  getAllSchool = async () => {
    await axios
      .get(`${process.env.REACT_APP_BASE_URL}/school/all`)
      .then((res) => {
        this.setState({
          dataSource: res.data.length === 0 ? [] : res.data,
          dataSearch: res.data.length === 0 ? [] : res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  disableSchool = async (id, status) => {
    await axios
      .put(`${process.env.REACT_APP_BASE_URL}/school/changeStatus`, {
        id: id,
        status: status,
      })
      .then((res) => {
        console.log(res);
        this.getAllSchool();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleDisableSchool = (e, status) => {
    let message = "";
    if (status === "DELETED") {
      message = "DELETED";
    } else if (status === "ACTIVE") {
      message = "INACTIVE";
    } else if (status === "INACTIVE") {
      message = "ACTIVE";
    }
    this.disableSchool(e, message);
  };

  render() {
    const columns = [
      {
        title: "School",
        render: (record) => (
          <Link to={`/school/${record.id}`}>
            {record.schoolLevel === "PRIMARY" ? (
              <>TH {record.schoolName}</>
            ) : record.schoolLevel === "JUNIOR" ? (
              <>THCS {record.schoolName}</>
            ) : (
              <>THPT {record.schoolName}</>
            )}
          </Link>
        ),
      },
      {
        title: "School Code",
        dataIndex: "schoolCode",
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
        title: "Status",
        dataIndex: "status",
        render: (status) => (
          <span>
            {status === "ACTIVE" ? (
              <Tag color={"green"} key={status}>
                Active
              </Tag>
            ) : status === "INACTIVE" ? (
              <Tag color={"volcano"} key={status}>
                Disabled
              </Tag>
            ) : null}
          </span>
        ),
      },
      {
        title: "Action",
        align: "center",
        render: (record) => (
          <Space size="small">
            <Popconfirm
              placement="topRight"
              title={
                record.status === "ACTIVE"
                  ? "Are you sure to disable this School?"
                  : "Are you sure to active this School?"
              }
              onConfirm={() =>
                this.handleDisableSchool(record.id, record.status)
              }
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Change Status</Button>
            </Popconfirm>
            <EditSchool getAllSchool={this.getAllSchool} schoolID={record.id} />
            <Popconfirm
              placement="topRight"
              title="Are you sure to delete this Schools?"
              onConfirm={() => this.handleDisableSchool(record.id, "DELETED")}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                style={{ marginRight: 10 }}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <Card type="inner" title="School Management">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <AutoComplete
            dataSource={this.state.dataSearch?.map((item, idx) => (
              <Select.Option key={idx} value={item.schoolName}>
                Trường Tiểu Học {item.schoolName}
              </Select.Option>
            ))}
          >
            <Input.Search
              placeholder="Search a School"
              allowClear
              onSearch={(schoolSearch) =>
                this.setState({
                  dataSource: this.state.dataSearch?.filter((item) =>
                    item.schoolName
                      .toString()
                      .toLowerCase()
                      .includes(schoolSearch.toLowerCase())
                  ),
                })
              }
              enterButton
            />
          </AutoComplete>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AddNewSchool getAllSchool={this.getAllSchool} />
          </div>
        </div>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={this.state.dataSource}
          scroll={{ x: true }}
          loading={this.state.isLoading}
        />
      </Card>
    );
  }
}
