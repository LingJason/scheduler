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