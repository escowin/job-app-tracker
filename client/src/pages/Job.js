import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import Auth from "../utils/auth";
import JobNotes from "../components/JobNotes";
import JobOptions from "../components/JobOptions";
import JobProfile from "../components/JobProfile";
import JobForm from "../components/JobForm";
import "../assets/css/job.css";

function Job() {
  // state variables
  const [editSelected, setEditSelected] = useState(false);

  const loggedIn = Auth.loggedIn();
  const { id: _id } = useParams();
  const { loading, data } = useQuery(QUERY_JOB, {
    variables: { id: _id },
  });
  const job = data?.job || {};

  if (!loggedIn) {
    return <section>log in to view contents</section>;
  }

  if (loading) {
    return <section>loading...</section>;
  }

  // use global state to handle button clicks
  // Job.js purpose
  // - edit button clicked in JobOptions determines whether  #job-profile contents or JobForm.js renders
  // - eliminates the need for an /edit/:id route
  return (
    <>
      <JobOptions jobId={job._id} setEditSelected={setEditSelected} />
        {editSelected 
        ? <JobForm initialValues={job} id={"edit-job"} type={""}/> 
        : <JobProfile job={job} />}
      <JobNotes notes={job.notes} jobId={job._id} status={job.status} />
    </>
  );
}

export default Job;
