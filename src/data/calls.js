const calls = [
  {
    userId: 11,
    date: new Date().getTime() - 4 * 60 * 60 * 1000,
    type: "Incoming",
  },
  {
    userId: 12,
    date: new Date().getTime() - 12 * 60 * 60 * 1000,
    type: "Outgoing",
  },
  {
    userId: 3,
    date: new Date().getTime() - 24 * 60 * 60 * 1000,
    type: "Missed",
  },
  {
    userId: 4,
    date: new Date().getTime() - 2 * 24 * 60 * 60 * 1000,
    type: "Incoming",
  },
  {
    userId: 4,
    date: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
    type: "Missed",
  },
  {
    userId: 7,
    date: new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
    type: "Missed",
  },
  {
    userId: 1,
    date: new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
    type: "Incoming",
  },
  {
    userId: 16,
    date: new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
    type: "Incoming",
  },
  {
    userId: 19,
    date: new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
    type: "Outgoing",
  },
  {
    userId: 20,
    date: new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    type: "Incoming",
  },
  {
    userId: 17,
    date: new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    type: "Missed",
  },
  {
    userId: 20,
    date: new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    type: "Missed",
  },
  {
    userId: 5,
    date: new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    type: "Outgoing",
  },
  {
    userId: 4,
    date: new Date().getTime() - 5 * 24 * 60 * 60 * 1000,
    type: "Outgoing",
  },
];
export default calls;
