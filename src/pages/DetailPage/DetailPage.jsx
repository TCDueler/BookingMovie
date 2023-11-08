import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { movieService } from "../../service/service";
import { Progress, Rate,ConfigProvider,Tabs } from "antd";
import moment from 'moment';
import { SET_MALICHCHIEU } from "../../redux/constant/user";
import { useDispatch } from "react-redux";
const onChange = (key) => {
  console.log("key",key);
};

export default function DetailPage() {
  let dispatch=useDispatch();
  let navigate = useNavigate();
// let iconRap = [ 
//   {"maHeThongRap":"CGV","img":"https://movienew.cybersoft.edu.vn/hinhanh/cgv.png"},
//   {"maHeThongRap":"CineStar","img":"https://movienew.cybersoft.edu.vn/hinhanh/cinestar.png"},
//   {"maHeThongRap":"Galaxy","img":"https://movienew.cybersoft.edu.vn/hinhanh/galaxy-cinema.png"},
//   {"maHeThongRap":"LotteCinima","img":"https://movienew.cybersoft.edu.vn/hinhanh/lotte-cinema.png"},
//   {"maHeThongRap":"MegaGS","img":"https://movienew.cybersoft.edu.vn/hinhanh/megags.png"},
//   {"maHeThongRap":"BHDStar","img":"https://movienew.cybersoft.edu.vn/hinhanh/bhd-star-cineplex.png"},]

  //detail id
  let { id } = useParams();
  const [detail, setDetail] = useState();
  const [rapCoChieu,setRapCoChieu]=useState();
  console.log("id",id);
  console.log("rapcochieu",rapCoChieu)

  // detail phim
  useEffect(() => {
    movieService
      .getDetail(id)
      .then((res) => {
        setDetail(res.data.content);
        console.log("resdetail", res);
      })
      .catch((err) => {
        console.log(err);
      });
      
  }, []);
  //lay ds rap theo phim
  useEffect(() => {
    movieService
      .getBroadcastScheduleByMovie(id)
      .then((res) => {
        setRapCoChieu(res.data.content);
        console.log("res movie", res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
      
  }, []);
  

  //render rap - lich chieu
  const [heThongRap, setHeThongRap] = useState([]);
  console.log("heThongrap",heThongRap)
  useEffect(() => {
    movieService
      .getMovieByTheater()
      .then((res) => {
        setHeThongRap(res.data.content);
        console.log("movieby theater",res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  let renderHeThongRap = () => {

    return rapCoChieu?.heThongRapChieu.map((heThong) => {
      return {
        key: heThong.maHeThongRap,
        label: <img src={heThong.logo} className="w-16"></img>,
        children: (
          <Tabs
            style={{
              height: 600,
            }}
            tabPosition="left"
            items={heThong.cumRapChieu.map((cumRap) => {

              return {
                key: cumRap.tenCumRap,
                label: (
                  <div className="text-left w-96 whitespace-normal">
                  
                      <p>{cumRap.tenCumRap}</p>
                    <p>{cumRap.diaChi}</p>
                    {cumRap.lichChieuPhim?.map((lich)=>{
                      return  <span 
                      onClick={()=>{
                        dispatch({
                          type:SET_MALICHCHIEU,
                          payload:lich.maLichChieu,
                        })
                        localStorage.setItem("SCHEDULE",JSON.stringify(lich.maLichChieu))
                        navigate("/booking")
                        console.log("lichchieu",id)}}
                      className="rounded bg-red-600 px-2 py-1 text-white">{moment(lich.ngayChieuGioChieu).format("DD/MM/YYYY - HH:mm")}</span>
                     
                 
                    })}
                  </div>
                ),
                children:<div 
                  style={{
            height: 600,
            overflow:"scroll",
          }}>
                 
                </div>,
              };
            })}
          />
        ),
      };
    });
  };
  
  return (
    <div className="flex flex-col">
<div className="container flex items-center">
      <img className="w-1/3" src={detail?.hinhAnh} alt="" />
      <Progress
        strokeWidth={20}
        size={200}
        strokeColor={"red"}
        format={(number) => {
          return (
            <p className="animate-spin text-blue-600 text-xl font-extrabold">
              {" "}
              {number / 10 + "Điểm"}
            </p>
          );
        }}
        type="circle"
        percent={detail?.danhGia * 10}
      />
       <Rate allowHalf Value={detail?.danhGia} count={10} className="text-red-500"/>
        <div className="container py-20">
      
    </div>

    </div>
    <div>
    <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#fb8500",
            borderRadius: 2,
            colorBgContainer: "#fb8500",
          },
        }}
      >
        <Tabs
          style={{
            height: 600,
          }}
          tabPosition="left"
          defaultActiveKey="1"
          items={renderHeThongRap()}
          onChange={onChange}
        />
      </ConfigProvider>
    </div>
    </div>
    
  );
}

