/**
 * client-side entry points
 * routers
 */

const router = async () => {
  const routes = [
    { path: "/", view: () => console.log("route page") },
    { path: "/courses", view: () => console.log("courses page") },
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

  // 특정 pathname에 위치한다면 그것에 일치하는 함수를 실행하게 한다
  console.log(match.route.view());
};

document.addEventListener("DOMContentLoaded", () => {
  router();
});
