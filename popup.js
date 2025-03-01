document.addEventListener("DOMContentLoaded", function () {
  const defaultColor = "#000000";
  const addButton = document.getElementById("add-color");
  const mixButton = document.getElementById("mix-colors");
  const copyButton = document.getElementById("copy-color");
  const colorBarContainer = document.getElementById("color-bar-container");
  let resultColorHex;
  const outputContainer = document.getElementById("output-container");

  outputContainer.style.display = "none";

  function addColorBar(number = 1, colorHex = defaultColor) {
    for (let i = 0; i < number; i++) {
      const newColorBar = document.createElement("div");
      newColorBar.className = "color-bar d-flex gap-1";
      newColorBar.innerHTML = `
          <input type="text" class="input-color-hex border-3 rounded-border" placeholder="# Color Hex" value="${colorHex}" />
          <input class="color-picker border-3 cursor-pointer rounded-border" type="color" value="${colorHex}" />
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

      // Add event listener to the color hex input
      colorHexInput.addEventListener("blur", function () {
        if (CSS.supports("color", colorHexInput.value)) {
          // Convert color name to hex value
          const tempElement = document.createElement("div");
          tempElement.style.color = colorHexInput.value;
          document.body.appendChild(tempElement);
          const computedColor = getComputedStyle(tempElement).color;
          document.body.removeChild(tempElement);

          const rgb = computedColor.match(/\d+/g);
          const hex = `#${(
            (1 << 24) +
            (parseInt(rgb[0]) << 16) +
            (parseInt(rgb[1]) << 8) +
            parseInt(rgb[2])
          )
            .toString(16)
            .slice(1)}`;

          colorPicker.value = hex;
          colorHexInput.value = hex;
        } else {
          alert("Invalid color!");
          colorHexInput.value = colorPicker.value;
        }
      });
    }
  }

  addColorBar(2);

  // Add event listener for the add color button
  addButton.addEventListener("click", function () {
    addColorBar();
  });

  // Add event listener for the mix colors button
  mixButton.addEventListener("click", function () {
    const colorPickers = document.getElementsByClassName("color-picker");
    const colors = Array.from(colorPickers).map((item) => item.value);
    console.log("colors: ", colors);
    const rgbResult = mixColors(colors);
    resultColorHex = rgbToHex(rgbResult);
    if (resultColorHex) {
      outputContainer.style.display = "flex";
      document.getElementById("result-color-hex").innerHTML = resultColorHex;
      document.getElementById("result-color").style.backgroundColor =
        resultColorHex;
    }
  });

  // Add event listener for the copy color button
  copyButton.addEventListener("click", function() {
    const resultColorHexElement = document.getElementById("result-color-hex");
    navigator.clipboard.writeText(resultColorHexElement.innerHTML).then(function() {
      alert("Color hex code copied to clipboard!");
    }, function(err) {
      console.error("Could not copy text: ", err);
    });
  })
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

  return { r, g, b };
}

function rgbToHex(rgb) {
  return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

function hexToRgb(hex) {
  let bigint = parseInt(hex.substring(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
