document.addEventListener("DOMContentLoaded", () => {
  const KEY_INFO = "sdm_info_v1";

  const form = document.getElementById("infoForm");
  const phone = document.getElementById("phone");
  const patientStatus = document.getElementById("patientStatus");
  const relation = document.getElementById("relation");
  const consent = document.getElementById("consent");

  const btnSubmit = document.getElementById("btnSubmit");
  const btnPrev = document.getElementById("btnPrev");

  const openConsent = document.getElementById("openConsent");
  const consentLabel = openConsent.querySelector(".consent-label");
  const consentPanel = document.getElementById("consentPanel");
  const closeConsent = document.getElementById("closeConsent");
  const agreeCheck = document.getElementById("agreeCheck");
  const applyConsent = document.getElementById("applyConsent");

  function saveInfo() {
    const payload = {
      phone: phone.value.trim(),
      patientStatus: patientStatus.value,
      relation: relation.value,
      consent: consent.value
    };
    localStorage.setItem(KEY_INFO, JSON.stringify(payload));
  }

  function loadInfo() {
    try {
      const raw = localStorage.getItem(KEY_INFO);
      if (!raw) return;
      const v = JSON.parse(raw);

      phone.value = v.phone || "";
      patientStatus.value = v.patientStatus || "";
      relation.value = v.relation || "";
      consent.value = v.consent || "";

      setConsentUI(consent.value === "agree");
    } catch (e) {}
  }

  function setConsentUI(agreed) {
    if (agreed) {
      consent.value = "agree";
      consentLabel.textContent = "동의 완료";
      consentLabel.style.color = "#111";
    } else {
      consent.value = "";
      consentLabel.textContent = "선택해 주세요";
      consentLabel.style.color = "#777";
    }
  }

  function isValid() {
    const digits = phone.value.replace(/\D/g, "");
    return (
      digits.length >= 10 &&
      patientStatus.value !== "" &&
      relation.value !== "" &&
      consent.value === "agree"
    );
  }

  function renderSubmitState() {
    btnSubmit.classList.toggle("active", isValid());
  }

  [phone, patientStatus, relation].forEach((el) => {
    el.addEventListener("input", () => {
      saveInfo();
      renderSubmitState();
    });
    el.addEventListener("change", () => {
      saveInfo();
      renderSubmitState();
    });
  });

  function openPanel() {
    consentPanel.hidden = false;
    openConsent.setAttribute("aria-expanded", "true");
    agreeCheck.checked = consent.value === "agree";
    applyConsent.disabled = !agreeCheck.checked;
  }

  function closePanel() {
    consentPanel.hidden = true;
    openConsent.setAttribute("aria-expanded", "false");
  }

  openConsent.addEventListener("click", () => {
    consentPanel.hidden ? openPanel() : closePanel();
  });

  closeConsent.addEventListener("click", closePanel);

  agreeCheck.addEventListener("change", () => {
    applyConsent.disabled = !agreeCheck.checked;
  });

  applyConsent.addEventListener("click", () => {
    setConsentUI(true);
    closePanel();
    saveInfo();
    renderSubmitState();
  });

  btnPrev.addEventListener("click", () => {
    window.location.href = "survey.html";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderSubmitState();
    if (!btnSubmit.classList.contains("active")) return;
    window.location.href = "result.html";
  });

  /* select 화살표 회전 처리 */
  document.querySelectorAll(".info-select select").forEach((select) => {
    const wrapper = select.closest(".info-select");
    if (!wrapper) return;

    select.addEventListener("mousedown", () => {
      wrapper.classList.add("open");
    });

    select.addEventListener("keydown", (e) => {
      if (
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp"
      ) {
        wrapper.classList.add("open");
      }
    });

    select.addEventListener("blur", () => {
      wrapper.classList.remove("open");
    });

    select.addEventListener("change", () => {
      wrapper.classList.remove("open");
    });
  });

  loadInfo();
  renderSubmitState();
});
