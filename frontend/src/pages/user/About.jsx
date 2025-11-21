
import { Tabs } from "antd";
  
const About = () => {
     const items = [
        { key: "1", label: "Thông Tin", children:"Quyền"},
        { key: "2", label: "Quyền", children: "Thông tin"},
        { key: "3", label: "Đơn Hàng", children: "Đơn hàng"},
];
  return (
    <div>
         <Tabs items={items}/>;
    </div>
  );
}

export default About;
