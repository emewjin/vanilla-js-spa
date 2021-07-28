/**
 * client-side entry points
 * routers
 */

import Dashboard from "./views/Dashboard.js";
import Detail from "./views/Detail.js";
import Courses from "./views/Courses.js";
import routeContainer from "./routeContainer.js";
import coursesContainer from "./coursesContainer.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  // 뒤에 쿼리파라미터 등이 붙어도 인지할 수 있게 작성
  // to do : 다시 보기...
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );
  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  const routes = [
    { path: "/", view: Dashboard },
    { path: "/courses", view: Courses },
    { path: "/courses/:id", view: Detail },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  // route에 정의된 곳으로 이동하지 않는다면 기본값으로 되돌린다.
  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  // view가 class이기 때문에 new 생성자를 사용해서 새 인스턴스를 만든다
  const view = new match.route.view(getParams(match));

  // async await으로 관리해주지 않으면 자바스크립트가 요소를 찾지 못해 에러가 날까?
  document.querySelector("#app").innerHTML = await view.getHtml();

  const path = location.pathname;
  if (path === "/") routeContainer();
  if (path.includes("/courses")) coursesContainer();
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
