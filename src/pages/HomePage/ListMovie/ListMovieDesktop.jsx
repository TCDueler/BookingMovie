import React, { useEffect, useState } from 'react'
import { movieService } from '../../../service/service'
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';

import { NavLink, useParams } from "react-router-dom";
export default function ListMovieDesktop() {
  const [list, setList] = useState();

  console.log("list", list)

  useEffect(() => {
    movieService
      .getList()
      .then((res) => {
        setList(res.data.content);
      })
      .catch((err) => {
        console.log(err)
      })
  }, []);
  let renderList = () => {
    return list?.map(({ hinhAnh, tenPhim, maPhim }) => {
      return (<Card
        hoverable
        style={{
          width: 240,
        }}
        cover={<img alt="example" src={hinhAnh} className='object-cover h-80' />}
      >
        <Meta title={tenPhim} />
        <NavLink to={`/detail/${maPhim}`} className='h-10 w-full rounded bg-red-600 text-white block leading-10 text-center'>Xem ngay</NavLink>
      </Card>)
    })
  }
  return <div className='container grid grid-cols-4 gap-10 pt-20'>{renderList()}</div>;

}
