import React, { useState } from "react";
import axios from "axios";

const StudentChat = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post(
        "https://convocationportal123-6.onrender.com/api/gemini/generate",
        {
          prompt,
        }
      );

      setResponse(res.data.result);
    } catch (error) {
      setResponse("Sorry, something went wrong. Please try again.");
      console.error(error);
    }

    setLoading(false);
    setPrompt("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Ask Convo AI</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Ask something about convocation..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border p-3 rounded focus:outline-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {response && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow-sm">
          <p className="text-gray-800 whitespace-pre-wrap">
            <strong>AI:</strong> {response}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentChat;
