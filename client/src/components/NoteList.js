import { useMutation } from "@apollo/client";
import { QUERY_JOB, QUERY_ME } from "../utils/queries";
import { DELETE_NOTE } from "../utils/mutations";

function NoteList({ notes, jobId, status }) {
  let deletedNoteId;
  const [deleteNote, { error }] = useMutation(DELETE_NOTE, {
    update(cache, { data }) {
      const { job } = cache.readQuery({
        query: QUERY_JOB,
        variables: { id: jobId },
      });
      // array is composed of objects that don't match the deleted note's id
      const updatedNotes = job.notes.filter(
        (note) => note._id !== deletedNoteId
      );

      // job query's notes array is written with the updated array
      cache.writeQuery({
        query: QUERY_JOB,
        variables: { id: jobId },
        data: {
          job: {
            ...job,
            notes: updatedNotes,
          },
        },
      });

      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: {
          me: {
            ...me,
            jobs: me.jobs.map((job) =>
              job._id === jobId ? { ...job, noteCount: updatedNotes.length } : job
            ),
          },
        }
      })
    },
  });

  const handleDeleteNote = async (_id) => {
    // value is set here in order to use the .filter() method to modify job query cache
    deletedNoteId = _id;
    try {
      const { data } = await deleteNote({
        variables: { jobId: jobId, id: _id },
      });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ul id="notes">
      {notes.map((note, i) => (
        <li key={i} className={`note ${status}`}>
          <h3>{note.createdAt}</h3>
          <p>{note.note}</p>
          <button onClick={() => handleDeleteNote(note._id)}>delete</button>
        </li>
      ))}
      {error && <span>error</span>}
    </ul>
  );
}

export default NoteList;
