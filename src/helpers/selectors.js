export function getAppointmentsForDay(state, day) {

  if (state.days.length === 0) {
    return [];
  }

  let dayAppointments;
  let result = [];

  for (const element of state.days) {
    if (element.name === day) {
      dayAppointments = element.appointments;
    }
  }

  if (!dayAppointments) {
    return [];
  }

  for (const appointmentId of dayAppointments) {
    result.push(state.appointments[appointmentId])
  }

  return result;
};

export function getInterview(state, interview) {

  let result = {}

  if (interview === null) {
    return null;
  }
  result["student"] = interview.student;

  for (const interviewerId in state.interviewers) {
    if (interview.interviewer === Number(interviewerId)) {
      result["interviewer"] = state.interviewers[interviewerId]
    }
  }
  return result;
}