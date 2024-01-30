let userList = {
  name: "Vorname Nachname",
  email: "email@email.de",
  password: "test123",
  initials: "VN",
};

let contactList = {
  startingLetter: "A",
  name: "Anja Schulz",
  e_mail: "schulz@hotmail.com",
  phone: 9102423513,
  initials: "AS",
  color: "#FF7A00",
  id: 1,
};

let taskList = {
  id: 1,
  title: "title",
  description: "längerer Text",
  dueDate: "dd/mm/yyyy",
  priority: "urgent",
  category: "user story",
  assignedTo: [
    {
      startingLetter: "A",
      name: "Anja Schulz",
      e_mail: "schulz@hotmail.com",
      phone: 9102423513,
      initials: "AS",
      color: "#FF7A00",
    },
  ],
  subtasks: [
    {
      text: "subtask1",
      status: "done",
    },
  ],
  status: ["todo", "inprogress", "feedback", "done"] /* nur eine Zuweisung */,
};

