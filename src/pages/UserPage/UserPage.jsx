import React, { useEffect, useState } from "react";
import { adminService, userService } from "../../service/service";
import { Button, Drawer, Modal, Table, Tag, Form, Input } from "antd";
import toast from "react-hot-toast";

//import { Form } from "react-router-dom";

export default function UserPage() {
  // gọi api lấy danh sách ng dùng
  // antd table
  const [userArr, setUserArr] = useState([]);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [userDelete, setUserDelete] = useState();

  const [userDetail, setUserDetail] = useState();


  //try catch
  const getUser = async () => {
    try {
      const res = await adminService.getUserList('?maNhom=GP00')
      setUserArr(res.data.content)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // antd table 
    getUser();
  }, []);

  const dataSource = userArr;
  const columns = [
    {
      title: "Name",
      dataIndex: "hoTen",
      key: "name",
    },
    {
      title: "Gmail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "User Type",
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
      render: (text) => {
        if (text == "KhachHang") return <Tag color="green">Khách Hàng</Tag>;
        else return <Tag color="red">Quản Trị</Tag>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (value, recordItem, index) => {
        return (
          <div className="flex gap-5">
            <Button
              type="primary"
              onClick={async () => {
                try {
                  const res = await adminService.getUserDetailById(
                    recordItem.taiKhoan
                  );
                  if (res) {
                    setUserDetail(res.data.content);
                    setIsOpenDrawer(true);
                  }
                } catch (err) {
                  console.log("err", err)
                }
              }}
            >
              Edit
            </Button>
            <Button
              danger
              onClick={() => {
                console.log("recordItem", recordItem);
                setUserDelete(recordItem);
                setIsOpenModal(true);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
      width: 100,
    },
  ];

  return (
    <div>
      <Table dataSource={userArr} columns={columns} />
      <Modal
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={async () => {
          try {
            await adminService.deleteUser(userDelete.taiKhoan);
            getUser();
            toast.success("xoá user thành công");

          } catch (err) {
            // toast.error("xoá user thất bại")
            toast.error(err.response.data.content);
          } finally {
            setIsOpenModal(false);
          }
        }}
      >
        <p>Xác nhận xoá thông tin user {userDelete?.taiKhoan}</p>
      </Modal>
      {userDetail && (
        <Drawer
          open={isOpenDrawer}
          onClose={() => {
            setIsOpenDrawer(false);
            setUserDetail(undefined)

          }}
          title="Chỉnh sửa thông tin user"
        >
          <Form
            onFinish={async (values) => {
              try {
                const res = await adminService.updateUser({
                  ...userDetail,
                  ...values,
                });
                setIsOpenDrawer(false);
                setUserDetail(undefined);
                getUser();
                toast.success("cập nhật user thành công");
              } catch (err) {
                toast.error("cập nhật user thất bại");
              }
              console.log(values);
            }}
            className="d-flex justify-content-center"
          >
            <Form.Item
              label="Họ và tên"
              name="hoTen"
              initialValue={userDetail?.hoTen}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              initialValue={userDetail?.email}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="soDt"
              initialValue={userDetail?.soDT}
            >
              <Input />
            </Form.Item>
            <Button type="primary" className="!mt-10" htmlType="submit">
              Update
            </Button>
          </Form>
        </Drawer>
      )}
    </div>
  );
}
