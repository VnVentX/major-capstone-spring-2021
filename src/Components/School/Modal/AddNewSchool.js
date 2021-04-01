import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const existedContent = `This school name in this district is already existed. Do you want to
create this school?
\n
This action can not be reversed.`;
const okContent = `School name is very important. Do you want to
create this school?
\n
This action can not be reversed.`;

const AddNewSchool = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const createNewSchool = async (values) => {
    await axios
      .post("https://mathscienceeducation.herokuapp.com/school", {
        schoolDistrict: values.schoolDistrict,
        schoolName: values.schoolName.trim(),
        schoolStreet: values.schoolStreet.trim(),
        schoolLevel: values.type,
      })
      .then((res) => {
        console.log(res);
        props.getAllSchool();
        message.success("Create new school successfully!");
      })
      .catch((e) => {
        console.log(e);
        message.error("Fail to create new school!");
      });
  };

  const onFinish = (event) => {
    setLoading(true);
    async function checkExisted() {
      await axios
        .get(
          `https://mathscienceeducation.herokuapp.com/school?schoolDistrict=${
            event.schoolDistrict
          }&schoolLevel=${event.type}&schoolName=${event.schoolName.trim()}`
        )
        .then((res) => {
          console.log(res);
          setLoading(false);
          if (res.data === "EXISTED") {
            warning(event, form, existedContent);
          } else if (res.data === "OK") {
            warning(event, form, okContent);
          }
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
    checkExisted();
  };

  const warning = (values, form, content) => {
    Modal.confirm({
      title: "Waring",
      closable: true,
      content: content,
      okText: "Continue",
      onOk: async () => {
        await createNewSchool(values);
        handleCancel();
        form.resetFields();
      },
    });
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        onClick={showModal}
        icon={<PlusOutlined />}
      >
        Create School
      </Button>
      <Modal
        title="Create School"
        visible={visible}
        okText="Create"
        confirmLoading={loading}
        onCancel={handleCancel}
        destroyOnClose
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onFinish(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form {...layout} form={form} initialValues={{ type: "PRIMARY" }}>
          <Form.Item
            name="type"
            label="Educational level"
            rules={[
              {
                required: true,
                message: "Please select a level",
              },
            ]}
          >
            <Select placeholder="Select a level">
              <Option value="PRIMARY">Primary School</Option>
              <Option value="JUNIOR">Junior High School</Option>
              <Option value="HIGH">High School</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="schoolName"
            label="School Name"
            rules={[{ required: true, message: "Please input a school" }]}
          >
            <Input placeholder="School Name" />
          </Form.Item>
          <Form.Item
            name="schoolDistrict"
            label="District"
            rules={[
              {
                required: true,
                message: "Please select a district",
              },
            ]}
          >
            <Select placeholder="Select a district">
              <Option value="District 1">District 1</Option>
              <Option value="District 2">District 2</Option>
              <Option value="District 3">District 3</Option>
              <Option value="District 4">District 4</Option>
              <Option value="District 5">District 5</Option>
              <Option value="District 6">District 6</Option>
              <Option value="District 7">District 7</Option>
              <Option value="District 8">District 8</Option>
              <Option value="District 9">District 9</Option>
              <Option value="District 10">District 10</Option>
              <Option value="District 11">District 11</Option>
              <Option value="District 12">District 12</Option>
              <Option value="Binh Thanh District">Binh Thanh District</Option>
              <Option value="Thu Đuc District">Thu Đuc District</Option>
              <Option value="Go Vap District">Go Vap District</Option>
              <Option value="Phu Nhuan District">Phu Nhuan District</Option>
              <Option value="Tan Binh District">Tan Binh District</Option>
              <Option value="Tan Phu District">Tan Phu District</Option>
              <Option value="Binh Tan District">Binh Tan District</Option>
              <Option value="Nha Be District">Nha Be District</Option>
              <Option value="Hoc Mon District">Hoc Mon District</Option>
              <Option value="Binh Chanh District">Binh Chanh District</Option>
              <Option value="Cu Chi District">Cu Chi District</Option>
              <Option value="Can Gio District">Can Gio District</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="schoolStreet"
            label="Street"
            rules={[{ required: true, message: "Please input street" }]}
          >
            <Input placeholder="Street" />
          </Form.Item>
          {/* <Form.Item
            name="distrisct"
            label="Distrisct"
            rules={[{ required: true, message: "Please choose a distrisct" }]}
          >
            <Select placeholder="Select a level">
              <Option value="PRIMARY">Primary School</Option>
              <Option value="JUNIOR">Junior High School</Option>
              <Option value="HIGH">High School</Option>
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default AddNewSchool;
