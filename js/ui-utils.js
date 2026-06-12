const NUMERIC_INPUT_IDS = [
  "cfgComm",
  "cfgMyProfit",
  "amSales",
  "amPayout",
  "pmSales",
  "pmPayout",
];

const NON_NEGATIVE_DECIMAL = /^\d+(\.\d+)?$/;
const PARTIAL_DECIMAL = /^\d*\.?\d*$/;

let activeLoadingCount = 0;

function showToast(message, type = "info", duration = 4500) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");

  const icons = { success: "✓", error: "✕", warning: "!", info: "ℹ" };
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" type="button" aria-label="Close">&times;</button>
  `;

  const remove = () => {
    toast.classList.add("toast-exit");
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector(".toast-close").onclick = remove;
  container.appendChild(toast);
  setTimeout(remove, duration);
}

function setGlobalLoading(isLoading, message) {
  const overlay = document.getElementById("globalLoadingOverlay");
  if (!overlay) return;

  if (isLoading) {
    activeLoadingCount++;
    overlay.querySelector(".loading-text").textContent =
      message || (typeof t === "function" ? t("loading") : "Loading...");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
  } else {
    activeLoadingCount = Math.max(0, activeLoadingCount - 1);
    if (activeLoadingCount === 0) {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
    }
  }
}

function setButtonLoading(buttonId, isLoading, loadingTextKey = "loading") {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  if (isLoading) {
    if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.innerHTML = `<span class="btn-spinner"></span> ${typeof t === "function" ? t(loadingTextKey) : "..."}`;
  } else {
    btn.disabled = false;
    btn.classList.remove("is-loading");
    if (btn.hasAttribute("data-i18n") && typeof t === "function") {
      btn.textContent = t(btn.getAttribute("data-i18n"));
    } else if (btn.dataset.originalText) {
      btn.textContent = btn.dataset.originalText;
    }
    delete btn.dataset.originalText;
  }
}

function sanitizeNumericValue(raw) {
  let value = String(raw).replace(/[^\d.]/g, "");
  const parts = value.split(".");
  if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
  if (value.startsWith(".")) value = "0" + value;
  return value;
}

function isValidNonNegativeNumber(value, allowEmpty = true) {
  const trimmed = String(value).trim();
  if (trimmed === "") return allowEmpty;
  if (!NON_NEGATIVE_DECIMAL.test(trimmed)) return false;
  return parseFloat(trimmed) >= 0;
}

function markInputError(inputId, hasError) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.classList.toggle("input-error", hasError);
}

function clearInputErrors() {
  NUMERIC_INPUT_IDS.forEach((id) => markInputError(id, false));
}

function handleNumericKeydown(e) {
  const blocked = ["-", "+", "e", "E"];
  if (blocked.includes(e.key)) e.preventDefault();
}

function handleNumericInput(e) {
  const el = e.target;
  const sanitized = sanitizeNumericValue(el.value);
  if (el.value !== sanitized) el.value = sanitized;
  markInputError(el.id, false);
}

function handleNumericPaste(e) {
  e.preventDefault();
  const pasted = (e.clipboardData || window.clipboardData).getData("text");
  const sanitized = sanitizeNumericValue(pasted);
  if (PARTIAL_DECIMAL.test(sanitized)) {
    e.target.value = sanitized;
    markInputError(e.target.id, false);
  }
}

function setupNumericInputs() {
  NUMERIC_INPUT_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("min", "0");
    el.setAttribute("inputmode", "decimal");
    el.addEventListener("keydown", handleNumericKeydown);
    el.addEventListener("input", handleNumericInput);
    el.addEventListener("paste", handleNumericPaste);
    el.addEventListener("blur", () => {
      const val = el.value.trim();
      if (val && !isValidNonNegativeNumber(val, false)) {
        el.value = "";
        markInputError(id, true);
        showToast(t("toastInvalidInput"), "warning");
      }
    });
  });
}

function validateCalculationForm() {
  clearInputErrors();

  const dateVal = document.getElementById("calcTargetDate")?.value;
  if (!dateVal) {
    showToast(t("toastInvalidDate"), "warning");
    return null;
  }

  const commRaw = document.getElementById("cfgComm").value.trim();
  const myProfitRaw = document.getElementById("cfgMyProfit").value.trim();

  if (!commRaw || !isValidNonNegativeNumber(commRaw, false)) {
    markInputError("cfgComm", true);
    showToast(t("toastInvalidCommission"), "warning");
    return null;
  }
  const commPercent = parseFloat(commRaw);
  if (commPercent > 100) {
    markInputError("cfgComm", true);
    showToast(t("toastInvalidCommission"), "warning");
    return null;
  }

  if (!myProfitRaw || !isValidNonNegativeNumber(myProfitRaw, false)) {
    markInputError("cfgMyProfit", true);
    showToast(t("toastInvalidMyProfit"), "warning");
    return null;
  }
  const myProfitPercent = parseFloat(myProfitRaw);
  if (myProfitPercent > 100) {
    markInputError("cfgMyProfit", true);
    showToast(t("toastInvalidMyProfit"), "warning");
    return null;
  }

  const fields = [
    { id: "amSales", raw: document.getElementById("amSales").value.trim(), label: t("salesLabel") + " (AM)" },
    { id: "amPayout", raw: document.getElementById("amPayout").value.trim(), label: t("payoutLabel") + " (AM)" },
    { id: "pmSales", raw: document.getElementById("pmSales").value.trim(), label: t("salesLabel") + " (PM)" },
    { id: "pmPayout", raw: document.getElementById("pmPayout").value.trim(), label: t("payoutLabel") + " (PM)" },
  ];

  let hasAnyValue = false;
  for (const field of fields) {
    if (field.raw === "") continue;
    if (!isValidNonNegativeNumber(field.raw, false)) {
      markInputError(field.id, true);
      showToast(t("toastInvalidField", { field: field.label }), "warning");
      return null;
    }
    hasAnyValue = true;
  }

  if (!hasAnyValue) {
    showToast(t("toastFillData"), "warning");
    return null;
  }

  return {
    commPercent,
    myProfitPercent,
    amSales: parseFloat(fields[0].raw) || 0,
    amPayout: parseFloat(fields[1].raw) || 0,
    pmSales: parseFloat(fields[2].raw) || 0,
    pmPayout: parseFloat(fields[3].raw) || 0,
    chosenDateStr: dateVal,
  };
}
