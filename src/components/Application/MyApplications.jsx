/* eslint-disable react/prop-types */
import  { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.userType === "Employer") {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/Applications/employer`, {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data);
          });
      } else {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/Applications/me`, {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application.id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.userType === "Candidate" ? (
        <div className="container">
          <center>
          <h1>My Applications</h1>
          </center>
          {applications.length <= 0 ? (
            <>
              {" "}
              <center>
              <h4>No Applications Found</h4></center>{" "}
            </>
          ) : (
            applications.map((element) => {
              return (
                <JobSeekerCard
                  element={element}
                  key={element.id}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <center>
          <h1>Applications From Job Seekers</h1>
          </center>
          {applications.length <= 0 ? (
            <>
            <center>
              <h4>No Applications Found</h4>
              </center>
            </>
          ) : (
            applications.map((element) => {
              return (
                <EmployerCard
                  element={element}
                  key={element.id}
                  openModal={openModal}
                />
              );
            })
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

// eslint-disable-next-line react/prop-types
const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  console.log(element)
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
        <p>
            <span>Job:</span> {element.job.title}
          </p>
          <p>
            <span>Name:</span> {element.applicantName}
          </p>
          <p>
            <span>Email:</span> {element.applicantEmail}
          </p>
         
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume)}
          />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element.id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
        <p>
            <span>Job:</span> {element.job.title}
          </p>
          <p>
            <span>Name:</span> {element.applicantName}
          </p>
          <p>
            <span>Email:</span> {element.applicantEmail}
          </p>
          
          
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.Resume)}
          />
        </div>
      </div>
    </>
  );
};
