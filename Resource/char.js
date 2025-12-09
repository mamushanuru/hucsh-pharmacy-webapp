const text =
  "Mohammed Nuru is a MERN stack developer certified by Evangadi. A 3rd-year health informatics student at Hawassa University, he believes his experience in collaboration, GitHub, and cloning apps like Amazon, Netflix, and Stack Overflow, makes him suitable for a senior role. He is developing a hospital web app to display lab results, pharmacy availability, and orders. Completing in 3 weeks, the project aims to address significant issues.";
const characterCount = text.length;
console.log(`The text has ${characterCount} characters.`);

function checkNumber(number) {
  if (number > 0) {
    console.log("The number is positive.");
  } else if (number < 0) {
    console.log("The number is negative.");
  } else if (number==0) {
    console.log("The number is zero.");
  }
}

// Call the function with different numbers
checkNumber(5);  // Output: The number is positive.
checkNumber(-2); // Output: The number is negative.
checkNumber(0);  // Output: The number is zero.
