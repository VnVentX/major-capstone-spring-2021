import { Col, Layout } from "antd";
import QuizQuestionComponent from "../Components/Lesson/QuizQuestionComponent";
const { Content } = Layout;

const AddQuizQuestion = () => {
  return (
    <Col span={24}>
      <Content className="main-layout site-layout-background">
        <QuizQuestionComponent />
      </Content>
    </Col>
  );
};

export default AddQuizQuestion;
