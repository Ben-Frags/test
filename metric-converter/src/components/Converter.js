import React, { useState } from 'react';
import './Converter.css';

const conversions = {
  length: {
    meters: {
      feet: 3.28084,
      yards: 1.09361,
      inches: 39.3701
    },
    kilometers: {
      miles: 0.621371
    }
  },
  weight: {
    kilograms: {
      pounds: 2.20462,
      ounces: 35.274
    }
  },
  temperature: {
    celsius: {
      fahrenheit: (c) => (c * 9/5) + 32,
      kelvin: (c) => c + 273.15
    }
  }
};

const Converter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const handleConvert = () => {
    if (!inputValue) return;
    
    const value = parseFloat(inputValue);
    if (category === 'temperature' && fromUnit === 'celsius') {
      setResult(conversions[category][fromUnit][toUnit](value).toFixed(2));
    } else {
      const conversionRate = conversions[category][fromUnit][toUnit];
      setResult((value * conversionRate).toFixed(2));
    }
  };

  const getAvailableFromUnits = () => Object.keys(conversions[category]);
  const getAvailableToUnits = () => Object.keys(conversions[category][fromUnit]);

  return (
    <div className="converter">
      <h1>Metric Converter</h1>
      
      <div className="converter-box">
        <div className="input-group">
          <select 
            value={category} 
            onChange={(e) => {
              setCategory(e.target.value);
              setFromUnit(Object.keys(conversions[e.target.value])[0]);
              setToUnit(Object.keys(conversions[e.target.value][Object.keys(conversions[e.target.value])[0]])[0]);
            }}
          >
            {Object.keys(conversions).map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>

          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {getAvailableFromUnits().map(unit => (
              <option key={unit} value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
            ))}
          </select>

          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        <div className="to">to</div>

        <div className="input-group">
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {getAvailableToUnits().map(unit => (
              <option key={unit} value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
            ))}
          </select>

          <input
            type="text"
            value={result}
            readOnly
            placeholder="Result"
          />
        </div>

        <button onClick={handleConvert}>Convert</button>
      </div>
    </div>
  );
};

export default Converter;
