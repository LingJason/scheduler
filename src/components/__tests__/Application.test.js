import React from "react";
import Axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, screen } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the application.
    const { container } = render(<Application />);

    //2. loads the page.
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    // 3. Click the "Add" button.
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter student name.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Select Interviewer.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Save appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Check to see the appointment is there.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    // 9. Check to see if "Monday" has "no spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the Archie Cohen appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirm message is shown.
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    // 5. Click the "Confirm" button.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that "Deleting" is shown.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Check to see that the add button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check DayListItem with the text "Monday" has the text "2 spot remaining"
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Edit the name.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Tony Robinson" }
    });

    // 5. Click the "Save" button.
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 7. Wait until the element is updated.
    await waitForElement(() => queryByText(appointment, "Tony Robinson"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining".

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    Axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    //2. loads the page.
    await waitForElement(() => container)

    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    // 3. Click the "Add" button.
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter student name.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Select Interviewer.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Save appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Receives error saving message
    await waitForElement(() => getByText(appointment, "Error Saving"));
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    Axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    //2. loads the page.
    await waitForElement(() => container)

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Delete" button.
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirm message is shown.
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    // 5. Click the "Confirm" button.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Receives error deleting message
    await waitForElement(() => getByText(appointment, "Error Deleting"));
  });

});