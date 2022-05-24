const express = require('express')
const app = express()
const PORT = process.env.PORT ?? 3090

app.use(express.json())

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function get_random_color() {
  let h = rand(1, 360);
  let s = rand(0, 100);
  let l = rand(0, 100);
  return { h, s, l }
}

function hslToHex({ h, s, l }) {
  console.log({ h, s, l })
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function contrast({ l }) {
  console.log({ l })
  if (l > 50) {
    return "#000000"
  }
  else
    return "#FFFFFF"
}
function colorPallete(colors) {
  let result = colors.map(color => {
    const colorHsl = color.blocked ? color.hsl : get_random_color()
    const colorsPar = {
      hex: hslToHex(colorHsl),
      hsl: colorHsl,
      contrast: contrast(colorHsl),
      blocked: color.blocked
    }
    return colorsPar;
  })
  return result;
}

// app.get('/create-colors', (req, res) => {
//   const color = { hsl: { h: 3, s: 23, l: 48 }, hex: `#asjasgih` }
//   color.hsl = get_random_color()
//   color.hex = hslToHex(color.hsl)
//   res.send(color.hex).toJSON()
// })

app.post("/create-colors", (req, res) => {
  const { colors } = req.body
  const paleta = colorPallete(colors)
  res.status(200).json({ paleta })
})

app.listen(PORT, () => {
  console.log(`À escuta em http://localhost:${PORT}`)
})