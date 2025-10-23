"use client";

import { useEffect, useState } from "react";
import { SkillMatrix } from "@/lib/schema";

export default function Page() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<SkillMatrix | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResult(null);
  }, [jd]);

  const analyze = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='max-w-3xl mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-4'>AI JD → Skill Matrix</h1>

      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        className='w-full border rounded p-3 min-h-[180px] focus:outline-none'
        placeholder='Paste a job description...'
      />

      <button
        onClick={analyze}
        disabled={jd === "" || loading}
        className='mt-3 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer'
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className='text-red-600 mt-2'>{error}</p>}

      {result && (
        <div className='mt-6'>
          <p className='mb-2 font-medium text-white'>Summary:</p>
          <p className='text-white mb-4'>{result.summary}</p>
          <pre className='bg-gray-100 p-3 rounded text-sm overflow-x-auto text-black'>{JSON.stringify(result, null, 2)}</pre>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
            className='mt-2 px-3 py-1 bg-gray-800 text-white rounded cursor-pointer'
          >
            Copy JSON
          </button>
        </div>
      )}
    </main>
  );
}
