const chats = [
  {
    userId: 1,
    messages: [
      {
        text: "Hey Mark! How are you doing?",
        type: "sent",
        date: new Date().getTime() - 2 * 60 * 60 * 1000,
      },
      {
        text: "Huge Facebook update is in the progress!",
        type: "received",
        date: new Date().getTime() - 1 * 60 * 60 * 1000,
      },
      {
        text: "Congrats! 🎉",
        type: "sent",
        date: new Date().getTime() - 0.5 * 60 * 60 * 1000,
      },
    ],
  },
  {
    userId: 8,
    messages: [
      {
        text: "Hey there, were you able to get our all new Xbox Series X(S)?",
        type: "received",
        date: new Date().getTime() - 1 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  {
    userId: 2,
    messages: [
      {
        text: "Hey Tim! Can you recommend something for iOS app development?",
        type: "sent",
        date: new Date().getTime() - 3.5 * 60 * 60 * 1000,
      },
      {
        text: "I think you should try Framework7, i like it very much! 😉",
        type: "received",
        date: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  {
    userId: 3,
    messages: [
      {
        text: "Can you buy bread on your way home?",
        type: "received",
        date: new Date().getTime() - 4.5 * 60 * 60 * 1000,
      },
      {
        text: "Sure",
        type: "sent",
        date: new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
      },
    ],
  },
];

Array.from({ length: 5000 }).map(function (_, i) {
  chats[0].messages.push({
    text: `Congrats! 🎉`,
    type: i % 3 === 0 ? "sent" : "received",
    date: new Date().getTime() - 0.5 * 60 * 60 * 1000,
  });
});

export default chats;
