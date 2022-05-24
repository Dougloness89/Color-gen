import { useEffect, useState } from 'react';
import styles from "./styles/newColors.module.css"


function App() {
  const [anim, setAnim] = useState(false)
  const [colors, setColors] = useState(new Array(5).fill({
    hex: "",
    hsl: "",
    contrast: "",
    blocked: false
  }))

  useEffect(() => {
    setTimeout(() => setAnim(true), 20)
    const handleUpdate = (ev) => {
      if (ev.key === " ") {
        fetchColors()
      }
    }
    document.addEventListener("keypress", handleUpdate)

    return () => {
      setAnim(false)
      document.removeEventListener("keypress", handleUpdate)
    }
  }, [colors])

  useEffect(() => {
    fetchColors()
  }, [])

  function fetchColors() {
    fetch("/create-colors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        colors
      })
    })
      .then(res => res.json())
      .then(corpo => {
        setColors(corpo.paleta);
        console.log(corpo)
      })
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }
  function handleColorBlock(i) {
    //Inverte o estado de bloqueio da cor no indice i
    setColors((prevColors) => {
      return prevColors.map((color, idx) => idx === i ? {...color, blocked: !color.blocked} : color)
    })
  }

  return (
    <div>
      <div className={styles.cardsWrapper}>
        {
          colors.map((color, i) => (
            <div
              className={styles.divCircle}
              key={`${i}`}
            // style={{ top: Math.floor(Math.random() * window.innerHeight - 300) + 300, left: Math.floor(Math.random() * window.innerWidth - 300) + 300 }}
            >
              <div
                  onClick={() => handleColorBlock(i)}
                  style={{
                    // transition: "all 4s linear",
                    // marginTop: "0",
                    // marginBottom: "100px",
                    backgroundColor: color.hex,
                    color: color.contrast,
                    transform: `translate(${0}px, ${rand(0, window.innerHeight - 300)}px)`,
                    transformOrigin: "bottom",
                  }}
                    className={`${styles.transicao} ${styles.card}`}
                  >
                <div
                    className={`${anim ? styles.anim : ""}`}
                // onAnimationEnd={() => setAnim(false)}
                  //onClick={() => handleColorBlock(i)}
                  //className={styles.textFormat}

                  >
                  {color.hex}
                  {`h${Math.floor(color.hsl.h)}s${Math.floor(color.hsl.s)}l${Math.floor(color.hsl.l)}`}
                </div>
                </div>
            </div>
          ))
        }
        <button onClick={() => console.log(colors)}>ESTADO</button>
      </div>
    </div>
  );
}

export default App;