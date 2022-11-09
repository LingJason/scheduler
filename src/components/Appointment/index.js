import "components/Appointment/styles.scss";
import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    transition(SAVING)
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW)
      })
      .catch((err) => {
        transition(ERROR_SAVE, true);
        console.log(err.message);
      })
  }

  function deleteInterview() {
    transition(DELETE);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      }).catch((err) => {
        transition(ERROR_DELETE, true);
        console.log(err.message);
      })
  }

  return (
    <article
      className="appointment"
      data-testid="appointment" >
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview && props.interview.student}
          interviewer={props.interview && props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          onSave={save}
          interviewers={props.interviewers}
          onCancel={back}
        />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === EDIT && (
        <Form
          onSave={save}
          interviewers={props.interviewers}
          onCancel={back}
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
      {mode === DELETE && <Status message={"Deleting"} />}
      {mode === ERROR_DELETE && <Error message={"Error Deleting"} onClose={back} />}
      {mode === ERROR_SAVE && <Error message={"Error Saving"} onClose={back} />}
      {mode === CONFIRM && <Confirm onConfirm={deleteInterview} onCancel={() => transition(SHOW)} />}
    </article>
  );
}