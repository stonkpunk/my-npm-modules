function convertToISOString(dateString) {
  const [year, month, day] = dateString.split('/').map(Number);

  // Create a new Date object with the provided date values
  const date = new Date(2000 + year, month - 1, day, 16, 0, 0);

  // Adjust the date to match EST time zone
  date.setHours(date.getHours() - 4);

  // Convert the date to ISO string
  const isoString = date.toISOString();

  return isoString;
}

function parseOptionsContractName(contractName) {
  // Extracting the relevant parts using regular expressions
  const symbol = contractName.match(/[A-Za-z]+/)[0];      // AAPL
  const expirationDate = contractName.match(/\d{6}/)[0];  // 230526
  //const optionType = contractName.match(/[A-Z](?=\d{8}$)/)[0];  // C (updated regex)
  //  const optionType = contractName.charAt(contractName.length - 9); // Extracts the character at the specific position
  // Extracting the second group of letters using regex
  const lettersRegex = /[A-Za-z]+/g;
  const letters = contractName.match(lettersRegex);
  const secondGroupOfLetters = letters.length > 1 ? letters[1] : '';

  var optionType = secondGroupOfLetters.charAt(0);  // Extracts the first character from the second group of letters
  const strikePrice = parseInt(contractName.match(/\d{8}$/)[0]);    // 00110000 (converted to an integer)

    if(optionType.toUpperCase()=="C"){
      optionType="call"
    }
    if(optionType.toUpperCase()=="P"){
      optionType="put"
    }

  // Formatting the extracted information
  const formattedExpirationDate = `${expirationDate.substr(0, 2)}/${expirationDate.substr(2, 2)}/${expirationDate.substr(4, 2)}`; // YY/MM/DD
  const formattedStrikePrice = (strikePrice / 1000).toFixed(2);  // Converts strike price to dollars and cents
  const isoTime = convertToISOString(formattedExpirationDate);

  // Creating an object with the extracted and formatted information
  const parsedContract = {
    symbol,
    expirationDateYYMMDD: formattedExpirationDate, //YYMMDD
    expirationDateISO: isoTime, //4pm est
    expirationDateUnixSeconds: Math.floor(new Date(isoTime).getTime()/1000.0), //4pm est
    optionType,
    strikePrice: parseFloat(formattedStrikePrice)
  };

  return parsedContract;
}

module.exports = {parse:parseOptionsContractName}