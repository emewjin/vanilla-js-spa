const init = () => {
  console.log("route");

  const course = document.querySelector(".dashboard");
  course.addEventListener("click", () => {
    console.log("js works");
  });
};

export default init;
