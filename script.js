let expression = "";

document.querySelectorAll(".buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (["ENTER", "clear", "del"].includes(value)) return;

    if (value === "±") {
      if (expression) {
        if (expression.startsWith("-")) {
          expression = expression.slice(1);
        } else {
          expression = "-" + expression;
        }
        updateDisplay();
      }
      return;
    }

    if (value === "√") {
      expression += "Math.sqrt(";
    } else if (value === "ans") {
      expression += document.getElementById("result").textContent;
    } else {
      expression += value;
    }
    updateDisplay();
  });
});

function updateDisplay() {
  document.getElementById("expression").textContent = expression;
}

function clearDisplay() {
  expression = "";
  document.getElementById("expression").textContent = "";
  document.getElementById("result").textContent = "0";
}

function delChar() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    const result = eval(expression.replace("%", "/100"));
    document.getElementById("result").textContent = result;
    expression = "";
    updateDisplay();
  } catch {
    document.getElementById("result").textContent = "Error";
  }
}
