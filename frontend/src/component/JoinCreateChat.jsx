import { Link, useNavigate } from "react-router";
import speechBubble from "../assets/speech-bubble.png";
import ThemeBtn from "./ThemeBtn";
import toast from "react-hot-toast";
import {
  createRoomApi,
  getRoomMessages,
  joinRoomApi,
} from "../services/Service";
import {
  setdetails,
  setMessages,
  setConnection,
  setCurrentUser,
} from "../store/slice/ChatRoomSlice";
import { useDispatch, useSelector } from "react-redux";
function JoinCreateChat() {
  const navigate = useNavigate();
  const details = useSelector((state) => state.chatroom.details);
  const dispatch = useDispatch();

  const handleform = (e) => {
    dispatch(setdetails({ ...details, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (details.username.trim() != "" && details.roomId.trim() != "") {
      return true;
    }
    toast.error("invalid inputs");
    return false;
  };

  const getMessages = async (roomId) => {
    const res = await getRoomMessages(roomId);
    dispatch(setMessages(res));
  };

  const joinRoom = async () => {
    if (validateForm()) {
      try {
        const res = await joinRoomApi(details.roomId);
        console.log(res);
        await getMessages(details.roomId);
        dispatch(setCurrentUser(details.username))
        dispatch(setConnection(true));
        toast.success("join..");
        navigate("/chat");
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data);
        }
      }
    }
  };

  const createRoom = async () => {
    if (validateForm()) {
      try {
        const res = await createRoomApi(details);
        console.warn(res);
        await getMessages(details.roomId);

        dispatch(setCurrentUser(details.username));
        dispatch(setConnection(true));
        toast.success("Room created");
        navigate("/chat");
      } catch (error) {
        if (error.response?.status == 400) {
          toast.error(error.response.data);
        }
      }
    }
  };

  return (
    <>
      <div className="relative">
        <div className="absolute right-3 top-3 text-end bg-gray-100 dark:bg-slate-900 p-2">
          <ThemeBtn />
        </div>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
          <div className=" p-8 bg-green-400 m-10 dark:bg-slate-700  shadow-lg shadow-gray-950 dark:shadow-gray-400 rounded-2xl">
            <div className="flex justify-center mb-5">
              <img src={speechBubble} alt="" className="w-[80px]" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              Join Room/Create room ..
            </h1>
            <div className="">
              <label htmlFor="name" className="w-full m-1 font-semibold">
                Your name
              </label>
              <input
                type="text"
                id="name"
                name="username"
                onChange={handleform}
                value={details.username}
                placeholder="Enter your name"
                className="w-full  border-sky-400 m-1 px-3 bg-white py-1 rounded focus:ring-2 focus:ring-sky-400 mb-2  focus:outline-none dark:text-gray-700"
              />
              <label htmlFor="room" className="w-full m-1 font-semibold">
                Room Id
              </label>
              <input
                type="text"
                id="room"
                name="roomId"
                value={details.roomId}
                onChange={handleform}
                placeholder="Enter room name"
                className="w-full  border-sky-400 m-1 px-3 bg-white py-1 rounded focus:ring-2 focus:ring-sky-400 mb-2  focus:outline-none dark:text-gray-700"
              />
              <div className="flex justify-between mt-2">
                <div
                  onClick={joinRoom}
                  className="py-1 px-3 bg-green-900 rounded cursor-pointer text-white shadow-md shadow-black"
                >
                  Join Room
                </div>
                <div
                  onClick={createRoom}
                  className="py-1 px-3 bg-sky-500 rounded cursor-pointer text-white shadow-md shadow-black "
                >
                  Create Room
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JoinCreateChat;
