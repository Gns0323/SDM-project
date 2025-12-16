document.addEventListener("DOMContentLoaded", () => {
  const pages = Array.from(document.querySelectorAll(".survey-page[data-page]"));
  const form = document.getElementById("surveyForm");
  if (!form || pages.length === 0) return;

  let currentPage = 0;

  // 특정 페이지가 완료(모든 라디오 그룹 체크)되었는지
  function isPageCompleted(pageEl) {
    const radios = Array.from(pageEl.querySelectorAll('input[type="radio"]'));
    if (radios.length === 0) return true;

    const names = [...new Set(radios.map(r => r.name).filter(Boolean))];
    if (names.length === 0) return true;

    return names.every(name =>
      pageEl.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`)
    );
  }

  // 해당 페이지의 next / submit 버튼 상태 업데이트
  function updateButtonsForPage(pageEl) {
    const completed = isPageCompleted(pageEl);

    const nextBtn = pageEl.querySelector(".next-btn");
    if (nextBtn) nextBtn.classList.toggle("active", completed);

    const submitBtn = pageEl.querySelector(".submit");
    if (submitBtn) submitBtn.classList.toggle("active", completed);
  }

  // 점 표시(1페이지에만 있어도 OK)
  function updateDots() {
  const current = pages[currentPage];
  if (!current) return;

  // 현재 페이지 안에 있는 dot만 갱신
  const dots = current.querySelectorAll(".page-indicator .dot");
  dots.forEach((dot) => dot.classList.remove("active"));

  // dot 개수는 4개로 두고, 현재 페이지 인덱스에 해당하는 dot만 활성화
  // (페이지 1=0, 2=1, 3=2, 4=3)
  if (dots[currentPage]) dots[currentPage].classList.add("active");
}


  function showPage(index) {
    pages.forEach((page, i) => {
      page.style.display = i === index ? "block" : "none";
    });
    currentPage = index;
    updateButtonsForPage(pages[currentPage]);
    updateDots();
  }

  // 라디오 변경 시: "그 라디오가 속한 페이지"만 갱신 (이게 핵심)
  form.addEventListener("change", (e) => {
    if (!e.target.matches('input[type="radio"]')) return;
    const pageEl = e.target.closest(".survey-page[data-page]");
    if (!pageEl) return;
    updateButtonsForPage(pageEl);
  });

  // 다음 버튼 클릭
  document.querySelectorAll(".next-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const pageEl = btn.closest(".survey-page[data-page]");
      if (!pageEl) return;

      if (!isPageCompleted(pageEl)) {
        alert("모든 문항에 답변을 선택해주세요.");
        return;
      }

      if (currentPage < pages.length - 1) {
        showPage(currentPage + 1);
      }
    });
  });

  // 이전 버튼 클릭
  document.querySelectorAll(".prev-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 0) showPage(currentPage - 1);
    });
  });

  // 페이지 결과보기 버튼 클릭 → submit 실행
  document.querySelectorAll(".submit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const pageEl = btn.closest(".survey-page[data-page]");
      if (!pageEl) return;

      if (!isPageCompleted(pageEl)) {
        alert("모든 문항에 답변을 선택해주세요.");
        return;
      }

      // submit 이벤트로 넘기기
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    });
  });

  // ===== 기존 submit 로직 그대로 =====
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

  // 초기 페이지 표시
  showPage(0);
});
