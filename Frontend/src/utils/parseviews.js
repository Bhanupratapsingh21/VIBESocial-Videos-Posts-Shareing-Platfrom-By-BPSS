const formatViews = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // Converts 1500000 to 1.5M
    }
    if (number >= 1_000) {
      return (number / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'; // Converts 3000 to 3K
    }
    return number.toString(); // Returns number as-is if less than 1000
  };

  export default formatViews