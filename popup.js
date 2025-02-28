document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.getElementById("add-color");
  const colorBarContainer = document.getElementById("color-bar-container");

  function addColorBar(number = 1) {
    for (let i = 0; i < number; i++) {
      const newColorBar = document.createElement("div");
      newColorBar.className = "color-bar d-flex justify-content-between";
      newColorBar.innerHTML = `
          <input type="text" class="input-color-hex border-3 rounded-border" placeholder="# Color Hex" />
          <input class="color-picker border-3 cursor-pointer rounded-border" type="color" />
          <button class="remove-button border-3 cursor-pointer rounded-border">❌</button>
        `;
      colorBarContainer.appendChild(newColorBar);

      // Add event listener to the remove button
      const removeButton = newColorBar.querySelector(".remove-button");
      removeButton.addEventListener("click", function () {
        if (colorBarContainer.childElementCount <= 2) {
          alert("At least 2 colors are required!");
        } else {
          colorBarContainer.removeChild(newColorBar);
        }
      });

      // Add event listener to the color picker
      const colorPicker = newColorBar.querySelector(".color-picker");
      const colorHexInput = newColorBar.querySelector(".input-color-hex");
      colorPicker.addEventListener("input", function () {
        colorHexInput.value = colorPicker.value;
      });
    }
  }

  addColorBar(2);

  // Add event listener for the add color button
  addButton.addEventListener("click", function () {
    addColorBar();
  });
});

function mixColors(colors) {
  let r = 0,
    g = 0,
    b = 0;
  colors.forEach((color) => {
    let rgb = hexToRgb(color);
    r += rgb.r;
    g += rgb.g;
    b += rgb.b;
  });

  r = Math.floor(r / colors.length);
  g = Math.floor(g / colors.length);
  b = Math.floor(b / colors.length);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  let bigint = parseInt(hex.substring(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
