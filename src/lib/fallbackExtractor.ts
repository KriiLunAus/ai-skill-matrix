export function fallbackExtractor(jd: string) {
  const text = jd.toLowerCase();

  const find = (patterns: string[]) => patterns.filter((p) => text.includes(p));

  const frontend = find(["react", "vue", "next.js", "typescript"]);
  const backend = find(["python", "django", "fastapi", "node", "express"]);
  const devops = find(["docker", "aws", "kubernetes", "ci/cd"]);
  const web3 = find(["solidity", "wagmi", "viem", "evm", "staking"]);
  const other = find(["jira", "scrum", "git"]);

  const seniority = /junior/.test(text)
    ? "junior"
    : /senior|expert/.test(text)
    ? "senior"
    : /lead/.test(text)
    ? "lead"
    : /mid|middle/.test(text)
    ? "mid"
    : "unknown";

  const salaryMatch = jd.match(/\$?(\d{2,3})[kK]?[\s-U+2013to]+(\d{2,3})[kK]?/);
  const salary = salaryMatch ? { currency: "USD", min: +salaryMatch[1] * 1000, max: +salaryMatch[2] * 1000 } : undefined;

  const mustHave = frontend.concat(backend);
  const niceToHave = [...devops, ...web3, ...other];

  const title = jd.split("\n")[0].slice(0, 80);
  const summary = jd.slice(0, 180).replace(/\n/g, " ") + "...";

  return {
    title,
    seniority,
    skills: { frontend, backend, devops, web3, other },
    mustHave,
    niceToHave,
    salary,
    summary,
  };
}
