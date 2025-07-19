import { useEffect, useRef, useState } from "react";

import { IoSend } from "react-icons/io5";
function App() {
  const wsRef = useRef(null);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState(["hi there", "hello"]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "123",
          },
        })
      );
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="h-[75vh] w-[75vw] bg-red-300 flex flex-col  justify-between">
          <div>
            {messages.map((messages) => (
              <div className="bg-red-100 p-4 rounded-3xl my-2">{messages}</div>
            ))}
          </div>
          <div className="flex justify-between bg-red-100">
            <input
              className="w-[55vw] rounded-3xl p-4"
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
            />
            <button
              className="p-4 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white "
              onClick={() => {
                wsRef.current.send(
                  JSON.stringify({
                    type: "message",
                    payload: {
                      message: `${inputVal}`,
                    },
                  })
                );
              }}
            >
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
