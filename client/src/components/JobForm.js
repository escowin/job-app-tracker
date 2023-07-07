import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_JOB_APPLICATION } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

function JobForm() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");

  // bug | can't select status
  const [selectedStatus, setSelectedStatus] = useState("");
  const editPath = window.location.pathname.includes("/edit-job");

  const statusValues = ["pending", "rejected", "hired"];

  const [addJobApplication, { error }] = useMutation(ADD_JOB_APPLICATION, {
    update(cache, { data: { addJobApplication } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              jobApplications: [...me.jobApplications, addJobApplication],
            },
          },
        });
      } catch (err) {
        console.warn("first job app submitted by user");
      }
    },
  });

  //  captures & sets form state
  const handleChange = (e) => {
    if (e.target.name === "company") {
      setCompany(e.target.value);
    } else if (e.target.name === "role") {
      setRole(e.target.value);
    } else if (e.target.name === "date-submitted") {
      setDateSubmitted(e.target.value);
    }
    // bug | reconfigure radio
    else if (e.target.name === "pending") {
      console.log(e.target.value);
      setSelectedStatus(e.target.value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await addJobApplication({
        variables: {
          company,
          role,
          dateSubmitted,
        },
      });
      // redirects user back to home
      window.location.assign("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h2>job application</h2>
      <form onSubmit={handleFormSubmit} className="job-form">
        <article className="wrapper">
          <label htmlFor="company">Company</label>
          <input name="company" onChange={handleChange} />
        </article>
        <article className="wrapper">
          <label htmlFor="role">Role</label>
          <input name="role" onChange={handleChange} />
        </article>
        {editPath ? (
          <>
            <fieldset>
              <legend>status</legend>
              {statusValues.map((status, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    name="status"
                    value="status"
                    checked={status === selectedStatus}
                    onChange={handleChange}
                  />
                  <label htmlFor={status}>{status}</label>
                </div>
              ))}
            </fieldset>
          </>
        ) : null}
        <article>
          <label htmlFor="date-submitted">Date submitted</label>
          <input name="date-submitted" type="date" onChange={handleChange} />
        </article>
        <article className="wrapper">
          <button type="submit">submit</button>
        </article>
      </form>
    </>
  );
}

export default JobForm;
