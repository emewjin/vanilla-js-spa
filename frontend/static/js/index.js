/**
 * client-side entry points
 * routers
 */

import Dashboard from "./views/Dashboard.js";
import Courses from "./views/Courses.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/", view: Dashboard },
    { path: "/courses", view: Courses },
    { path: "/courses/:id", view: () => console.log("detail page") },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  // route에 정의된 곳으로 이동하지 않는다면 기본값으로 되돌린다.
  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  //view가 class이기 때문에 new 생성자를 사용해서 새 인스턴스를 만든다
  const view = new match.route.view();

  // async await으로 관리해주지 않으면 자바스크립트가 요소를 찾지 못해 에러가 날까?
  document.querySelector("#app").innerHTML = await view.getHtml();

  // 특정 pathname에 위치한다면 그것에 일치하는 함수를 실행하게 한다
  console.log(match.route.view());
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});
