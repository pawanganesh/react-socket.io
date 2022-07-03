import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";

function App() {
  const [socketId, setSocketId] = useState("");
  const [roomId, setRoomId] = useState("");
  const workspaceIdRef = useRef(null);
  const nameRef = useRef(null);
  const roomTypeRef = useRef(null);
  const roomUserRef = useRef(null);

  const access_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZjEwNDcwMy04M2NhLTRiMzItODMzNS01N2M5ZGU1MzUxYzMiLCJpYXQiOjE2NTY4Mzg5MDAsImV4cCI6MTY1NzQ0MzcwMH0.lxteir-YWWyO-QMw6sa9VJZtY5KFugOwUN8vsfh24rc";

  const [socket, setSocket] = useState(() =>
    // io("https://stagging.lancemeup.com", {
    io("http://127.0.0.1:4200", {
      auth: {
        token: `${access_token}`,
      },
      extraHeaders: {
        Authorization: `${access_token}`,
      },
      transports: ["websocket"],
      autoConnect: false,
    })
  );

  socket.on("connect", () => {
    if (socket.id) {
      setSocketId(socket.id);
    }
    console.log(socket.id);
    socket.on("message", (data) => console.log(data));
    socket.on("no-permission", (data) => console.log(data));
    socket.on("messages", (data) => console.log(data));
    socket.on("room-users", (data) => console.log(data));
    socket.on("room", (data) => console.log(data));
    socket.on("create-room-error", (data) => console.log(data));
    socket.on("notifications", (data) => console.log(data));
    socket.on("notification", (data) => console.log(data));
  });

  useEffect(() => {
    socket.connect();
  }, []);

  const roomIdChangeHandler = (event) => {
    event.preventDefault();
    setRoomId(event.target.value);
  };

  const sendMessage = () => {
    socket.emit("send-message", {
      text: "Hey!",
      roomId,
    });
  };

  const joinRoom = () => {
    socket.emit("join-room", {
      roomId,
      page: 1,
      limit: 10,
    });
  };

  const onSubmitCreateRoom = (event) => {
    event.preventDefault();

    const emails = roomUserRef.current.value.split(",");
    const name = nameRef.current.value;
    const workspaceId = workspaceIdRef.current.value;
    const roomType = roomTypeRef.current.value;
    console.log(emails, name, workspaceId, roomType);

    socket.emit("create-room", {
      name,
      workspaceId,
      roomType,
      roomUser: emails,
    });
  };

  return (
    <div>
      <p>{socketId}</p>
      <button onClick={sendMessage}>Send Message</button>

      <hr />

      <label htmlFor="roomId">Room Id</label>
      <input type="number" name="roomID" onChange={roomIdChangeHandler} />
      <button onClick={joinRoom}>Join Room</button>

      <hr />

      <form onSubmit={onSubmitCreateRoom}>
        <label htmlFor="roomName">Room Name</label>
        <input type="text" name="roomName" id="roomName" ref={nameRef} />

        <label htmlFor="workspaceId">Workspace Id</label>
        <input
          type="text"
          name="workspaceId"
          id="workspaceId"
          ref={workspaceIdRef}
        />

        <label htmlFor="roomType">Room Type</label>
        <select ref={roomTypeRef}>
          <option value={"PRIVATE"}>Private</option>
          <option value={"GROUP"}>Group</option>
        </select>

        <label htmlFor="roomUser">Room User Emails</label>
        <input type="text" name="roomUser" id="roomUser" ref={roomUserRef} />

        <button type="submit">Create Room</button>
      </form>
      <hr />

      <button onClick={() => socket.emit("get-notification", {})}>
        Get all notifications
      </button>
    </div>
  );
}

export default App;
