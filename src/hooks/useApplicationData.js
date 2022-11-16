import { useState, useEffect } from "react";
import "components/Application.scss";
import "components/Appointment";
import axios from "axios";

export default function useApplicationData() {
  
  const setDay = day => setState({ ...state, day });

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });


  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = state.days.map((day) => {
      const edit = state.appointments[id].interview

      if(day.name === state.day && !edit) {
        return {
          ...day,
          spots:day.spots - 1,
        };
      }
      if(day.name === state.day && edit) {
      console.log("HERE11")
      return {
        ...day,
      };
    }
      return day;
    })

    return axios.put(`/api/appointments/${id}`, {
      interview
    })
      .then(() => {
        setState({
          ...state,
          appointments,
          days
        });
      })
  }

  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = state.days.map((day) => {
      if(day.name === state.day) {
        return {
          ...day,
          spots:day.spots + 1,
        };
      }
      return day;
    })


    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          days,
          appointments
        });
      })
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview }
}
