document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("surveyForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    let totalScore = 0;
    let count = 0;

    for (const [_, value] of data.entries()) {
      totalScore += parseInt(value);
      count++;
    }

    const avg = totalScore / count;
    const result = avg >= 3.5 ? "PD" : "HD"; // 3.5 이상이면 복막투석 선호

    localStorage.setItem("dialysisResult", result);
    window.location.href = "result.html";
  });
});
