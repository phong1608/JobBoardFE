import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  useEffect(() => {
    try {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/Jobs`, {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (!isAuthorized) {
    navigateTo("/");
  }
  console.log(jobs)
  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {jobs &&
            jobs.map((item) => {
              return (
                <div className="card" key={item._id}>
                  <p>{item.title}</p>
                  <p>{item.salary}</p>
                  <p>{item.location}</p>
                  <Link to={`/job/${item.id}`}>Job Details</Link>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
