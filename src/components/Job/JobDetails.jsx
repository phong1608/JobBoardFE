import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/Jobs/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, []);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span> {job.title}</span>
          </p>
         
          <p>
            Location: <span>{job.location}</span>
          </p>
          <p>
            Description: <span>{job.description}</span>
          </p>
          <p>
            Job Posted On: <span>{new Date(job.createdAt).toLocaleString()}</span>
          </p>
          <p>
            Salary:{job.salary}
            
          </p>
          {user && user.userType === "Employer" ? (
            <></>
          ) : (
            <Link to={`/application/${job.id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
