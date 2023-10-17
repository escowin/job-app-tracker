import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_JOB } from "../utils/queries";
import Auth from "../utils/auth";
import JobNotes from "../components/JobNotes";
import JobOptions from "../components/JobOptions";
import JobProfile from "../components/JobProfile";
import DocForm from "../components/DocForm";
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

  // Job.js purpose:
  // - edit button clicked in JobOptions determines whether JobForm or JobProfile renders
  return (
    <>
      <JobOptions jobId={job._id} setEditSelected={setEditSelected} />
        {editSelected 
        ? <DocForm initialValues={job} setEditSelected={setEditSelected} doc={"job"} type={"edit"} className={"section"} /> 
        : <JobProfile doc={job} title={job.role} className={job.status}/>}
      <JobNotes notes={job.notes} jobId={job._id} status={job.status} />
    </>
  );
}

export default Job;
