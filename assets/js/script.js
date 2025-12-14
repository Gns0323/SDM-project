document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".survey-page[data-page]");
  let currentPage = 0;

  function showPage(index) {
    pages.forEach((page, i) => {
      page.style.display = i === index ? "block" : "none";
    });
  }

  document.querySelectorAll(".next-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const form = document.getElementById("surveyForm");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (currentPage < pages.length - 1) {
        currentPage++;
        showPage(currentPage);
      }
    });
  });

  document.querySelectorAll(".prev-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
      }
    });
  });

  showPage(0);

  const form = document.getElementById("surveyForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const answers = [];
    let totalScore = 0;
    let count = 0;

    for (const [, value] of data.entries()) {
      const v = parseFloat(value);
      totalScore += v;
      answers.push(v);
      count++;
    }

    const avg = totalScore / count;
    const result = avg >= 3.5 ? "PD" : "HD";
    localStorage.setItem("dialysisResult", result);

    const clusterProfiles = {
      1: [4.70, 4.67, 4.59, 4.58, 4.48, 4.26, 3.39, 3.80, 2.88, 3.92, 1.80, 1.22, 2.33, 2.70, 3.39, 2.39, 2.68, 2.36],
      2: [4.53, 4.60, 4.39, 4.51, 4.43, 4.08, 3.58, 3.72, 2.87, 3.98, 2.27, 4.21, 2.46, 2.76, 3.31, 2.69, 2.49, 2.37],
      3: [3.97, 3.96, 3.65, 3.92, 3.61, 3.84, 2.77, 3.16, 2.57, 3.15, 1.97, 1.42, 3.77, 3.20, 4.16, 2.87, 2.96, 3.44],
      4: [4.91, 4.91, 4.81, 4.89, 4.81, 4.89, 3.34, 3.76, 2.80, 4.06, 2.14, 1.17, 4.34, 3.59, 4.70, 2.97, 3.18, 3.30],
      5: [4.87, 4.90, 4.89, 4.81, 4.89, 4.87, 3.21, 3.50, 2.89, 3.92, 2.00, 4.23, 4.35, 3.08, 4.46, 2.89, 2.69, 2.51],
      6: [4.91, 4.90, 4.81, 4.91, 4.87, 4.71, 4.09, 4.26, 3.33, 4.38, 3.48, 4.51, 4.13, 3.13, 4.28, 3.70, 3.88, 3.16],
    };

    function normalize(arr) {
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      return arr.map(v => (v - min) / (max - min || 1));
    }

    const userNorm = normalize(answers);
    const distances = {};

    for (const [cluster, profile] of Object.entries(clusterProfiles)) {
      const clusterNorm = normalize(profile);
      const distance = Math.sqrt(
        clusterNorm.reduce((sum, val, idx) =>
          sum + Math.pow((userNorm[idx] || 0) - val, 2), 0
        )
      );
      distances[cluster] = distance;
    }

    const closestCluster = Object.entries(distances).reduce((a, b) =>
      a[1] < b[1] ? a : b
    )[0];

    localStorage.setItem("clusterId", closestCluster);
    window.location.href = "result.html";
  });
});
