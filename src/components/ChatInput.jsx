import SendIcon from "@mui/icons-material/Send";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useNotification } from "../context/NotificationContext";

export default function ChatInput({ input, setInput, send, explain, optimize }) {
  const { showNotification } = useNotification();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input || !input.trim()) {
        showNotification("Please enter a message", "warning");
        return;
      }
      send();
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 w-[90%] sm:w-[85%] md:w-[70%] lg:w-[55%]">
      <div className="bg-card rounded-full p-3 flex flex-col sm:flex-row items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SQL question..."
          className="flex-1 bg-transparent outline-none px-5"
        />

        <button
          onClick={() => explain && explain()}
          className="bg-yellow-500 rounded-full p-3 text-sm hidden sm:inline-flex items-center gap-2"
          title="Explain current input"
          type="button"
        >
          <LightbulbIcon fontSize="small" />
          Explain
        </button>

        <button
          onClick={() => optimize && optimize()}
          className="bg-green-600 rounded-full p-3 text-sm hidden sm:inline-flex items-center gap-2"
          title="Optimize current input"
          type="button"
        >
          <AutoFixHighIcon fontSize="small" />
          Optimize
        </button>

        <button
          onClick={() => {
            if (!input || !input.trim()) {
              showNotification("Please enter a message", "warning");
              return;
            }

            send();
          }}
          className="bg-gradient-to-r from-primary to-accent rounded-full p-4 flex items-center justify-center shadow-lg"
        >
          <SendIcon className="text-white" />
        </button>
      </div>
    </div>
  );
}
