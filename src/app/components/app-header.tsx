import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Col,
  Drawer,
  Popover,
  Row,
  Image,
  Input,
  Button,
  Form,
  Modal,
} from "antd";
import "./app-header.css";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  SlackOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import {
  useAddToCart,
  useCustomer,
  useDecreaseToCart,
  useDeleteToCart,
  useUpdateUser,
} from "@/pages/app.loader";

export const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const { data: dataUser, isLoading } = useCustomer();
  const onClose = () => {
    setOpen(false);
  };
  const { mutate: mutateDelete } = useDeleteToCart();
  const { mutate: mutateIncrease } = useAddToCart();
  const { mutate: mutateDecrease } = useDecreaseToCart();
  const { mutate: mutateUpdateUser } = useUpdateUser();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const handleOk = () => {
    // Xử lý khi người dùng ấn OK

    form
      .validateFields()
      .then((values) => {
        var a = { ...values, _id: dataUser?.id };
        mutateUpdateUser(a);
        form.resetFields();
        setVisible(false);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    // Xử lý khi người dùng ấn Hủy
    form.resetFields();
    setVisible(false);
  };
  return (
    <>
      <Row className={"header-row"}>
        <Col className="gutter-row header pointer " span={12} push={1}>
          <div onClick={() => handleClick("")} style={{ fontSize: 18 }}>
            <SlackOutlined style={{ color: "#edb932", paddingRight: 10 }} />
            <b>H A Y Y A</b>
          </div>
        </Col>
        <Col className="gutter-row header pointer " span={1.5}>
          <div onClick={() => handleClick("/")}>Home</div>
        </Col>
        <Col className="gutter-row header pointer" span={1.5}>
          <div onClick={() => handleClick("/sanpham")}>Products</div>
        </Col>
        <Col className="gutter-row header pointer" span={1.5}>
          <div onClick={() => handleClick("/room")}>Rooms</div>
        </Col>
        <Col className="gutter-row header pointer" span={1.5}>
          <div onClick={() => handleClick("/about-us")}>About Us</div>
        </Col>
        <Col className="gutter-row header pointer" span={1.5}>
          <div onClick={() => handleClick("/contact")}>Contact Us</div>
        </Col>
        <Col className="gutter-row header pointer" span={1.5}>
          <div onClick={showDrawer}>
            <ShoppingCartOutlined style={{ fontSize: 24 }} />
          </div>
        </Col>
        <Col className="gutter-row header pointer" span={1.5}>
          <Popover
            content={
              <div>
                <div className="pointer" onClick={handleEditUser}>
                  Sửa thông tin cá nhân
                </div>
                <div className="pointer" onClick={handleMyOrder}>
                  Đơn mua
                </div>
                <div className="pointer" onClick={() => handleLogout("/login")}>
                  Đăng xuất
                </div>
              </div>
            }
            title={
              <div>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{ marginRight: 10 }}
                />
                {dataUser?.fullname}
              </div>
            }
            overlayStyle={{ maxWidth: 180 }}
          >
            <UserOutlined style={{ fontSize: 24 }} />
          </Popover>
        </Col>
      </Row>
      <Drawer
        title="Shopping Cart"
        footer={
          <Col style={{ padding: 15 }}>
            <Row justify={"space-between"}>
              {dataUser?.cart?.data?.length > 0 && (
                <Col style={{ paddingTop: 13 }}>
                  <Button
                    className="button"
                    onClick={() => handleClick("/check-out")}
                  >
                    CHECK OUT
                  </Button>
                </Col>
              )}
              <Col>
                <h3>
                  Subtotal:{" "}
                  <span style={{ color: "#edb932" }}>
                    ${dataUser?.cart?.total}
                  </span>
                </h3>
              </Col>
            </Row>
          </Col>
        }
        closable={false}
        placement="right"
        onClose={onClose}
        open={open}
        width={500}
      >
        <Col>
          {!isLoading &&
            dataUser?.cart?.data?.map((item: any) => {
              return (
                <Row className="product-cart">
                  <Col span={4}>
                    <Image src={item.urlImg} preview={false} />
                  </Col>
                  <Col span={16} style={{ paddingTop: 10, paddingLeft: 10 }}>
                    <Row>
                      <h3>{item.color}</h3>
                    </Row>
                    <Row>
                      <Button.Group>
                        <Button onClick={handleDecrease} size={"small"}>
                          -
                        </Button>
                        <Input
                          // onChange={handleInputChange}
                          value={item.count}
                          size="small"
                          style={{ width: "40px", textAlign: "center" }}
                        />
                        <Button onClick={handleIncrease} size={"small"}>
                          +
                        </Button>
                      </Button.Group>
                    </Row>
                  </Col>
                  <Col span={4} style={{ paddingTop: 30 }}>
                    <Row justify={"center"}>
                      {" "}
                      <DeleteOutlined onClick={() => handleDelete(item._id)} />
                    </Row>
                    <Row justify={"center"} style={{ paddingTop: 10 }}>
                      <h3 style={{ color: "#edb932" }}>${item.price}</h3>{" "}
                    </Row>
                  </Col>
                </Row>
              );
              function handleIncrease() {
                increaseCount(item);
              }
              function handleDecrease() {
                decreaseCount(item);
              }
            })}
        </Col>
      </Drawer>
      <Modal
        title={"Sửa thông tin người dùng"}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item
            label="Fullname"
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập fullname!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="User"
            name="user"
            rules={[{ required: true, message: "Vui lòng nhập user!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập password!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  function handleClick(key: any) {
    setOpen(false);
    navigate(key);
  }
  function handleLogout(key: any) {
    localStorage.removeItem("token");
    navigate(key);
  }
  function handleEditUser() {
    setVisible(true);
    form.setFieldsValue(dataUser);
  }
  function handleMyOrder() {
    navigate("/my-order");
  }
  function handleDelete(id: any) {
    mutateDelete(id);
  }
  function increaseCount(value: any) {
    mutateIncrease(value._id);
  }

  function decreaseCount(value: any) {
    mutateDecrease(value._id);
  }
};
