const init = () => {
  console.log("course");
  const course = document.querySelector(".course");
  course.addEventListener("click", () => {
    console.log("js works");
  });
};

export default init;
