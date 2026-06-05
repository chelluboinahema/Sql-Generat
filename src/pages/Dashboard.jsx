import { useState, useEffect, useRef } from "react";

import Sidebar from "../components/Sidebar";

import Message from "../components/Message";

import ChatInput from "../components/ChatInput";

import Topbar from "../components/Topbar";

import { generateSql, explainSql, optimizeSql } from "../api/sqlApi";

import { useNotification } from "../context/NotificationContext";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { showNotification } = useNotification();

  const send = async () => {
    if (!input.trim()) return;

    try {
      const res = await generateSql(input);

      console.log(res);

      setMessages((prev) => [
        ...prev,
        {
          question: input,
          answer:
            res.generatedSql ||
            res.output ||
            res.message ||
            res.sql ||
            JSON.stringify(res),
        },
      ]);

      setInput("");
    } catch (err) {
      console.log(err);
      showNotification("Failed to generate SQL", "error");
    }
  };

  const extractSqlQueryFromResponse = (text) => {
    if (!text) return "";

    const raw = typeof text === "string" ? text : JSON.stringify(text);
    const codeBlockMatch = raw.match(/```(?:sql)?\s*([\s\S]*?)```/i);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    const queryMatch = raw.match(/((?:SELECT|WITH|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)[\s\S]*?;)/i);
    return queryMatch ? queryMatch[1].trim() : raw.trim();
  };

  const getActionPrompt = () => {
    const trimmedInput = input.trim();
    const lastAnswer = messages.length ? messages[messages.length - 1].answer : null;

    if (trimmedInput) {
      return { prompt: trimmedInput, previousResponse: lastAnswer };
    }

    if (lastAnswer) {
      return {
        prompt: extractSqlQueryFromResponse(lastAnswer),
        previousResponse: null,
      };
    }

    return { prompt: "", previousResponse: null };
  };

  const explain = async () => {
    const trimmedInput = input.trim();
    const { prompt, previousResponse } = getActionPrompt();
    if (!prompt) {
      showNotification("Please enter a question or generate SQL first.", "warning");
      return;
    }

    try {
      const res = await explainSql(prompt, previousResponse);
      const explanation = res.response || res.output || res.message || JSON.stringify(res);
      showNotification("Explanation complete", "success");

      setMessages((prev) => [
        ...prev,
        {
          question: trimmedInput ? `Explain: ${trimmedInput}` : "Explain previous response",
          answer: explanation,
        },
      ]);
    } catch (err) {
      console.error(err);
      const message = err.response?.status === 403 ? "403 Access Denied" : "Failed to explain SQL";
      showNotification(message, "error");
    }
  };

  const optimize = async () => {
    const trimmedInput = input.trim();
    const { prompt, previousResponse } = getActionPrompt();
    if (!prompt) {
      showNotification("Please enter a question or generate SQL first.", "warning");
      return;
    }

    try {
      const res = await optimizeSql(prompt, previousResponse);
      const optimization = res.response || res.output || res.message || JSON.stringify(res);
      showNotification("Optimization complete", "success");

      setMessages((prev) => [
        ...prev,
        {
          question: trimmedInput ? `Optimize: ${trimmedInput}` : "Optimize previous response",
          answer: optimization,
        },
      ]);
    } catch (err) {
      console.error(err);
      const message = err.response?.status === 403 ? "403 Access Denied" : "Failed to optimize SQL";
      showNotification(message, "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark">
      <Sidebar />

      <div className="flex-1 p-6 md:p-10">
        <Topbar />

        <div className="pb-32">
          {messages.map((m, index) => (
            <Message key={index} question={m.question} answer={m.answer} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls moved to each message */}

        <ChatInput
          input={input}
          setInput={setInput}
          send={send}
          explain={explain}
          optimize={optimize}
        />
      </div>
    </div>
  );
}
