import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const AddNewClass = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const onFinish = (values) => {
    setLoading(true);
    async function createClass() {
      await axios
        .post("https://mathscienceeducation.herokuapp.com/class", {
          className: values.class,
          gradeId: props.gradeID,
          schoolId: window.location.pathname.split("/")[2],
        })
        .then((res) => {
          console.log(res);
          props.getClassBySchoolGrade();
          setLoading(false);
          handleCancel();
          message.success("Create Class successfully!");
          form.resetFields();
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          message.error("Fail to create Class!");
        });
    }
    createClass();
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        onClick={showModal}
        icon={<PlusOutlined />}
      >
        Create Class
      </Button>
      <Modal
        title="Create Class"
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
        <Form {...layout} form={form}>
          <Form.Item
            name="class"
            label="Class Name"
            rules={[
              { required: true, message: "Please input a class name" },
              { max: 20, message: "Can only input 20 characters!" },
            ]}
          >
            <Input placeholder="Class Name" maxLength={21} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddNewClass;
