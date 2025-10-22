document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("surveyForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    let pd = 0, hd = 0;

    for (const [_, value] of data.entries()) {
      if (value === "PD") pd++;
      else hd++;
    }

    const result = pd > hd ? "PD" : "HD";
    localStorage.setItem("dialysisResult", result);
    window.location.href = "result.html";
  });
});
