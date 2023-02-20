import { useCallback, useEffect, useState, useMemo } from "react";

import Header from "./components/Header/Header";
import ColorScheme from "./components/ColorScheme/ColorScheme";
import CopiedMessage from "./components/CopiedMessage/CopiedMessage";
import SavedColors from "./components/SavedColors/SavedColors";

import "./App.css";

function App() {
  // State
  const [schemeColors, setSchemeColors] = useState([]);
  const [schemeData, setSchemeData] = useState({
    selectedColor: "#FFDB58",
    selectedScheme: "monochrome",
    numColors: 5,
  });
  const [savedSchemes, setSavedSchemes] = useState(getSavedSchemes());
  const [mode, setMode] = useState("light");
  const [copiedHex, setCopiedHex] = useState({
    hex: "",
    copied: false,
  });
  const [colorRange, setColorRange] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setSchemeData((prevSchemeData) => ({
      ...prevSchemeData,
      [name]: value,
    }));
  }
  const hsl = useMemo(() => (
    schemeColors[0]
      ? {
          h: schemeColors[0].hsl.h,
          s: schemeColors[0].hsl.s,
          l: schemeColors[0].hsl.l,
        }
      : {
          h: 47,
          s: 96,
          l: 52,
        }
  ) , [schemeColors]);
  // Fetches selected scheme colors based on data stored in state
  const fetchSchemeColors = useCallback(()=> {
    const { selectedColor, selectedScheme, numColors } = schemeData;
    try {
      fetch(
        `https://www.thecolorapi.com/scheme?hex=${selectedColor.slice(
          1
        )}&mode=${selectedScheme}&count=${numColors}`
      )
        .then((response) => response.json())
        .then((data) => {
          setSchemeColors((prevSchemeColors) => data.colors);
          assignColorRange(hsl.h, hsl.s, hsl.l)
        });
    } catch (error) {
      console.log(error);
    }
  }, [hsl.h, hsl.s, hsl.l, schemeData])


  function assignColorRange(h,s, l) {
    
    let assignedColor;
    const notGBOrW = l > 5 && l <= 95 && s > 10;
    if (l > 95) {
      assignedColor = "white";
    } else if (l <= 5) {
      assignedColor = "black";
    } else if (s <= 10) {
      assignedColor = "black_and_white";
    } else if (notGBOrW && h <= 15) {
      assignedColor = "red";
    } else if (notGBOrW && h >= 16 && h <= 35) {
      assignedColor = "orange";
    } else if (notGBOrW && h >= 36 && h <= 56) {
      assignedColor = "yellow";
    } else if (notGBOrW && h >= 57 && h <= 145) {
      assignedColor = "green";
    } else if (notGBOrW && h >= 146 && h <= 170) {
      assignedColor = "teal";
    } else if (notGBOrW && h >= 171 && h <= 250) {
      assignedColor = "blue";
    } else if (notGBOrW && h >= 251 && h <= 290) {
      assignedColor = "purple";
    } else if (notGBOrW && h >= 291 && h <= 354) {
      assignedColor = "magenta";
    } else if (notGBOrW && h >= 355) {
      assignedColor = "red";
    }
    setColorRange((prevColorRange) =>  assignedColor);
  }

  //Manages side effects of accessing colors from API
  useEffect(() => {
    document.body.className = mode;
    fetchSchemeColors();
  }, [mode, fetchSchemeColors]);

// useEffect(()=> {
//   fetchSchemeColors()
// }, [fetchSchemeColors])
  // schemeData, mode, fetchSchemeColors, hsl, colorRange]
  console.log(schemeColors);
  // Click handler for saved schemes
  function handleSaveSchemeClick() {
    setSavedSchemes((prevSavedSchemes) => [schemeColors, ...prevSavedSchemes]);
  }

  // Pulls saved schemes from localStorage
  function getSavedSchemes() {
    const stringifiedSchemes = localStorage.getItem("savedSchemes");
    const storedSchemes = JSON.parse(stringifiedSchemes);
    return storedSchemes || [];
  }

  // Manages side effects of saving schemes in localStorage
  useEffect(() => {
    const stringifiedSchemes = JSON.stringify(savedSchemes);
    localStorage.setItem("savedSchemes", stringifiedSchemes);
  }, [savedSchemes]);

  // CLick handler for deleting schemes from localStorage
  function handleDeleteClick(selectedSchemeIndex) {
    setSavedSchemes((prevSavedSchemes) => {
      return prevSavedSchemes.filter(
        (scheme, index) => index !== selectedSchemeIndex
      );
    });
  }

  // Toggles ligt and darkmode and updates state
  function toggleMode() {
    mode === "light"
      ? setMode((prevMode) => "dark")
      : setMode((prevMode) => "light");
  }

  // Click handler for copying hex to clipboard
  function handleCopyHexClick(hexToCopy) {
    setCopiedHex((prevCopiedHex) => ({
      ...prevCopiedHex,
      hex: hexToCopy,
      copied: !prevCopiedHex.copied,
    }));
    navigator.clipboard.writeText(hexToCopy);

    setTimeout(() => {
      setCopiedHex((prevCopiedHex) => ({
        ...prevCopiedHex,
        hex: "",
        copied: !prevCopiedHex.copied,
      }));
    }, 1500);
  }
  console.log(colorRange)

  return (
    <div className={`${mode}`}>
      <Header
        schemeData={schemeData}
        handleChange={handleChange}
        toggleMode={toggleMode}
        mode={mode}
      />
      <main className={`${mode}`}>
        <ColorScheme
          schemeColors={schemeColors}
          handleCopyHexClick={handleCopyHexClick}
          copied={copiedHex.copied}
        />
        <button className={`btn-${mode}`} onClick={handleSaveSchemeClick}>
          Save Color Scheme
        </button>
        <SavedColors
          savedSchemes={savedSchemes}
          handleDeleteClick={handleDeleteClick}
          copied={copiedHex.copied}
          handleCopyHexClick={handleCopyHexClick}
          mode={mode}
        />
      </main>
      {copiedHex.copied && (
        <CopiedMessage mode={mode} copiedHexValue={copiedHex.hex} />
      )}
    </div>
  );
}

export default App;
