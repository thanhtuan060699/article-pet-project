import axios from "axios";
import "draft-js/dist/Draft.css";
import moment from "moment";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "tailwindcss/tailwind.css";

const Home: NextPage = () => {
  const router = useRouter();
  let dataDate = {
    datasets: [
      {
        label: "Posts in day",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  let dataCate = {
    datasets: [
      {
        label: "Posts of Category",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const [startDate, setStartDate] = useState(() => {
    var d = new Date();
    return d.setDate(d.getDate() - 4);
  });
  const [endDate, setEndDate] = useState(new Date());
  const [dataDay, setDataDay] = useState(dataDate);
  const [dataCategory, setDataCategory] = useState(dataCate);

  const getStatisticDay = async (startDate: any, toDate: any) => {
    var url = `/api/post/statistic/day?from=${startDate}&end=${toDate}`;
    await axios.get(url).then((response: any) => {
      dataDate.datasets[0].data = response.data.result.data;
      dataDate.labels = response.data.result.days;
      dataDate.key = Date.now();
      setDataDay(dataDate);
    });
  };
  const getStatisticCategory = async (startDate: any, toDate: any) => {
    var urlCate = `/api/post/statistic/category?from=${startDate}&end=${toDate}`;
    var responseCate = await axios.get(urlCate);
    dataCate.datasets[0].data = responseCate.data.r.map((i: any) => i.count);
    dataCate.labels = responseCate.data.r.map((i: any) => i._id.category);
    dataCate.key = Date.now();
    setDataCategory(dataCate);
  };
  useEffect(() => {
    (async function getData() {
      var startDateFormat = moment().subtract(4, "d").format("yyyy-MM-DD");
      var endDateFormat = moment().format("yyyy-MM-DD");
      await getStatisticDay(startDateFormat, endDateFormat);
      await getStatisticCategory(startDateFormat, endDateFormat);
    })();

    // getData()
  }, []);

  const toDay = async () => {
    var startDateFormat = moment(startDate).format("yyyy-MM-DD");
    var endDateFormat = moment(endDate).format("yyyy-MM-DD");
    await getStatisticDay(startDateFormat, endDateFormat);
    await getStatisticCategory(startDateFormat, endDateFormat);
  };
  return (
    <div>
      <main className="bg-gray-200 h-screen p-8">
        <h1 className="text-2xl font-semibold text-center">
          Statistic with Chartjs
        </h1>
        <div className="w-4/5 mx-auto bg-white rounded-lg border border-gray-200 p-8 mt-4 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-48">
              <DatePicker
                className="relative px-2 py-1 h-10 border border-gray-200 rounded"
                selected={startDate}
                onChange={(date: any) => setStartDate(date)}
              />
            </div>
            <div className="w-48">
              <DatePicker
                className="relative px-2 py-1 h-10 border border-gray-200 rounded"
                selected={endDate}
                onChange={(date: any) => setEndDate(date)}
              />
            </div>
            <button
              onClick={() => toDay()}
              className="px-6 py-2 border-solid bg-blue-500 text-white rounded"
            >
              Search
            </button>
            <button
              onClick={() => router.push(`/`)}
              className="px-6 py-2 border-solid bg-red-40 text-white rounded"
            >
              Create post
            </button>
          </div>
          <div className="flex mt-6">
            <div className="w-1/2">
              <Line data={dataDay} key={dataDay.key} />
            </div>
            <div className="w-1/2">
              <Bar data={dataCategory} key={dataCategory.key} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
