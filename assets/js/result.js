// 군집별 데이터 
const clusterMessages = {
  1: {
    name: "신중한 조율가<br>(균형추구형)",
    direction1: "“균형 잡힌 계획형”",
    direction2:
      "환자와 의료진이 함께 계획을 세워가는 것이 잘 맞습니다.<br>부담이 적고 일상에 영향을 덜 주는 방식의 치료가 적합해요.<br>의사와의 충분한 상의로 투석방법을 선택하세요."
  },
  2: {
    name: "실용적 현실주의자<br>(자기주도형)",
    direction1: "“책임감 있는 자기주도형”",
    direction2:
      "결정은 스스로! 본인의 건강에 적극적으로 참여하고,<br>자율성을 중시하는 당신에게 복막투석처럼<br> 스케줄 조절이 가능한 방법이 잘 맞을 수 있어요.<br>주체적으로 선택하세요!"
  },
  3: {
    name: "불확실성 회피자<br>(의사의존형)",
    direction1: "“감각 민감형”",
    direction2:
      "낯선 상황이나 불편한 환경에 민감합니다.<br>입원이나 주사 등이 불편하다면, 자택 투석처럼 환경을<br> 통제할 수 있는 치료를 고려해볼 수 있어요.<br>의료진과의 긴밀한 상의가 중요합니다."
  },
  4: {
    name: "협력적 협상가<br>(정보요구형)",
    direction1: "“주변 배려형”",
    direction2:
      "본인의 치료보다 가족과 주변 사람을 먼저 생각하는 분입니다.<br>치료 선택 시 정서적 지지가 중요하며,<br>의사와의 신뢰 관계가 우선시돼요.<br> 복잡한 정보보다는 안정감을 주는 소통이 필요합니다."
  },
  5: {
    name: "회복지향 실행자<br>(적극참여형)",
    direction1: "“신중한 균형형”",
    direction2:
      "혼자 결정하기보다 의료진과 협업을 통해 치료계획을 세우는 것이 가장 잘 맞습니다.<br>너무 복잡한 설명보다는 핵심 위주로,<br>장단점을 명확히 알려주는 방식이 좋습니다."
  },
  6: {
    name: "자기관리 실천가<br>(자율실천형)",
    direction1: "“유연한 실천형”",
    direction2:
      "변화에 유연하고, 환자교육에 적극적입니다.<br>본인의 질병을 잘 이해하며,<br>다양한 가능성을 열어두는 실천가입니다.<br>다양한 치료옵션에 대해 스스로 탐색하고 결정할 준비가 되어 있습니다."
  }
};

// 결과 반영 
document.addEventListener("DOMContentLoaded", () => {

  const clusterId = parseInt(localStorage.getItem("clusterId")) || 1;

  const cluster = clusterMessages[clusterId];

  document.querySelector(".clusterName").innerHTML = cluster.name;
  document.querySelector(".messageDirection1").innerHTML = cluster.direction1;
  document.querySelector(".messageDirection2").innerHTML = cluster.direction2;

  const result = localStorage.getItem("dialysisResult");
  document.getElementById("resultBox").innerHTML =
    result === "PD"
      ? '<h2 style="color:#673AB7;">복막투석 선호자</h2>'
      : '<h2 style="color:#1976D2;">혈액투석 선호자</h2>';
});
